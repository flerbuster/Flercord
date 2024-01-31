import { FilledOptions } from "../message-button/message-button.component";
import DiscordAPI from "./DiscordApi";
import { Application, ApplicationCommand } from "./Interface";

export interface BuiltinCommand extends ApplicationCommand {
    handleCall: (channelId: string, guildId?: string, filledOptions?: FilledOptions) => any
}

const flercordApplicationId = "1"

export function chunk<T>(array: T[], n: number): T[][] {
    const result: T[][] = []

    for (let i = 0; i < array.length; i += n) {
        result.push(array.slice(i, i + n))
    }

    return result
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

export const builtinCommands: BuiltinCommand[] = [{
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
      description_localized: "",
      name_localized: ""
    }],
    handleCall: (channelId: string, guildId?: string, filledOptions?: FilledOptions) => {
        DiscordAPI.getAllMessagesIn(channelId).then((messages) => {
            let users = [...new Set(messages.map((msg) => msg.author.id))]
            let multiple = filledOptions.find((option) => option.name == "multiple" && option.value == "true")

            if (multiple) {
                chunk(users, 15).forEach((usersBatch) => {
                    DiscordAPI.sendMessage(channelId, `${usersBatch.map((user) => `<@${user}>`).join(", ")}`)
                })
            } else {
                users.forEach((user) => {
                    DiscordAPI.sendMessage(channelId, `<@${user}>`)
                })
            }
        })

    }
  }]
