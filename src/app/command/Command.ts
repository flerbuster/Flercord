import DiscordAPI from "../DiscordApi/DiscordApi";
import { DiscordGateway } from "../DiscordApi/DiscordGateway";
import { Author, Message, PublicUser } from '../DiscordApi/Interface';
import FlercordLocalStorage from "../LocalStorage/FlercordLocalStorage";
import { ToastState } from "../toast-alert/ToastState";

export class Command {
    constructor(public name: string, public response: string, public creator: Author, public creationDate: Date, public args: { name: string, value: string }[] ) {
        
    }

    static createCommandByString(input: string, creator: Author): Command | null {
        const regex = /(?:'[^']*'|[^\s']+)(?=\s|$)/g;
        const match = input.match(regex);
      
        //console.log("input: ", input, ", match: ", match)
        if (match && match[0]=="!createFlercordCommand") {
            const commandName = match[1].replaceAll("'", "");
            const commandResponse = match[2].replaceAll("'", "");

            const finalParts: { name: string, value: string }[] = []

            for (let i = 3; i < match.length; i++) {
                try {
                    let part = match[i]

                    let parts = part.split("=")

                    let name = parts[0]
                    let value = parts[1]

                    if (name && value) finalParts.push({ name, value })            
                } catch (exception) {

                }    
            }

            //console.log(finalParts)

            return new Command(commandName, commandResponse, creator, new Date(), finalParts);
        } else {
            return null; // Invalid command
        }
    }

    static getDelete(input: string, creator: Author): string | null {
        const regex = /(?:'[^']*'|[^\s']+)(?=\s|$)/g;
        const match = input.match(regex);
      
        //console.log("input: ", input, ", match: ", match)
        if (match && match[0]=="!deleteFlercordCommand") {
            return match[1]
        } else {
            return null; // Invalid command
        }
    }

    toString() {
        return `Command(namme: ${this.name}, response: ${this.response})`
    }

    static deserialize(str: string) {
        let obj = JSON.parse(str)
        return new Command(obj.name, obj.response, obj.creator, new Date(obj.creationDate), obj.finalParts)
    }

    static deserializeAll(str: string) {
        let list = JSON.parse(str)
        return list.map((obj) => new Command(obj.name, obj.response, obj.creator, new Date(obj.creationDate), obj.finalParts))
    }

    static serializeAll(commands: Command[]) {
        let list: object[] = commands.map((command) => { return { name: command.name, response: command.response, 
            creator: command.creator, creationDate: command.creationDate, finalParts: command.args } })
        return JSON.stringify(list)
    }


    serialize(): string {
        return JSON.stringify({ name: this.name, response: this.response, creator: this.creator, creationDate: this.creationDate, finalParts: this.args })
    }

    static argNotSetOrMatching(args: { name: string, value: string }[], key: string, value: string): boolean {
        if (args.find((arg) => arg.name == key) == undefined) return true
        return args.find((arg) => arg.name == key).value == value
    }

    static argSetAndMatching(args: { name: string, value: string }[], key: string, value: string): boolean {
        //console.log("a", args, key, value)
        if (args.find((arg) => arg.name == key) == undefined) return false
        //console.log("b", args[key] == value)
        return args.find((arg) => arg.name == key).value == value
    }

    static argNotSetOrContaining(args: { name: string, value: string }[], key: string, value: string): boolean {
        if (args.find((arg) => arg.name == key) == undefined) return true
        return JSON.parse(args.find((arg) => arg.name == key).value).includes(value)
    }

    static  filterOutEqualObjects(array) {
        return array.filter((item, index, self) =>
            index === self.findIndex((t) =>
                JSON.stringify(t) === JSON.stringify(item)
            )
        );
    }

    static getMatchingCommands(message: Message): Command[] {
        let cmds = [...FlercordLocalStorage.commands]
        let commds: Command[] = []

        for (let cmd of cmds) {
            if (Command.argNotSetOrContaining(cmd.args, "allowedChannels", message.channel_id)) {
                //console.log("right channel!")
            
                if (Command.argSetAndMatching(cmd.args, "contains", "true")) {
                    //console.log(cmd, " has contains!")
                    if (Command.argSetAndMatching(cmd.args, "matchName", "true")) {
                        //console.log("also has matchName")
                        if (message.author.username.toLowerCase().includes(cmd.name)) commds.push(cmd)
                    } if (message.content.toLowerCase().includes(cmd.name)) commds.push(cmd)
                } else {
                    //console.log(cmd, " does not have contains!")
                    if (Command.argSetAndMatching(cmd.args, "matchName", "true")) {
                        //console.log("also has matchName")
                        if (message.author.username.toLowerCase() == cmd.name) commds.push(cmd)
                    } if (message.content.toLowerCase() == cmd.name) commds.push(cmd)
                }
            } else {
                //console.log("wrong channel", cmd)
            }
        }

        return Command.filterOutEqualObjects(commds)
    }

    static replaceCommandText(command: Command, caller: Author): string {
        let text = command.response
    
        text = text.replaceAll("${caller.username}", caller.username)
        text = text.replaceAll("${caller.id}", caller.id)
        text = text.replaceAll("${caller.mention}", `<@${caller.id}>`)
        text = text.replaceAll("${caller.globalName}", caller.global_name)

        let creator = command.creator
        text = text.replaceAll("${creator.username}", creator.username)
        text = text.replaceAll("${creator.id}", creator.id)
        text = text.replaceAll("${creator.mention}", `<@${creator.id}>`)
        text = text.replaceAll("${creator.globalName}", creator.global_name)

        text = text.replaceAll("${createdAt}", command.creationDate.toString())
        text = text.replaceAll("${createdAt.relative}", `<t:${Math.floor(command.creationDate.valueOf()/1000)}:R>`)
        text = text.replaceAll("${createdAt.shortDate}", `<t:${Math.floor(command.creationDate.valueOf()/1000)}:d>`)
        text = text.replaceAll("${createdAt.longDate}", `<t:${Math.floor(command.creationDate.valueOf()/1000)}:D>`)

        return text
    }

    static initializeCommandEventListener() {
        DiscordGateway.getInstance().onEvent("MESSAGE_CREATE", (event: Message) => {

            let cmd = Command.createCommandByString(event.content, event.author)
            if (cmd && cmd.name != "gehirnbuster") {
                if (FlercordLocalStorage.commands.find((cd) => cd.name == cmd.name)) {
                    DiscordAPI.respondToMessage(event.channel_id, event.id, `command ${cmd.name} already exists`)
                    ToastState.addToast({
                        title: "cant create command, it already exists!",
                        text: `command name: ${cmd.name}`,
                        type: "danger"
                    })
                } else {
                    FlercordLocalStorage.addCommand(cmd)
                    DiscordAPI.respondToMessage(event.channel_id, event.id, cmd.toString())
                    ToastState.addToast({
                        title: "new command created!",
                        text: `'${cmd.name}' -> '${cmd.response}' by ${cmd.creator.username}`,
                        type: "success"
                    })
                }
            } else {
                let toDelete = Command.getDelete(event.content, event.author)
                if (toDelete) {
                    let toDeleteCommand = FlercordLocalStorage.commands.find((cd) => cd.name == toDelete)
                    if (toDeleteCommand) {
                        ToastState.addToast({
                            title: `command ${toDelete} deleted!`,
                            text: `by ${event.author.username}`,
                            type: "danger"
                        })
                        FlercordLocalStorage.deleteCommandByName(toDelete)
                        DiscordAPI.respondToMessage(event.channel_id, event.id, "deleted " + toDeleteCommand.toString())
                    } else {
                        ToastState.addToast({
                            title: `command ${toDelete} not Found!`,
                            text: `by ${event.author.username}`,
                            type: "danger"
                        })
                    }

                } else {
                    let matching = Command.getMatchingCommands(event)
                    for (let cmd of matching) {
                        let text = Command.replaceCommandText(cmd, event.author)
                        DiscordAPI.respondToMessage(event.channel_id, event.id, text)
                        ToastState.addToast({
                            title: `command ${cmd.name} executed by ${cmd.creator.username}!`,
                            text: `text`,
                            type: "success"
                        })
                    }
                }
            }



        })
    }

}