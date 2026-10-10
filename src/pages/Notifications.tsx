import { Bell, Check, Loader2, ExternalLink } from "lucide-react";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n";
import { formatDateTime } from "@/utils/dateTime";
import cookieService from "@/utils/cookieService";
import {
  useGetNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "@/lib/react-query/notifications";

const Notifications = () => {
  const { language } = useI18n();
  const isArabic = language === "ar";
  const token = cookieService.getToken() || "";
  const query = useGetNotifications({ token, enabled: !!token });
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const copy = isArabic
    ? {
        title: "الإشعارات",
        empty: "لا توجد إشعارات حتى الآن.",
        markAll: "تحديد الكل كمقروء",
        unread: "غير مقروء",
        loading: "جاري تحميل الإشعارات...",
        error: "تعذر تحميل الإشعارات.",
        read: "تمت القراءة",
      }
    : {
        title: "Notifications",
        empty: "No notifications yet.",
        markAll: "Mark all as read",
        unread: "Unread",
        loading: "Loading notifications...",
        error: "Could not load notifications.",
        read: "Read",
      };

  const items = query.data?.data?.items ?? [];
  const unreadCount = query.data?.data?.unread_count ?? 0;

  const markOne = async (notificationId: string) => {
    try {
      await markRead.mutateAsync({ token, notificationId });
    } catch {
      toast.error(copy.error);
    }
  };

  const markAllRead = async () => {
    try {
      await markAll.mutateAsync({ token });
    } catch {
      toast.error(copy.error);
    }
  };

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="container">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="text-main" size={24} />
              <h1 className="text-3xl font-bold text-black-blue md:text-5xl">{copy.title}</h1>
            </div>
            <p className="mt-2 font-sora text-[#4D5756]">
              {unreadCount > 0 ? `${unreadCount} ${copy.unread}` : copy.read}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => void markAllRead()}
              disabled={markAll.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-main px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {markAll.isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {copy.markAll}
            </button>
          )}
        </div>

        {query.isLoading && (
          <div className="py-16 text-center font-sora text-[#4D5756]" role="status">
            {copy.loading}
          </div>
        )}

        {query.isError && !query.isLoading && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700" role="alert">
            {copy.error}
          </div>
        )}

        {!query.isLoading && !query.isError && items.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center font-sora text-[#4D5756]">
            {copy.empty}
          </div>
        )}

        <div className="space-y-3">
          {items.map((notification) => {
            const title = isArabic
              ? notification.data.title_ar || notification.data.title_en || notification.data.title || copy.title
              : notification.data.title_en || notification.data.title_ar || notification.data.title || copy.title;
            const body = isArabic
              ? notification.data.body_ar || notification.data.body_en || notification.data.message || ""
              : notification.data.body_en || notification.data.body_ar || notification.data.message || "";

            return (
              <article
                key={notification.id}
                className={`rounded-xl border p-5 transition-colors ${notification.read_at ? "border-gray-200 bg-white" : "border-main/30 bg-main/5"}`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {!notification.read_at && <span className="h-2.5 w-2.5 rounded-full bg-main" aria-label={copy.unread} />}
                      <h2 className="font-bold text-black-blue">{title}</h2>
                    </div>
                    <p className="mt-2 font-sora text-sm text-[#4D5756]">{body}</p>
                    {notification.data.event === "lesson_publishing_rejected" && notification.data.lesson_id ? (
                      <a
                        href={`/profile/my-lessons/${notification.data.lesson_id}/preview`}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-main/20 bg-main/[0.05] px-3 py-2 text-xs font-bold text-main transition hover:bg-main/[0.1]"
                      >
                        <ExternalLink size={14} />
                        {isArabic ? "عرض الدرس" : "View lesson"}
                      </a>
                    ) : null}
                    <p className="mt-2 text-xs text-gray-400">
                      {formatDateTime(notification.created_at, language)}
                    </p>
                  </div>
                  {!notification.read_at && (
                    <button
                      type="button"
                      onClick={() => void markOne(notification.id)}
                      disabled={markRead.isPending}
                      className="w-fit rounded-md border border-main/30 bg-white px-3 py-1.5 text-xs font-semibold text-main disabled:opacity-50"
                    >
                      {copy.read}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Notifications;
