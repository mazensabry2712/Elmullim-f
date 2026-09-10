import type { Language } from "@/i18n";

const copy = {
  en: {
    title: "Lessons",
    detailTitle: "Lesson Details",
    breadcrumb: "Lessons page breadcrumb",
    detailBreadcrumb: "Lesson details page breadcrumb",
    home: "Home",
    searchPlaceholder: "Search lessons...",
    searchLabel: "Search lessons",
    loading: "Loading lessons",
    empty: "No lessons found",
    error: "Unable to load lessons right now. Please try again.",
    retry: "Try again",
    detailsError: "Unable to load this lesson right now. Please return to the lessons page and try again.",
    backToLessons: "Back to lessons",
    imageAlt: "Lesson image",
    teacherImageAlt: "Teacher profile",
    by: "By",
    free: "Free",
    enroll: "Enroll now",
    watch: "Watch now",
    details: "View lesson details",
  },
  ar: {
    title: "الدروس",
    detailTitle: "تفاصيل الدرس",
    breadcrumb: "مسار صفحة الدروس",
    detailBreadcrumb: "مسار صفحة تفاصيل الدرس",
    home: "الرئيسية",
    searchPlaceholder: "ابحث عن الدروس...",
    searchLabel: "البحث عن الدروس",
    loading: "جاري تحميل الدروس",
    empty: "لم يتم العثور على دروس",
    error: "تعذر تحميل الدروس حاليًا. يرجى المحاولة مرة أخرى.",
    retry: "حاول مرة أخرى",
    detailsError: "تعذر تحميل هذا الدرس حاليًا. يرجى العودة إلى صفحة الدروس والمحاولة مرة أخرى.",
    backToLessons: "العودة إلى الدروس",
    imageAlt: "صورة الدرس",
    teacherImageAlt: "صورة المعلم",
    by: "بواسطة",
    free: "مجاني",
    enroll: "اشترك الآن",
    watch: "شاهد الآن",
    details: "عرض تفاصيل الدرس",
  },
} as const;

export type LessonsCopy = (typeof copy)[Language];

export const getLessonsCopy = (language: Language): LessonsCopy => copy[language];
