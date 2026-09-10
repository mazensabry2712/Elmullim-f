import type { Language } from "@/i18n";

export const getEventsCopy = (language: Language) => {
  if (language === "ar") {
    return {
      title: "الفعاليات",
      breadcrumb: "مسار صفحة الفعاليات",
      breadcrumbHome: "الرئيسية",
      emptyTitle: "لا توجد فعاليات متاحة حاليًا",
      emptyDescription:
        "لا توجد فعاليات منشورة في الوقت الحالي. ستظهر الفعاليات القادمة هنا عند توفرها.",
      detailsTitle: "تفاصيل الفعالية",
      detailsBreadcrumb: "مسار تفاصيل الفعالية",
      unavailableTitle: "الفعالية غير متاحة",
      unavailableDescription:
        "الفعالية المطلوبة غير موجودة أو لم تعد منشورة حاليًا.",
      backToEvents: "العودة إلى الفعاليات",
      emptyImageAlt: "لا توجد فعاليات متاحة",
    };
  }

  return {
    title: "Events",
    breadcrumb: "Events page breadcrumb",
    breadcrumbHome: "Home",
    emptyTitle: "No events available right now",
    emptyDescription:
      "There are no published events at the moment. Upcoming events will appear here when they are available.",
    detailsTitle: "Event Details",
    detailsBreadcrumb: "Event details breadcrumb",
    unavailableTitle: "Event unavailable",
    unavailableDescription:
      "The requested event does not exist or is no longer published.",
    backToEvents: "Back to Events",
    emptyImageAlt: "No events available",
  };
};
