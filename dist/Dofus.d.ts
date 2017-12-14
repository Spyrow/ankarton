export interface IAccount {
    login: string;
    password: string;
}
export declare class Dofus {
    static createAccount(useOnlineProxy?: boolean): Promise<IAccount>;
    private static axios;
    private static proxy;
    private static createGuest();
    private static validateGuest(guestLogin, guestPassword);
}
