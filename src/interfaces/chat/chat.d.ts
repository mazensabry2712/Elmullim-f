import { TUserSearchType } from "@/types";

interface ISender {
  id: number;
  name: string;
  role: string;
  phone: string;
  profile_image: string;
}

interface IImage {
  url: string;
  size: number | string;
  type: string;
}

export interface IMessage {
  id: number;
  data: {
    body: string;
    image?: IImage;
  };
  side: "left" | "right" | null;
  flagged: boolean;
  created_at: string;
  deleted_at: null | string;
  read: boolean | null;
  sender: ISender | null;
}

export interface ICreateMessage {
  body: string;
  image?: File;
}

export interface IConversation {
  id: string;
  participant: ISender;
  last_seen: string | null;
  created_at: string;
  messages: IMessage[];
}

export interface IConversationRes {
  status: boolean;
  message: null | string;
  data: IConversation;
}

export interface IConversationListItem {
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
  } | null;
}

export interface IChatPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  has_more_pages: boolean;
}

export interface IConversationsRes {
  status: boolean;
  message: null | string;
  data: IConversationListItem[];
  meta: IChatPaginationMeta;
}

export interface ICreateConversation {
  role: TUserSearchType;
  token: string;
  userId: number;
}

export interface IDeleteMessage {
  token: string;
  conversationId: string;
  messageId: string;
  type: "0" | "1";
}
