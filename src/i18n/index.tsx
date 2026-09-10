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
    "common.loading": "Loading",
    "home.hero.title": "Get The Best Learning Experience With",
    "home.hero.whyChooseUs": "Why Choose Us",
    "home.hero.description": "Learn with qualified teachers, access engaging courses and lessons, and stay connected through a learning experience designed for students, teachers, and families.",
    "home.hero.benefits": "Benefits With Us",
    "home.hero.benefit.securedPayment.title": "Secured Payment",
    "home.hero.benefit.securedPayment.description": "Make secure payments through a trusted learning platform.",
    "home.hero.benefit.rating.title": "Rating for Teachers & Students",
    "home.hero.benefit.rating.description": "Rate teachers and students to build a trusted learning community.",
    "home.hero.benefit.parentDashboard.title": "Dashboard for Parents to oversee their heroes",
    "home.hero.benefit.parentDashboard.description": "Give parents the tools they need to follow their children's learning progress.",
    "home.hero.benefit.onlineOffline.title": "Ability to learn Online or Offline",
    "home.hero.benefit.onlineOffline.description": "Learn flexibly online or offline according to your needs.",
    "home.hero.backgroundAlt": "Elmullim learning experience background",
    "home.hero.imageAlt": "Elmullim learning experience",
    "home.hero.capAlt": "Graduation cap",
    "home.categories.badge": "Categories",
    "home.categories.titlePrefix": "Browse by",
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
    "home.comments.badge": "Comments",
    "home.comments.title": "User Comments",
    "home.comments.role": "Happy Customer",
    "home.comments.quote": "The learning experience is clear, engaging, and easy to follow. Elmullim helps students stay connected with their teachers.",
    "home.career.badge": "Choose Your Career",
    "home.career.title": "Discover Your Gain",
    "home.career.items.0.title": "For Students",
    "home.career.items.0.description": "Start your learning journey and build the skills you need for your future.",
    "home.career.items.1.title": "For Teachers",
    "home.career.items.1.description": "Share your knowledge, inspire students, and grow your teaching career.",
    "home.career.joinNow": "Join Now",
    "home.courses.badge": "Top Popular Courses",
    "home.courses.titlePrefix": "Buy these courses too and join",
    "home.courses.titleSuffix": "many other students in these courses",
    "home.courses.allCourses": "All Courses",
    "home.lessons.badge": "Top Popular Lessons",
    "home.lessons.titlePrefix": "Buy these lessons too and join",
    "home.lessons.titleSuffix": "many other students in these lessons",
    "home.lessons.allLessons": "All Lessons",
    "home.teachers.title": "Our Teachers",
    "home.teachers.imageAlt": "Teacher",
    "home.teachers.toggleSocialLinks": "Toggle teacher social links",
    "home.teachers.facebook": "Open teacher Facebook profile",
    "home.teachers.linkedin": "Open teacher LinkedIn profile",
    "home.teachers.x": "Open teacher X profile",
    "home.statistics.graduated": "Successfully graduated",
    "home.statistics.classesCompleted": "Classes Completed",
    "home.statistics.satisfactionRate": "Satisfaction Rate",
    "home.statistics.studentsCommunity": "Students Community",
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
    "common.loading": "جاري التحميل",
    "home.hero.title": "احصل على أفضل تجربة تعليمية مع",
    "home.hero.whyChooseUs": "لماذا نحن؟",
    "home.hero.description": "تعلّم مع معلمين مؤهلين، واستفد من الكورسات والدروس التفاعلية، وابقَ على تواصل من خلال تجربة تعليمية مصممة للطلاب والمعلمين والعائلات.",
    "home.hero.benefits": "مميزاتنا",
    "home.hero.benefit.securedPayment.title": "دفع آمن",
    "home.hero.benefit.securedPayment.description": "أجرِ مدفوعاتك بأمان من خلال منصة تعليمية موثوقة.",
    "home.hero.benefit.rating.title": "تقييم المعلمين والطلاب",
    "home.hero.benefit.rating.description": "قيّم المعلمين والطلاب لبناء مجتمع تعليمي موثوق.",
    "home.hero.benefit.parentDashboard.title": "لوحة تحكم لأولياء الأمور لمتابعة أبنائهم",
    "home.hero.benefit.parentDashboard.description": "امنح أولياء الأمور الأدوات اللازمة لمتابعة تقدم أبنائهم في التعلم.",
    "home.hero.benefit.onlineOffline.title": "إمكانية التعلم أونلاين أو أوفلاين",
    "home.hero.benefit.onlineOffline.description": "تعلّم بمرونة أونلاين أو أوفلاين وفقًا لاحتياجاتك.",
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
    "home.comments.badge": "التعليقات",
    "home.comments.title": "آراء المستخدمين",
    "home.comments.role": "عميل سعيد",
    "home.comments.quote": "تجربة التعلم واضحة وممتعة وسهلة المتابعة. المعلّم يساعد الطلاب على البقاء على تواصل مع معلميهم.",
    "home.career.badge": "اختر مسارك المهني",
    "home.career.title": "اكتشف مستقبلك",
    "home.career.items.0.title": "للطلاب",
    "home.career.items.0.description": "ابدأ رحلتك التعليمية وابنِ المهارات التي تحتاجها لمستقبلك.",
    "home.career.items.1.title": "للمعلمين",
    "home.career.items.1.description": "شارك معرفتك، وألهم الطلاب، وطوّر مسيرتك التعليمية.",
    "home.career.joinNow": "انضم الآن",
    "home.courses.badge": "أشهر الكورسات",
    "home.courses.titlePrefix": "اشترِ هذه الكورسات أيضًا وانضم إلى",
    "home.courses.titleSuffix": "العديد من الطلاب الآخرين في هذه الكورسات",
    "home.courses.allCourses": "كل الكورسات",
    "home.lessons.badge": "أشهر الدروس",
    "home.lessons.titlePrefix": "اشترِ هذه الدروس أيضًا وانضم إلى",
    "home.lessons.titleSuffix": "العديد من الطلاب الآخرين في هذه الدروس",
    "home.lessons.allLessons": "كل الدروس",
    "home.teachers.title": "معلمونا",
    "home.teachers.imageAlt": "معلم",
    "home.teachers.toggleSocialLinks": "فتح وإغلاق روابط التواصل مع المعلم",
    "home.teachers.facebook": "فتح الملف الشخصي للمعلم على فيسبوك",
    "home.teachers.linkedin": "فتح الملف الشخصي للمعلم على لينكدإن",
    "home.teachers.x": "فتح الملف الشخصي للمعلم على X",
    "home.statistics.graduated": "خريجون بنجاح",
    "home.statistics.classesCompleted": "الفصول المكتملة",
    "home.statistics.satisfactionRate": "نسبة الرضا",
    "home.statistics.studentsCommunity": "مجتمع الطلاب",
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
