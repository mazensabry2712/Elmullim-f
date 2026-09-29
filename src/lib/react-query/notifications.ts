import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notifications";

export const notificationKeys = {
  all: ["notifications"] as const,
  mine: () => ["notifications", "mine"] as const,
};

export const useGetNotifications = ({ token, enabled = true }: { token: string; enabled?: boolean }) =>
  useQuery({
    queryKey: notificationKeys.mine(),
    queryFn: () => getNotifications({ token }),
    enabled: enabled && !!token,
  });

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.mine() });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.mine(variables.token) });
    },
  });
};
