import axios, { AxiosInstance } from "axios-proxy-fix";

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

export class Mailsac {
  public apiKey: string;
  private axios: AxiosInstance;

  constructor(apiKey: string) {
    this.apiKey = apiKey;

    this.axios = axios.create({
      baseURL: "https://mailsac.com/api/",
      headers: { "Mailsac-Key": this.apiKey },
      timeout: 3000,
    });
  }

  public getMessages(address: string): Promise<IMessage[]> {
    return new Promise((resolve, reject) => {
      this.axios.get(`/addresses/${address}/messages`)
        .then((response) => resolve(response.data as IMessage[]))
        .catch((error) => reject(error));
    });
  }

  public getLinkInEmail(address: string, mailid: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.axios.get(`/text/${address}/${mailid}`)
        .then((response) => {
          const regex =
            "(https):\\/\\/([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:\\/~+#-]*[\\w@?^=%&\\/~+#-])?";
          const match = (response.data as string).match(regex);
          return resolve(match[0]);
        })
        .catch((error) => reject(error));
    });
  }
}
