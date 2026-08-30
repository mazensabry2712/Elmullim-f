import { TRole, TUserSearchType } from "@/types";

interface ISender {
  id: number;
  name: string;
  role: string;
  phone: string;
  profile_image: string;
}

interface IImage {
  url: string;
  size: string;
  type: string;
}

export interface IMessage {
  id: number;
  data: {
    body: string;
    image?: IImage;
  };
  side: "left" | "right";
  flagged: boolean;
  created_at: string;
  deleted_at: null | string;
  read: {
    status: boolean;
  } | null;
  sender: ISender | null;
}

export interface ICreateMessage {
  body: string;
  image?: File;
}

export interface IConversation {
  id: string;
  participant: ISender;
  last_seen: string;
  created_at: string;
  messages: IMessage[];
}

export interface IConversationRes {
  status: boolean;
  message: null | boolean;
  data: IConversation;
}

export interface IConversationsRes {
  status: boolean;
  message: null | boolean;
  data: {
    conversation_id: string;
    unread_count: number;
    participant: ISender;
    last_message: {
      id: number;
      data: {
        body: string;
        image?: IImage;
      } | null;
      created_at: string;
      deleted_at: null | string;
      read: {
        status: boolean;
      } | null;
      sender: ISender | null;
    };
  }[];
}

export interface ICreateConversation {
  role: TUserSearchType;
  token: string;
  userId: string;
}

export interface IDeleteMessage {
  token: string;
  conversationId: string;
  messageId: string;
  type: "0" | "1";
}