import { DetailedGuildInfo, DiscordAttachment, DiscordFile, DiscordMessageAttachment, DmChannel, Guild, GuildChannel, Message } from "./Interface";

export const auth = ""

export default class DiscordAPI {
    private constructor() {};

    public static base_url =  'https://discord.com/api/v9'

    // Generate Nonce
    private static generateNonce(): string {
        let result = '';
        for (let i = 0; i < 19; i++) {
          const randomDigit = Math.floor(Math.random() * 10); // Generate a random digit from 0 to 9
          result += randomDigit.toString();
        }
        return result;
    }


    // Sort DM Channels
    private static sortDmChannels(dmChannels: DmChannel[]): DmChannel[] {
        return dmChannels.sort((a, b) => {
        // Convert the last_message_id to numbers for comparison
        const lastMessageIdA = Number(a.last_message_id);
        const lastMessageIdB = Number(b.last_message_id);
        
        // Compare and sort in descending order
        if (lastMessageIdA > lastMessageIdB) {
            return -1;
        } else if (lastMessageIdA < lastMessageIdB) {
            return 1;
        } else {
            return 0;
        }
        });
    }
    

    // MESSAGE
    static async getMessages(channel_id: string): Promise<Message[]> {
        let message_list: Message[] = []
        try {
          const options = {
            method: 'GET',
            headers: {
              authorization: auth,
              'Content-Type': 'application/json',
            },
          };
          const response = await fetch(
            `${this.base_url}/channels/${channel_id}/messages`,
            options
          );
          const data = await response.json() as Message[]

          message_list = data.reverse();
        } catch (error) {
          console.error('Error:', error);
        } finally {
          return message_list
        }
    }

    static async getMessagesBefore(id: string, channel_id: string | undefined): Promise<Message[]> {
        let message_list: Message[] = []
        try {
          const options = {
            method: 'GET',
            headers: {
              authorization: auth,
              'Content-Type': 'application/json',
            },
          };
          const response = await fetch(
            `${this.base_url}/channels/${channel_id}/messages?before=${id}`,
            options
          );
          const data = await response.json() as Message[];
          
          message_list = data.reverse(); // Assign the data to the property
        } catch (error) {
          console.error('Error:', error);
        } finally {
          return message_list
        }
    }

    static async sendMessage(channel_id: string, content?: string, tts?: boolean, attachments?: DiscordMessageAttachment[]) {
        let body = {
          mobile_network_type: 'unknown',
          content: content,
          nonce: this.generateNonce(),
          tts: tts,
          flags: 0,
          attachments: attachments
        };
    
        const options = {
          method: 'POST',
          headers: {
            authorization: auth,
            'content-type': 'application/json',
          },
          body: JSON.stringify(body),
        };
    
        console.log(body);
    
        return await fetch(`${this.base_url}/channels/${channel_id}/messages`, options);
    }

    static async deleteMessage(channel_id: string, message_id: string): Promise<void> {
        const options = {
          method: 'DELETE',
          headers: {
            authorization: auth,
            'content-type': 'application/json',
          }
        };
        
        fetch(`${this.base_url}/channels/${channel_id}/messages/${message_id}`, options)
    }


    // User
    static async fetchUserDmChannels(): Promise<DmChannel[]> {
        try {
          const options = {
            method: "GET",
            headers: {
              authorization: auth,
              "Content-Type": "application/json"
            }
          }
          const response = await fetch(`${this.base_url}/users/@me/channels`, options);
          const data = await response.json() as DmChannel[];
    
          return this.sortDmChannels(data);
        } catch (error) {
          console.error('Error:', error);
          return []
        }
    }

    static async fetchUserGuilds(): Promise<Guild[]> {
        try {
          const options = {
            method: "GET",
            headers: {
              authorization: auth,
              "Content-Type": "application/json"
            }
          }
          const response = await fetch(`${this.base_url}/users/@me/guilds`, options);
          const data = await response.json() as Guild[];
    
          return data;
        } catch (error) {
          console.error('Error:', error);
          return []
        }
    }


    // Guild
    static async getGuild(id: string): Promise<DetailedGuildInfo | undefined> {
        try {
          const options = {
            method: "GET",
            headers: {
              authorization: auth,
              "Content-Type": "application/json"
            }
          }
          const response = await fetch(`${this.base_url}/guilds/${id}`, options);
          const data = await response.json();
          
          return data as DetailedGuildInfo
        } catch (error) {
          console.error('Error:', error);
          return undefined
        }
    }

    static async getChannels(guild_id: string): Promise<GuildChannel[]> {
        try {
          const options = {
            method: "GET",
            headers: {
              authorization: auth,
              "Content-Type": "application/json"
            }
          }
          const response = await fetch(`${this.base_url}/guilds/${guild_id}/channel`, options);
          const data = await response.json() as GuildChannel[];
        
            return data;
        } catch (error) {
          console.error('Error:', error);
          return []
        }
    }


    // Attachment
    static async createAttachment(files: DiscordFile[], channel_id: string): Promise<DiscordAttachment[]> {
        const attachmentUrl =`${this.base_url}/channels/${channel_id}/attachments`;
    
        const options = {
          method: 'POST',
          headers: {
            authorization: auth,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({files: files}),
        };
    
        const response = await fetch(attachmentUrl, options);
    
        const data = await response.json();
    
        return data.attachments as DiscordAttachment[];
    }
    
    static async uploadAttachment(attachment: DiscordAttachment, file: File) {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
    
        reader.onload = (e) => {
          const fileContent = reader.result as ArrayBuffer;
    
          const blob = new Blob([fileContent]);
          const formData = new FormData();
          formData.append('file', blob, '.flercordupload');
          formData.append('fileType', file.type);
    
          const options = {
            method: "PUT",
            body: formData,
            headers: { 
              'Content-Type': "application/octet-stream" 
            }
          }
    
    
          const response = fetch(attachment.upload_url, options).then(response => {
            console.log(response.json());
          })
    
        }

        // TODO: mit browser funktionieren, überhaupt funtionieren
    }
}