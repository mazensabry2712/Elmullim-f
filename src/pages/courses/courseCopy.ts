import type { Language } from "@/i18n";

const copy = {
  en: {
    title: "Courses",
    breadcrumb: "Courses page breadcrumb",
    home: "Home",
    searchPlaceholder: "Search courses...",
    searchLabel: "Search courses",
    loading: "Loading courses",
    empty: "No courses found",
    error: "Unable to load courses right now. Please try again.",
    retry: "Try again",
    categoryImageAlt: "Course category",
    teacherImageAlt: "Teacher profile",
    by: "By",
    free: "Free",
    enroll: "Enroll now",
    watch: "Watch now",
    details: "View course details",
    level: "Level",
  },
  ar: {
    title: "الكورسات",
    breadcrumb: "مسار صفحة الكورسات",
    home: "الرئيسية",
    searchPlaceholder: "ابحث عن الكورسات...",
    searchLabel: "البحث عن الكورسات",
    loading: "جاري تحميل الكورسات",
    empty: "لم يتم العثور على كورسات",
    error: "تعذر تحميل الكورسات حاليًا. يرجى المحاولة مرة أخرى.",
    retry: "حاول مرة أخرى",
    categoryImageAlt: "تصنيف الكورس",
    teacherImageAlt: "صورة المعلم",
    by: "بواسطة",
    free: "مجاني",
    enroll: "اشترك الآن",
    watch: "شاهد الآن",
    details: "عرض تفاصيل الكورس",
    level: "المستوى",
  },
} as const;

export type CoursesCopy = (typeof copy)[Language];

export const getCoursesCopy = (language: Language): CoursesCopy => copy[language];
