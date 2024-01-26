import FlercordLocalStorage from "../LocalStorage/FlercordLocalStorage";
import { DiscordGateway } from "./DiscordGateway";
import { GuildMember, ReadyEvent } from "./Interface";

enum ClientVoieOpCodes {
    Identify = 0,
    GatewayVoiceStateUpdate = 4
}

interface VoiceServerupdatePayload {
    token: string,
    guild_id: string,
    endpoint: string
}

interface RTPPacket {
    versionFlags: number; // Single byte value of 0x80
    payloadType: number; // Single byte value of 0x78
    sequence: number; // Unsigned short (big endian)
    timestamp: number; // Unsigned integer (big endian)
    ssrc: number; // Unsigned integer (big endian)
    encryptedAudio: Uint8Array; // Binary data
}


interface VoiceMember {
    member: {
      user: {
        username: string;
        public_flags: number;
        id: string;
        global_name: string;
        display_name: string;
        discriminator: string;
        bot: boolean;
        avatar_decoration_data: null | any; // You may need to replace 'any' with a more specific type
        avatar: null | any; // You may need to replace 'any' with a more specific type
      };
      roles: string[];
      premium_since: null | any; // You may need to replace 'any' with a more specific type
      pending: boolean;
      nick: null | any; // You may need to replace 'any' with a more specific type
      mute: boolean;
      joined_at: string;
      flags: number;
      deaf: boolean;
      communication_disabled_until: null | any; // You may need to replace 'any' with a more specific type
      avatar: null | any; // You may need to replace 'any' with a more specific type
    };
    user_id: string;
    suppress: boolean;
    session_id: string;
    self_video: boolean;
    self_mute: boolean;
    self_deaf: boolean;
    request_to_speak_timestamp: null | any; // You may need to replace 'any' with a more specific type
    mute: boolean;
    guild_id: string;
    deaf: boolean;
    channel_id: string;
  }

  interface VoiceReady {
    experiments: string[];
    heartbeat_interval: number;
    ip: string;
    modes: string[];
    port: number;
    ssrc: number;
    streams: {
      active: boolean;
      quality: number;
      rid: string;
      rtx_ssrc: number;
      ssrc: number;
      type: string;
    }[];
  }

  interface VoiceInit {
    audio_codex: string,
    media_session_id: string,
    mode: string,
    secret_id: number[],
    secure_frames_version: number,
    video_codec: string
  }


  enum SpeakFlag {
    Microphone = 1 << 0,
    Soundshare = 1 << 1,
    Priority = 1 << 2
}

function toFlag(...flags: SpeakFlag[]): number {
    let result = 0;
    flags.forEach(flag => {
        result |= flag;
    });
    return result;
}

/*
"member":{
    "user":{
        "username":"flercord_51742",
        "public_flags":0,
        "id":"1084532265792573522",
        "global_name":"flercord",
        "display_name":"flercord",
        "discriminator":"0",
        "bot":false,
        "avatar_decoration_data":null,
        "avatar":null
    },
    "roles":[],
    "premium_since":null,
    "pending":false,
    "nick":null,
    "mute":false,
    "joined_at":"2024-01-23T21:00:32.673335+00:00",
    "flags":0,
    "deaf":false,
    "communication_disabled_until":null,
    "avatar":null
},
"user_id":"1084532265792573522",
"suppress":false,
"session_id":"381682be1eec2ad51be4e71c65734be5",
"self_video":false,
"self_mute":true,
"self_deaf":true,
"request_to_speak_timestamp":null,"mute":false,"guild_id":"921756846874828801",
"deaf":false,"channel_id":"921756846874828805"}}
*/

export class DiscordVoiceGateway {
    serverData: VoiceServerupdatePayload | undefined = undefined
    stateData: VoiceMember | undefined = undefined
    voiceReadyData: VoiceReady | undefined = undefined
    heartbeatInverval: number = 99999
    ws: WebSocket | undefined;
    voiceInit: VoiceInit | undefined = undefined

    d = null

    constructor() {
        //DiscordGateway.getInstance().onEvent("VOICE_SERVER_UPDATE", this.initializeEvent)
        //DiscordGateway.getInstance().onEvent("VOICE_SERVER_UPDATE", this.initializeEvent)
    }

    initializeEvents() {
        DiscordGateway.getInstance().onEvent("VOICE_STATE_UPDATE", this.initializeStateEvent)
        DiscordGateway.getInstance().onEvent("VOICE_SERVER_UPDATE", this.initializeEvent)
    }

    connectTo(guildId: string, channelId: string, mute: boolean = false, deaf: boolean = false) {
        let payload = {
            "op": ClientVoieOpCodes.GatewayVoiceStateUpdate,
            "d": {
              "guild_id": guildId,
              "channel_id": channelId,
              "self_mute": mute,
              "self_deaf": deaf
            }
        }
        DiscordGateway.getInstance().sendPayload(payload)
    }

    heartbeatSetInterval: ReturnType<typeof setInterval>

    identify(payload: any = undefined) {
        if (this.serverData && this.stateData && !this.ws) {
            this.ws = new WebSocket("wss://" + this.serverData.endpoint);

            let identifyPayload = payload ? payload : {
                "op": 0,
                "d": {
                  "server_id": this.stateData.guild_id,
                  "user_id": this.stateData.member.user.id,
                  "session_id": this.stateData.session_id,
                  "token": this.serverData.token
                }
            }

            this.ws.onopen = (event) => {
                console.log("open voice: ", event)
                this.ws!.send(JSON.stringify(identifyPayload))

            };

            this.ws.onmessage = (event) => {
                let recievedData = JSON.parse(event.data)
                console.log("message voice: ", recievedData)

                if (recievedData.op == 2) {
                    this.voiceReadyData = recievedData.d

                    this.establishUDP()
                }
                if (recievedData.op == 8) {
                    this.heartbeatInverval = recievedData.d.heartbeat_interval
                    this.d = this.heartbeatInverval

                    console.log("recieved heartbeat inverval: ", this.heartbeatInverval)

                    this.sendHeartbeat()
                    if (this.heartbeatInverval) clearInterval(this.heartbeatSetInterval)
                    this.heartbeatSetInterval = this.startHeartbeat()
                }
                if (recievedData.op == 4) {
                    this.voiceInit = recievedData.d as VoiceInit
                    console.log("recieved voice init: ", this.voiceInit)

                    setInterval(() => {
                        this.speak()
                    }, 1000)
                }
                if (recievedData.op == 6) {
                    this.d = recievedData.d
                    console.log("heartbeat recieved: ", recievedData)
                }
            }
          
            this.ws.onclose = (event) => {
                console.log("close voice: ", event)
                clearInterval(this.heartbeatSetInterval)
                if (event.reason === 'Rate limited') {
                    setTimeout(() => {
                      this.resumeGateway(this.stateData!.guild_id, this.stateData!.session_id, this.serverData!.token);
                    }, 60000);
                  } else {
                    this.resumeGateway(this.stateData!.guild_id, this.stateData!.session_id, this.serverData!.token)
                  }
            };
        }

    }

    private establishUDP() {
        let data = {
            op: 1,
            d: {
                protocol: "udp",
                data: {
                    adress: this.voiceReadyData.ip,
                    port: this.voiceReadyData.port,
                    mode: this.voiceReadyData.modes[0],
                }
            }
        }

        console.log("voice sending: ", data)
        this.ws.send(JSON.stringify(data))
    }

    private resumeGateway(server_id: string, session_id: string, token: string) {
        let resumePayload = {
          "op": 7,
          "d": {
            "token": token,
            "session_id": session_id,
            "server_id": server_id
          }
        }
        this.identify(resumePayload);
      }

    sendHeartbeat = () => {
        if (this.ws) {
            let payload = { op: 3, d: Math.floor(Math.random()*10000000000000)}
            this.ws.send(JSON.stringify(payload))
            console.log("send heartbeat: ", payload)
        }
    }

    startHeartbeat = () => {
        return setInterval(() => {
            this.sendHeartbeat()
        }, this.heartbeatInverval)
    }

    initializeEvent = (event: VoiceServerupdatePayload) => {
        this.serverData = event
        console.log("initialize event data: ", this.serverData)

        if (this.stateData && this.serverData) this.identify()
    }

    initializeStateEvent = (event: VoiceMember) => {
        this.stateData = event
        console.log("initialize state event data: ", this.stateData)

        if (this.stateData && this.serverData) this.identify()
    }

    speak = () => {
        let data = {
            "op": 5,
            "d": {
                "speaking": 1,
                "delay": 0,
                "ssrc": 140350
            }
        }

        console.log("sending data to voice client (speaking)", data)
        this.ws.send(JSON.stringify(data))

        let packet: RTPPacket = {
            versionFlags: 1,
            payloadType: 1,
            sequence: 1,
            timestamp: new Date().valueOf(),
            ssrc: 140350,
            encryptedAudio: new Uint8Array([0xF8, 0xFF, 0xFE])
        }

        console.log("also sending packet: ", packet)
        this.ws.send(JSON.stringify(packet))
    }
}
  