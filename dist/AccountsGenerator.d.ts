export declare class AccountsGenerator {
    static generateWithProxy(proxyPath: string, total: number, output: string): Promise<void>;
    static generateWithoutProxy(total: number, output: string): Promise<void>;
    private static readonly mailsac;
    private static generate(output, proxyPath?);
}
