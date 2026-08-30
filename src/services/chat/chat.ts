import axiosAPI from "@/config/axios.config";
import { IStatusMsg } from "@/interfaces";
import {
  IConversationRes,
  IConversationsRes,
  ICreateConversation,
  ICreateMessage,
  IDeleteMessage,
} from "@/interfaces/chat/chat";

// ============== Conversations ================ //
export const getAllConversations = async (
  token: string
): Promise<IConversationsRes> => {
  const { data } = await axiosAPI.get(`/chat/a/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getConversationById = async ({
  token,
  id,
}: {
  token: string;
  id: string;
}): Promise<IConversationRes> => {
  const { data } = await axiosAPI.get(`/chat/a/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createConversation = async ({
  token,
  role,
  userId,
}: ICreateConversation): Promise<IConversationRes> => {
  const { data } = await axiosAPI.post(
    `/chat/a/conversations/${userId}/new`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role,
      },
    }
  );

  return data;
};

export const deleteConversation = async ({
  token,
  conversationId,
}: {
  token: string;
  conversationId: string;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    `/chat/a/conversations/${conversationId}/hide`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

// ================= Messages =============== //
export const createMessage = async ({
  token,
  message,
  conversationId,
}: {
  token: string;
  conversationId: string;
  message: ICreateMessage;
}): Promise<IStatusMsg> => {
  const formData = new FormData();
  formData.append("body", message.body);
  if (message.image) formData.append("image", message.image);

  const { data } = await axiosAPI.post(
    `/chat/a/${conversationId}/messages/create`,
    formData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const deleteMessage = async ({
  token,
  conversationId,
  messageId,
  type,
}: IDeleteMessage): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    `/chat/a/${conversationId}/messages/${messageId}/delete`,
    { type: type },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const clearChat = async ({
  token,
  conversationId,
}: {
  token: string;
  conversationId: string;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    `/chat/a/${conversationId}/clear`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const flagMessage = async ({
  token,
  conversationId,
  messageId,
}: {
  token: string;
  conversationId: string;
  messageId: string;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    `/chat/a/${conversationId}/messages/${messageId}/flag/toggle`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const flaggedMessages = async (token: string) => {
  const { data } = await axiosAPI.get("/chat/a/messages/flagged", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

