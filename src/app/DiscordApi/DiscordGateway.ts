import { auth } from "./DiscordApi";

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
    data: any;
  
    ws: WebSocket | undefined;
    private heartbeatInterval: number = 999999;
    wait = false
  
    eventListeners: Map<string, Array<(event: any) => void>> = new Map();
  
    private consolelog(...args: any[]): void {
      if (this.log) console.log(...args);
    }
  
    private constructor() {
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
        console.log("sending init_payload", init_payload);
        this.ws.send(JSON.stringify(init_payload))
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
          this.data = eventData.d
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
        } else {
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
      let session = this.data.sessions[this.data.sessions.length - 1]
      let resumePayload = {
        "op": ClientActionOpCode.Resume,
        "d": {
          "token": auth,
          "session_id": session.session_id,
          "seq": undefined
        }
      }
      this.connectToWebSocket(this.data.resume_gateway_url, resumePayload);
    }
  
    private sendIdentifyPayload() {
      // Check if the WebSocket is open before sending data
      if (this.ws)
        if (this.ws.readyState === WebSocket.OPEN) {
          const identifyPayload = {
            op: ClientActionOpCode.Identify,
            d: {
              token: auth,
              intents: 3276799, 
              properties: {
                $os: 'fleros',
                $browser: 'chrome',
                $device: 'crhome',
              },
              large_threshold: 250,
            },
          };
  
          // Convert the payload to a JSON string and send it
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
  