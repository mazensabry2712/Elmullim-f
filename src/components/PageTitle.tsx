import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/i18n";

type PageTitleValue = {
  en: string;
  ar: string;
};

const BASE_TITLE = "Elmullim";

const pageTitles: Record<string, PageTitleValue> = {
  "/": { en: "Home", ar: "الرئيسية" },
  "/about": { en: "About Us", ar: "من نحن" },
  "/contact-us": { en: "Contact Us", ar: "تواصل معنا" },
  "/events": { en: "Events", ar: "الفعاليات" },
  "/courses": { en: "Courses", ar: "الكورسات" },
  "/lessons": { en: "Lessons", ar: "الدروس" },
  "/services": { en: "Services", ar: "الخدمات" },
  "/faqs": { en: "FAQs", ar: "الأسئلة الشائعة" },
  "/testimonials": { en: "Testimonials", ar: "آراء المستخدمين" },
  "/login": { en: "Choose Sign In", ar: "اختر نوع تسجيل الدخول" },
  "/sign-in": { en: "Student Login", ar: "تسجيل دخول الطالب" },
  "/sign-up": { en: "Student Sign Up", ar: "تسجيل الطالب" },
  "/forgot-password": { en: "Student Forgot Password", ar: "استعادة كلمة مرور الطالب" },
  "/reset-password": { en: "Student Reset Password", ar: "إعادة تعيين كلمة مرور الطالب" },
  "/parent/sign-in": { en: "Parent Login", ar: "تسجيل دخول ولي الأمر" },
  "/parent/sign-up": { en: "Parent Sign Up", ar: "تسجيل ولي الأمر" },
  "/parent/forgot-password": { en: "Parent Forgot Password", ar: "استعادة كلمة مرور ولي الأمر" },
  "/parent/reset-password": { en: "Parent Reset Password", ar: "إعادة تعيين كلمة مرور ولي الأمر" },
  "/teacher/sign-in": { en: "Teacher Login", ar: "تسجيل دخول المعلم" },
  "/teacher/sign-up": { en: "Teacher Sign Up", ar: "تسجيل المعلم" },
  "/teacher/forgot-password": { en: "Teacher Forgot Password", ar: "استعادة كلمة مرور المعلم" },
  "/teacher/reset-password": { en: "Teacher Reset Password", ar: "إعادة تعيين كلمة مرور المعلم" },
  "/verify-account": { en: "Verify Account", ar: "تأكيد الحساب" },
  "/view-quiz": { en: "View Quiz", ar: "عرض الاختبار" },
  "/profile": { en: "My Profile", ar: "ملفي الشخصي" },
  "/profile/update": { en: "Update Profile", ar: "تحديث الملف الشخصي" },
  "/profile/teacher/courses/upload": { en: "Upload Course", ar: "رفع كورس" },
  "/profile/teacher/lessons/upload": { en: "Upload Lesson", ar: "رفع درس" },
  "/unauthorized": { en: "Unauthorized", ar: "غير مصرح" },
};

const dynamicTitles: Array<[string, PageTitleValue]> = [
  ["/courses/", { en: "Course Details", ar: "تفاصيل الكورس" }],
  ["/course/", { en: "Enroll Course", ar: "الاشتراك في الكورس" }],
  ["/lessons/", { en: "Lesson Details", ar: "تفاصيل الدرس" }],
  ["/services/", { en: "Service Details", ar: "تفاصيل الخدمة" }],
  ["/events/", { en: "Event Details", ar: "تفاصيل الفعالية" }],
  ["/profile/my-courses/", { en: "My Course", ar: "الكورس الخاص بي" }],
  ["/profile/my-lessons/", { en: "My Lesson", ar: "الدرس الخاص بي" }],
];

export const getPageTitle = (
  pathname: string,
  language: "en" | "ar"
): string => {
  const exact = pageTitles[pathname];
  if (exact) return exact[language];

  if (pathname.startsWith("/courses/") && pathname.endsWith("/view")) {
    return language === "ar" ? "مشاهدة الكورس" : "View Course";
  }

  if (pathname.startsWith("/lessons/") && pathname.endsWith("/view")) {
    return language === "ar" ? "مشاهدة الدرس" : "View Lesson";
  }

  if (pathname.startsWith("/profile/my-courses/") && pathname.endsWith("/update")) {
    return language === "ar" ? "تحديث الكورس" : "Update Course";
  }

  if (pathname.startsWith("/profile/my-lessons/") && pathname.endsWith("/update")) {
    return language === "ar" ? "تحديث الدرس" : "Update Lesson";
  }

  if (pathname.startsWith("/profile/my-courses/") && pathname.endsWith("/view")) {
    return language === "ar" ? "مشاهدة الكورس" : "View My Course";
  }

  if (pathname.startsWith("/profile/my-lessons/") && pathname.endsWith("/view")) {
    return language === "ar" ? "مشاهدة الدرس" : "View My Lesson";
  }

  const dynamic = dynamicTitles.find(([prefix]) => pathname.startsWith(prefix));
  return dynamic
    ? dynamic[1][language]
    : language === "ar"
      ? "الصفحة غير موجودة"
      : "Page Not Found";
};

const PageTitle = () => {
  const { pathname } = useLocation();
  const { language } = useI18n();

  useEffect(() => {
    document.title = `${BASE_TITLE} | ${getPageTitle(pathname, language)}`;
  }, [language, pathname]);

  return null;
};

export default PageTitle;
