import { IProxy } from "./ProxyHelpers";
export interface IAccount {
    login: string;
    password: string;
}
export declare class Dofus {
    static createAccount(useOnlineProxy?: boolean): Promise<IAccount>;
    private static axios;
    static proxy: IProxy;
    private static createGuest();
    private static validateGuest(guestLogin, guestPassword);
}
