export default class FlercordLocalStorage {
    private constructor() {};

    private static token_key = "flercord.token"

    static get token(): string | null {
        return localStorage.getItem(FlercordLocalStorage.token_key);
    }

    static set token(value: string) {
        localStorage.setItem(FlercordLocalStorage.token_key, value);
    }
}