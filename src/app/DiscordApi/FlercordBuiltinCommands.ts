import FlercordLocalStorage from "../LocalStorage/FlercordLocalStorage";
import { FilledOptions } from "../message-button/message-button.component";
import DiscordAPI from "./DiscordApi";
import { Application, ApplicationCommand } from "./Interface";

export interface BuiltinCommand extends ApplicationCommand {
    handleCall: (channelId: string, guildId?: string, filledOptions?: FilledOptions) => any
}

const flercordApplicationId = "1"

export function flatten<T>(arr: T[][]): T[] {
    return ([] as T[]).concat(...arr);
}

export function chunk<T>(array: T[], n: number): T[][] {
    const result: T[][] = []

    for (let i = 0; i < array.length; i += n) {
        result.push(array.slice(i, i + n))
    }

    return result
}

export function downloadFile(content: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'event-log.txt';
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

export const builtinApplication: Application = {
    bot: {
        avatar: "https://plaudertisch.com/wp-content/uploads/2019/12/Gehirn-Jogging.jpg",
        avatar_decoration_data: undefined,
        bot: true,
        discriminator: undefined,
        display_name: "builtin",
        global_name: "builtin",
        id: flercordApplicationId,
        public_flags: 0,
        username: "builtin"
    },
    description: "builtin flercord commands",
    id: flercordApplicationId,
    name: "builtin"
}

const pingspamCommand : BuiltinCommand = {
    application_id: flercordApplicationId,
    description: "ping spams channel",
    id: "gehirn",
    integration_types: [],
    name: "pingspam",
    type: 2,
    version: "1",
    options: [{
      type: 2,
      name: "multiple",
      description: "ping multiple users at once",
      required: false,
      autocomplete: false,
      description_localizations: { },
      name_localizations: { }
    }, {
        type: 2,
        name: "exclude",
        description: "exclude user ids",
        required: false,
        autocomplete: false,
        description_localizations: { },
        name_localizations: { }
    }],
    handleCall: (channelId: string, guildId?: string, filledOptions?: FilledOptions) => {
        DiscordAPI.getAllMessagesIn(channelId).then((messages) => {
            let excluded = (filledOptions.find((option) => option.name == "exclude")?.value ?? "").split(",")
            let users = [...new Set(messages.map((msg) => msg.author.id))].filter((user) => !excluded.includes(user))
            let multiple = filledOptions.find((option) => option.name == "multiple" && option.value == "true")

            setInterval(() => {
                if (multiple) {
                    chunk(users, 15).forEach((usersBatch) => {
                        DiscordAPI.sendMessage(channelId, `${usersBatch.map((user) => `<@${user}>`).join(", ")}`)
                    })
                } else {
                    users.forEach((user) => {
                        DiscordAPI.sendMessage(channelId, `<@${user}>`)
                    })
                }
            }, 3000)
        })

    }
}

const downloadChannelCommand : BuiltinCommand = {
    application_id: flercordApplicationId,
    description: "download channel",
    id: "gehirn2",
    integration_types: [],
    name: "downloadchannel",
    type: 2,
    version: "1",
    options: [],
    handleCall: (channelId: string, guildId?: string, filledOptions?: FilledOptions) => {
        DiscordAPI.getAllMessagesIn(channelId).then((messages) => {
            console.log("all messages: ", messages)
            downloadFile(JSON.stringify(messages))
        })
    }
}

const flercodeCommand : BuiltinCommand = {
    application_id: flercordApplicationId,
    description: "set flercode",
    id: "gehirn3",
    integration_types: [],
    name: "flercode",
    type: 2,
    version: "1",
    options: [{
        type: 2,
        name: "flercode",
        description: "flercode oder nicht",
        required: true,
        autocomplete: false,
        description_localizations: { },
        name_localizations: { },
        choices: [{
            name: "true",
            value: "true"
        }, {
            name: "false",
            value: "false"
        }]
      }],
    handleCall: (channelId: string, guildId?: string, filledOptions?: FilledOptions) => {
        FlercordLocalStorage.flercode = filledOptions.find((option) => option.name == "flercode").value == "true"
    }
}

export const builtinCommands: BuiltinCommand[] = [pingspamCommand, downloadChannelCommand, flercodeCommand]
