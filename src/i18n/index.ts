import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "ar";

type TranslationValue = string;
type TranslationTree = Record<string, TranslationValue>;

const translations: Record<Language, TranslationTree> = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.courses": "Courses",
    "nav.lessons": "Lessons",
    "nav.contactUs": "Contact Us",
    "nav.faqs": "FAQs",
    "nav.login": "Login",
    "nav.studentLogin": "Student Login",
    "nav.parentLogin": "Parent Login",
    "nav.teacherLogin": "Teacher Login",
    "nav.signInAs": "Sign in as",
    "nav.toggleMenu": "Toggle Menu",
    "language.english": "English",
    "language.arabic": "العربية",

    "home.hero.title": "Get The Best Learning Experience With",
    "home.hero.whyChooseUs": "Why Choose Us",
    "home.hero.description":
      "Learn with qualified teachers, access engaging courses and lessons, and stay connected through a learning experience designed for students, teachers, and families.",
    "home.hero.benefits": "Benefits With Us",
    "home.hero.backgroundAlt": "Elmullim learning experience background",
    "home.hero.imageAlt": "Elmullim learning experience",
    "home.hero.capAlt": "Graduation cap",

    "home.categories.badge": "Categories",
    "home.categories.titlePrefix": "Browse By",
    "home.categories.titleHighlight": "Categories",
    "home.categories.physics": "Physics",
    "home.categories.maths": "Maths",
    "home.categories.languages": "Languages",
    "home.categories.history": "History",
    "home.categories.geography": "Geography",
    "home.categories.chemistry": "Chemistry",
    "home.categories.biology": "Biology",
    "home.categories.philosophyLogic": "Philosophy and Logic",

    "home.chat.badge": "Chat Rooms",
    "home.chat.title": "Stay In Touch With Your Teacher Through Our Chat Rooms",
    "home.chat.createTitle": "Create a New Room",
    "home.chat.createDescription": "Create a private learning room for you and your classmates.",
    "home.chat.joinTitle": "Join a Room",
    "home.chat.joinDescription": "Join a learning room using the provided access code.",
    "home.chat.availableTitle": "View Available Rooms",
    "home.chat.availableDescription": "Explore available learning rooms and request to join.",
    "home.chat.imageAlt": "Elmullim learning platform",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.about": "من نحن",
    "nav.services": "الخدمات",
    "nav.courses": "الكورسات",
    "nav.lessons": "الدروس",
    "nav.contactUs": "تواصل معنا",
    "nav.faqs": "الأسئلة الشائعة",
    "nav.login": "تسجيل الدخول",
    "nav.studentLogin": "دخول الطالب",
    "nav.parentLogin": "دخول ولي الأمر",
    "nav.teacherLogin": "دخول المعلم",
    "nav.signInAs": "تسجيل الدخول كـ",
    "nav.toggleMenu": "فتح وإغلاق القائمة",
    "language.english": "English",
    "language.arabic": "العربية",

    "home.hero.title": "احصل على أفضل تجربة تعليمية مع",
    "home.hero.whyChooseUs": "لماذا نحن؟",
    "home.hero.description":
      "تعلّم مع معلمين مؤهلين، واستفد من الكورسات والدروس التفاعلية، وابقَ على تواصل من خلال تجربة تعليمية مصممة للطلاب والمعلمين والعائلات.",
    "home.hero.benefits": "مميزاتنا",
    "home.hero.backgroundAlt": "خلفية تجربة التعلم في المعلّم",
    "home.hero.imageAlt": "تجربة التعلم في المعلّم",
    "home.hero.capAlt": "قبعة تخرج",

    "home.categories.badge": "التصنيفات",
    "home.categories.titlePrefix": "تصفح حسب",
    "home.categories.titleHighlight": "التصنيفات",
    "home.categories.physics": "الفيزياء",
    "home.categories.maths": "الرياضيات",
    "home.categories.languages": "اللغات",
    "home.categories.history": "التاريخ",
    "home.categories.geography": "الجغرافيا",
    "home.categories.chemistry": "الكيمياء",
    "home.categories.biology": "الأحياء",
    "home.categories.philosophyLogic": "الفلسفة والمنطق",

    "home.chat.badge": "غرف الدردشة",
    "home.chat.title": "ابقَ على تواصل مع معلمك من خلال غرف الدردشة",
    "home.chat.createTitle": "إنشاء غرفة جديدة",
    "home.chat.createDescription": "أنشئ غرفة تعليمية خاصة لك ولزملائك في الدراسة.",
    "home.chat.joinTitle": "الانضمام إلى غرفة",
    "home.chat.joinDescription": "انضم إلى غرفة تعليمية باستخدام رمز الدخول المتاح.",
    "home.chat.availableTitle": "عرض الغرف المتاحة",
    "home.chat.availableDescription": "استعرض الغرف التعليمية المتاحة واطلب الانضمام إليها.",
    "home.chat.imageAlt": "منصة المعلّم التعليمية",
  },
};

const LANGUAGE_STORAGE_KEY = "elmullim-language";

const getInitialLanguage = (): Language => {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage === "ar" || storedLanguage === "en") return storedLanguage;

  return navigator.language.toLowerCase().startsWith("ar") ? "ar" : "en";
};

interface I18nContextValue {
  language: Language;
  direction: "ltr" | "rtl";
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const direction = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [direction, language]);

  const setLanguage = (nextLanguage: Language) => setLanguageState(nextLanguage);
  const toggleLanguage = () => setLanguageState((current) => (current === "en" ? "ar" : "en"));

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      direction,
      setLanguage,
      toggleLanguage,
      t: (key) => translations[language][key] ?? translations.en[key] ?? key,
    }),
    [direction, language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
};
