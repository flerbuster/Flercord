import FlercordLocalStorage from "../LocalStorage/FlercordLocalStorage";
import { flercode } from "../flercoding/flercode";
import { FilledOptions } from "../message-button/message-button.component";
import { DiscordGateway } from "./DiscordGateway";
import { builtinCommands } from "./FlercordBuiltinCommands";
import { Application, ApplicationCommand, ApplicationCommandResponse, CommandInteractionData, Component, DetailedGuildInfo, DiscordAttachment, DiscordFile, DiscordMessageAttachment, DmChannel, Guild, GuildChannel, LoginResponse, Message } from "./Interface";

export default class DiscordAPI {
    private constructor() { };

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
    static sortDmChannels(dmChannels: DmChannel[]): DmChannel[] {
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
              authorization: FlercordLocalStorage.token || "",
              'Content-Type': 'application/json'
            },
          };
          const response = await fetch(
            `${this.base_url}/channels/${channel_id}/messages?limit=100`,
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
              authorization: FlercordLocalStorage.token || "",
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

    static async getAllMessagesIn(channel_id: string): Promise<Message[]> {
      let d = 0
      let messages: Message[] = await this.getMessages(channel_id)
      if (messages.length < 50) return messages
      let new_messages: Message[] = []
      do {
        new_messages = await this.getMessagesBefore(messages[0].id, channel_id)
        messages = new_messages.concat(messages)
        console.log(messages)
        d++
      } while (new_messages.length >= 50)

      return messages
    }

    static async sendMessage(channel_id: string, content?: string, tts?: boolean, attachments?: DiscordMessageAttachment[]): Promise<Message> {
      const text = FlercordLocalStorage.flercode ? flercode(content) : content
        let body = {
          mobile_network_type: 'unknown',
          content: text,
          nonce: this.generateNonce(),
          tts: tts,
          flags: 0,
          attachments: attachments
        };
    
        const options = {
          method: 'POST',
          headers: {
            authorization: FlercordLocalStorage.token || "",
            'content-type': 'application/json',
          },
          body: JSON.stringify(body),
        };
    
        console.log(body);
    
        return await(await fetch(`${this.base_url}/channels/${channel_id}/messages`, options)).json() as Message;
    }

    static async respondToMessage(channel_id: string, message_id: string, content?: string, tts?: boolean, attachments?: DiscordMessageAttachment[]): Promise<Message> {
      let body = {
        mobile_network_type: 'unknown',
        content: content,
        nonce: this.generateNonce(),
        tts: tts,
        flags: 0,
        attachments: attachments,
        message_reference: {
          channel_id: channel_id,
          message_id: message_id
        }
      };
  
      const options = {
        method: 'POST',
        headers: {
          authorization: FlercordLocalStorage.token || "",
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      };
  
      console.log(body);
  
      return await(await fetch(`${this.base_url}/channels/${channel_id}/messages`, options)).json() as Message;
    }

    static async deleteMessage(channel_id: string, message_id: string): Promise<void> {
        const options = {
          method: 'DELETE',
          headers: {
            authorization: FlercordLocalStorage.token || "",
            'content-type': 'application/json',
          }
        };
        
        fetch(`${this.base_url}/channels/${channel_id}/messages/${message_id}`, options)
    }

    static async deleteLastMessages(messagesa: number, channel_id: string) {
      let messages = await this.getMessages(channel_id)
      let i = 0
      for (let message of messages) {
        i++
        setTimeout(() => {
          this.deleteMessage(channel_id, message.id)
        }, i*1550)
      }
    }

    // typing
    static async type(channel_id: string) {
      const options = {
        method: 'POST',
        headers: {
          authorization: FlercordLocalStorage.token || "",
          'content-type': 'application/json',
        }
      };
      
      fetch(`${this.base_url}/channels/${channel_id}/typing`, options)
    }


    // User
    static async fetchUserDmChannels(): Promise<DmChannel[]> {
        try {
          const options = {
            method: "GET",
            headers: {
              authorization: FlercordLocalStorage.token || "",
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
              authorization: FlercordLocalStorage.token || "",
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
              authorization: FlercordLocalStorage.token || "",
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
              authorization: FlercordLocalStorage.token || "",
              "Content-Type": "application/json"
            }
          }
          const response = await fetch(`${this.base_url}/guilds/${guild_id}/channels`, options);
          const data = await response.json() as GuildChannel[];
        
            return data;
        } catch (error) {
          console.error('Error:', error);
          return []
        }
    }

    // Command
    static async getApplicationCommands(guild_id: string): Promise<ApplicationCommandResponse> {
      try {
        const options = {
          method: "GET",
          headers: {
            authorization: FlercordLocalStorage.token || "",
            "Content-Type": "application/json"
          }
        }
        const response = await fetch(`${this.base_url}/guilds/${guild_id}/application-command-index`, options);
        const data = await response.json() as ApplicationCommandResponse;
      
          return data;
      } catch (error) {
        console.error('Error:', error);
        return undefined
      }
    }

    static async useCommand(guild_id: string, 
      channel_id: string, 
      command: ApplicationCommand,
      application: Application,
      filledOptions: FilledOptions
      ) {
      let session_id = DiscordGateway.getInstance().data.session_id

      let data: CommandInteractionData = {
        type: 2,
        application_id: application.id,
        guild_id: guild_id,
        channel_id: channel_id,
        session_id: session_id,
        data: {
          version: command.version,
          id: command.id,
          name: command.name,
          type: command.type,
          options: filledOptions,
          application_command: {
            id: command.id,
            type: command.type,
            application_id: command.application_id,
            version: command.version,
            name: command.name,
            description: command.description,
            integration_types: command.integration_types,
            global_popularity_rank: 0,
            options: command.options,
            description_localized: command.description,
            name_localized: command.name
          },
          attachments: [],
        },
        nonce: this.generateNonce(),
        analytics_location: "gehirn"
      }

          
      const options = {
        method: 'POST',
        headers: {
          authorization: FlercordLocalStorage.token || "",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
  
      const response = await fetch("https://discord.com/api/v9/interactions", options);
    }

    static findBuiltinCommand(commandId: string) {
      return builtinCommands.find((cmd) => cmd.id == commandId)
    }

    static async clickButton(application_id: string, channel_id: string, guild_id: string, message_id: string, component: Component,
      message_flags: number) {
      let session_id = DiscordGateway.getInstance().data.session_id
      
      let message: Message
      let data = {
        application_id: application_id,
        channel_id: channel_id,
        data: {
          component_type: component.type,
          custom_id: component.custom_id
        },
        guild_id: guild_id,
        message_flags: message_flags,
        message_id: message_id,
        nonce: this.generateNonce(),
        session_id: session_id,
        type: 3
      }

      const options = {
        method: 'POST',
        headers: {
          authorization: FlercordLocalStorage.token || "",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
  
      const response = await fetch("https://discord.com/api/v9/interactions", options);
    }

    // Attachment
    static async createAttachment(files: DiscordFile[], channel_id: string): Promise<DiscordAttachment[]> {
        const attachmentUrl =`${this.base_url}/channels/${channel_id}/attachments`;
    
        const options = {
          method: 'POST',
          headers: {
            authorization: FlercordLocalStorage.token || "",
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


    // Login
    static async login(login: string, password: string): Promise<LoginResponse> {
      const body = {
        login,
        password,
        undelete: false
      }

      const response = await fetch("https://discord.com/api/v9/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { 
          'Content-Type': "application/json" 
        }
      })

      const json = await response.json()

      return json
    }


    // Util
    static userAvatar(user: { avatar?: string, id: string }): string {
      if (user.avatar?.startsWith("https")) return user.avatar
      let icon_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/310px-Placeholder_view_vector.svg.png"
      if (user.avatar) icon_url =  `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`
      return icon_url
    }
}