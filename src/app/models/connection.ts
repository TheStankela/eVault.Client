import { Message } from "./message";
import { User } from "./user";

export class Connection {
    public id: string;
    public user?: User;
    public connectionId: string;
    public messages: Array<Message>
  }