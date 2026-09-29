import QueryKeys from "@/enums";
import {
  ICreateConversation,
  ICreateMessage,
  IDeleteMessage,
} from "@/interfaces/chat/chat";
import {
  createConversation,
  createMessage,
  deleteConversation,
  deleteMessage,
  flaggedMessages,
  flagMessage,
  getAllConversations,
  getConversationById,
} from "@/services/chat/chat";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllConversations = ({
  token,
  page = 1,
  search = "",
  enabled = true,
}: {
  token: string;
  page?: number;
  search?: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: [QueryKeys.CONVERSATIONS, page, search],
    queryFn: () => getAllConversations({ token, page, search }),
    enabled: enabled && !!token,
    placeholderData: (previous) => previous,
  });

export const useGetConversationById = ({
  token,
  id,
  enabled = true,
}: {
  token: string;
  id: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: [QueryKeys.CONVERSATION, id],
    queryFn: () => getConversationById({ token, id }),
    enabled: enabled && !!id && !!token,
  });

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, role, userId }: ICreateConversation) =>
      createConversation({ token, role, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONVERSATIONS],
      });
    },
  });
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      conversationId,
    }: {
      token: string;
      conversationId: string;
    }) => deleteConversation({ token, conversationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONVERSATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONVERSATION],
      });
    },
  });
};

// ================= Messages =============== //
export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      message,
      conversationId,
    }: {
      token: string;
      conversationId: string;
      message: ICreateMessage;
    }) => createMessage({ token, message, conversationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONVERSATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONVERSATION],
      });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, conversationId, messageId, type }: IDeleteMessage) =>
      deleteMessage({ token, conversationId, messageId, type }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONVERSATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONVERSATION],
      });
    },
  });
};

export const useGetFlaggedMessages = (token: string, enabled = true) =>
  useQuery({
    queryKey: [QueryKeys.FLAGGED_MESSAGES],
    queryFn: () => flaggedMessages(token),
    enabled: enabled && !!token,
  });

export const useFlagMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      conversationId,
      messageId,
    }: {
      token: string;
      conversationId: string;
      messageId: string;
    }) => flagMessage({ token, conversationId, messageId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FLAGGED_MESSAGES],
      });
    },
  });
};