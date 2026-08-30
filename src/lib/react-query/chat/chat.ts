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

export const useGetAllConversations = (token: string) =>
  useQuery({
    queryKey: [QueryKeys.CONVERSATIONS],
    queryFn: () => getAllConversations(token),
  });

export const useGetConversationById = ({
  token,
  id,
}: {
  token: string;
  id: string;
}) =>
  useQuery({
    queryKey: [QueryKeys.CONVERSATION, id],
    queryFn: () => getConversationById({ token, id }),
    enabled: !!id,
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

export const useGetFlaggedMessages = (token: string) =>
  useQuery({
    queryKey: [QueryKeys.FLAGGED_MESSAGES],
    queryFn: () => flaggedMessages(token),
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