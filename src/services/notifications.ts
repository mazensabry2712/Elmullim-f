import axiosAPI from "@/config/axios.config";

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export interface IAppNotification {
  id: string;
  type: string;
  data: {
    title_en?: string;
    title_ar?: string;
    body_en?: string;
    body_ar?: string;
    event?: string;
    booking_id?: number;
    lesson_id?: number;
    lesson_title?: string;
    status?: string;
    session_id?: number;
    meeting_url?: string | null;
    publishing_note?: string | null;
  };
  read_at?: string | null;
  created_at: string;
}

export interface INotificationsResponse {
  status: boolean;
  message: string | null;
  data: {
    items: IAppNotification[];
    unread_count: number;
  };
}

export const getNotifications = async ({ token }: { token: string }): Promise<INotificationsResponse> => {
  const { data } = await axiosAPI.get("/notifications", { headers: authHeaders(token) });
  return data;
};

export const markNotificationRead = async ({ token, notificationId }: { token: string; notificationId: string }) => {
  const { data } = await axiosAPI.post(
    `/notifications/${notificationId}/read`,
    {},
    { headers: authHeaders(token) }
  );
  return data;
};

export const markAllNotificationsRead = async ({ token }: { token: string }) => {
  const { data } = await axiosAPI.post("/notifications/read-all", {}, { headers: authHeaders(token) });
  return data;
};
