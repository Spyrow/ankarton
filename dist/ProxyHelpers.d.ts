export interface IProxy {
    host: string;
    port: number;
}
export declare class ProxyHelpers {
    static initProxies(inputFile?: string): Promise<{}>;
    static getValidProxyOnline(): Promise<IProxy>;
    static getValidProxy(): Promise<IProxy>;
    private static proxies;
    private static proxyTest(proxy, timeout?);
    private static getProxyOnline();
    private static getProxy();
}
