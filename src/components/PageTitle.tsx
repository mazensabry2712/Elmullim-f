import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/i18n";

type PageTitle = {
  en: string;
  ar: string;
};

const BASE_TITLE = "Elmullim";

const pageTitles: Record<string, PageTitle> = {
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

const getDynamicTitle = (pathname: string, language: "en" | "ar") => {
  const exact = pageTitles[pathname];
  if (exact) return exact[language];

  const checks: Array<[string, PageTitle]> = [
    ["/events/", { en: "Event Details", ar: "تفاصيل الفعالية" }],
    ["/courses/", { en: "Course Details", ar: "تفاصيل الكورس" }],
    ["/lessons/", { en: "Lesson Details", ar: "تفاصيل الدرس" }],
    ["/services/", { en: "Service Details", ar: "تفاصيل الخدمة" }],
    ["/profile/my-courses/", { en: "My Course", ar: "الكورس الخاص بي" }],
    ["/profile/my-lessons/", { en: "My Lesson", ar: "الدرس الخاص بي" }],
    ["/course/", { en: "Enroll Course", ar: "الاشتراك في الكورس" }],
  ];

  const match = checks.find(([prefix]) => pathname.startsWith(prefix));
  return match ? match[1][language] : null;
};

const PageTitle = () => {
  const { pathname } = useLocation();
  const { language } = useI18n();

  useEffect(() => {
    const pageTitle = getDynamicTitle(pathname, language);
    document.title = pageTitle ? `${BASE_TITLE} | ${pageTitle}` : `${BASE_TITLE} | Page Not Found`;
  }, [language, pathname]);

  return null;
};

export default PageTitle;
