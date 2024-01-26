import FlercordLocalStorage from "../LocalStorage/FlercordLocalStorage";
import { Command } from "../command/Command";
import DiscordAPI from "./DiscordApi";
import { ReadyEvent } from "./Interface";
import { DiscordVoiceGateway } from "./VoiceGateway";

enum ClientActionOpCode {
    Dispatch = 0,
    Heartbeat = 1,
    Identify = 2,
    PresenceUpdate = 3,
    VoiceStateUpdate = 4,
    Resume = 6,
    Reconnect = 7,
    RequestGuildMembers = 8,
    InvalidSession = 9,
    Hello = 10,
    HeartbeatACK = 11,
}

export class DiscordGateway {
    private static instance: DiscordGateway | null = null;
    private log = true;
    data?: ReadyEvent;
    public voiceGateway: DiscordVoiceGateway
  
    ws: WebSocket | undefined;
    private heartbeatInterval: number = 999999;
    wait = false
  
    eventListeners: Map<string, Array<(event: any) => void>> = new Map();
  
    private consolelog(...args: any[]): void {
      if (this.log) console.log(...args);
    }
  
    private constructor() {
      this.voiceGateway = new DiscordVoiceGateway()
    }
  
    static getInstance(): DiscordGateway {
      if (DiscordGateway.instance === null) {
        DiscordGateway.instance = new DiscordGateway();
      }
      return DiscordGateway.instance;
    }
  
    connectToWebSocket(gateway_url: string = 'wss://gateway.discord.gg', init_payload: any = undefined) {
      this.ws = new WebSocket(gateway_url);
      if (init_payload != undefined) {
        this.ws.onopen = () => {
          console.log("sending init_payload", init_payload);
          this.ws!.send(JSON.stringify(init_payload))
        }
      }
      this.ws.onopen = (event) => {
        this.consolelog('Connected to Discord Gateway', event);
      };
  
      this.ws.onmessage = (event) => {
        this.consolelog(event.data);
        const eventData = JSON.parse(event.data);
  
        if (eventData.op === ClientActionOpCode.Hello) {
          this.heartbeatInterval = eventData.d.heartbeat_interval;
          this.startHeartbeat();
          this.wait = true
          
        } else if (eventData.t == 'READY') {
          console.log('ready event received!');
  
          console.log(eventData.d)
          this.data = eventData.d as ReadyEvent
          this.voiceGateway.initializeEvents()
          Command.initializeCommandEventListener()

          //this.voiceGateway.connectTo("900864183246135346", "900864183690743840")

        } else if (eventData.op === ClientActionOpCode.InvalidSession) {
          this.ws?.close();
          this.connectToWebSocket();
          this.consolelog('reconnected, because op code was 9.');
          //this.sendIdentifyPayload();
        } else if (eventData.op === ClientActionOpCode.HeartbeatACK) {
          this.consolelog('recieved ACK');
          if (this.wait) {
            this.sendIdentifyPayload();
            this.wait = false;
          }
        }

        
        for (let [
          event_type,
          event_listeners,
        ] of this.eventListeners.entries()) {
          if (event_type === eventData.t) {
            for (let event_listener of event_listeners) {
              event_listener(eventData.d);
            }
          }
        }
      };
  
      this.ws.onclose = (event) => {
        if (event.reason === 'Rate limited') {
          setTimeout(() => {
            this.resumeGateway();
          }, 60000);
        } else {
          this.consolelog('WebSocket is closed:', event.reason);
          this.consolelog("trying to reconnect...")
          this.resumeGateway()
        }
      };
    }
  
    private resumeGateway() {
      let session = this.data?.sessions[this.data.sessions.length - 1]
      let resumePayload = {
        "op": ClientActionOpCode.Resume,
        "d": {
          "token": FlercordLocalStorage.token,
          "session_id": session?.session_id,
          "seq": undefined
        }
      }
      this.connectToWebSocket(this.data?.resume_gateway_url, resumePayload);
    }

    sendPayload(payload: any) {
      if (this.ws)
        if (this.ws.readyState === WebSocket.OPEN) {
          console.log("sending payload", payload);
          this.ws.send(JSON.stringify(payload));
        }
    }
  
    private sendIdentifyPayload() {
      if (this.ws)
        if (this.ws.readyState === WebSocket.OPEN) {
          const identifyPayload = {
            op: ClientActionOpCode.Identify,
            d: {
              token: FlercordLocalStorage.token,
              intents: 3276799, 
              properties: {
                $os: 'fleros',
                $browser: 'chrome',
                $device: 'crhome',
              },
              large_threshold: 250,
            },
          };
  
          console.log("sending identify payload", identifyPayload);
          this.ws.send(JSON.stringify(identifyPayload));
        }
    }
  
    private sendHeartbeat() {
      if (this.ws)
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ op: 1, d: null }));
          this.consolelog('sent heartbeat');
        }
    }
  
    private startHeartbeat() {
      this.sendHeartbeat();
      setInterval(() => {
        this.sendHeartbeat();
      }, this.heartbeatInterval);
    }
  
    onEvent(event: string, callback: (event: any) => void) {
      let current =
        this.eventListeners.get(event) ?? new Array<(event: any) => void>();
      current.push(callback);
      this.eventListeners.set(event, current);
    }
  }
  