export interface IRecipient {
    address: string;
    name: string;
}
export interface IMessage {
    _id: string;
    from: IRecipient[];
    to: IRecipient[];
    cc: IRecipient[];
    bcc: IRecipient[];
    subject: string;
    savedBy: string;
    originalInbox: string;
    inbox: string;
    domain: string;
    received: string;
    size: number;
    attachments: string[];
    ip: string;
    via: string;
    folder: string;
    labels: string[];
    read: boolean;
    rtls: boolean;
    links: string[];
}
export declare class Mailsac {
    apiKey: string;
    private axios;
    constructor(apiKey: string);
    getMessages(address: string): Promise<IMessage[]>;
    getLinkInEmail(address: string, mailid: string): Promise<string>;
}
