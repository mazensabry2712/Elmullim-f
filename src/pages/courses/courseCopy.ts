import type { Language } from "@/i18n";

const copy = {
  en: {
    title: "Courses",
    detailTitle: "Course Details",
    breadcrumb: "Courses page breadcrumb",
    detailBreadcrumb: "Course details page breadcrumb",
    home: "Home",
    searchPlaceholder: "Search courses...",
    searchLabel: "Search courses",
    loading: "Loading courses",
    empty: "No courses found",
    error: "Unable to load courses right now. Please try again.",
    retry: "Try again",
    detailsError: "Unable to load this course right now. Please return to the courses page and try again.",
    backToCourses: "Back to courses",
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
    detailTitle: "تفاصيل الكورس",
    breadcrumb: "مسار صفحة الكورسات",
    detailBreadcrumb: "مسار صفحة تفاصيل الكورس",
    home: "الرئيسية",
    searchPlaceholder: "ابحث عن الكورسات...",
    searchLabel: "البحث عن الكورسات",
    loading: "جاري تحميل الكورسات",
    empty: "لم يتم العثور على كورسات",
    error: "تعذر تحميل الكورسات حاليًا. يرجى المحاولة مرة أخرى.",
    retry: "حاول مرة أخرى",
    detailsError: "تعذر تحميل هذا الكورس حاليًا. يرجى العودة إلى صفحة الكورسات والمحاولة مرة أخرى.",
    backToCourses: "العودة إلى الكورسات",
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
