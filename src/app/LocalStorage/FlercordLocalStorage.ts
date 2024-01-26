import { Command } from "../command/Command";

export default class FlercordLocalStorage {
    private constructor() {};

    private static token_key = "flercord.token"

    static get token(): string | null {
        return localStorage.getItem(FlercordLocalStorage.token_key);
    }

    static set token(value: string) {
        localStorage.setItem(FlercordLocalStorage.token_key, value);
    }

    private static commands_key = "flercord.commands"

    static get commands(): Command[] {
        return Command.deserializeAll(localStorage.getItem(FlercordLocalStorage.commands_key) ?? "[]")
    }

    static set commands(value: Command[]) {
        localStorage.setItem(FlercordLocalStorage.commands_key, Command.serializeAll(value));
    }

    static addCommand(...commands: Command[]) {
        let current = [...FlercordLocalStorage.commands]
        current.push(...commands)
        FlercordLocalStorage.commands = current
    }

    static deleteCommandByName(name: string) {
        this.commands = this.commands.filter((cmd) => cmd.name != name)
    }
}