import type { Language } from "@/i18n";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqCopy = {
  title: string;
  breadcrumbHome: string;
  breadcrumb: string;
  items: FaqItem[];
};

const copy: Record<Language, FaqCopy> = {
  en: {
    title: "FAQs",
    breadcrumbHome: "Home",
    breadcrumb: "Frequently asked questions breadcrumb",
    items: [
      {
        question: "What is Elmullim?",
        answer: "Elmullim is a learning platform that connects students, teachers, and families through courses, lessons, and tools designed to support a connected learning experience.",
      },
      {
        question: "Who can use Elmullim?",
        answer: "Students, teachers, and parents can use Elmullim. Each role has a dedicated experience for learning, teaching, or following a student's progress.",
      },
      {
        question: "Can students learn online and offline?",
        answer: "Elmullim is designed to support flexible learning experiences. Available online or offline features depend on the lesson or service provided by the platform.",
      },
      {
        question: "How do students find courses and lessons?",
        answer: "Students can browse the available courses and lessons from the platform and open a course or lesson to review its details before enrolling when enrollment is available.",
      },
      {
        question: "Can teachers publish courses and lessons?",
        answer: "Yes. Teachers have dedicated tools to create, manage, and publish their learning content after signing in with a teacher account.",
      },
      {
        question: "Can parents follow their children's learning?",
        answer: "Yes. Parent accounts are designed to help families stay informed about their children's learning activity and progress.",
      },
      {
        question: "How can I get help from Elmullim?",
        answer: "You can contact the Elmullim team through the Contact Us page and send your question or support request using the contact form.",
      },
    ],
  },
  ar: {
    title: "الأسئلة الشائعة",
    breadcrumbHome: "الرئيسية",
    breadcrumb: "مسار الأسئلة الشائعة",
    items: [
      {
        question: "ما هي منصة المعلّم؟",
        answer: "المعلّم هي منصة تعليمية تجمع الطلاب والمعلمين وأولياء الأمور من خلال الكورسات والدروس والأدوات التي تدعم تجربة تعليمية مترابطة.",
      },
      {
        question: "من يمكنه استخدام المعلّم؟",
        answer: "يمكن للطلاب والمعلمين وأولياء الأمور استخدام المعلّم، ولكل فئة تجربة مخصصة للتعلم أو التدريس أو متابعة تقدم الطالب.",
      },
      {
        question: "هل يمكن للطلاب التعلم أونلاين وأوفلاين؟",
        answer: "تم تصميم المعلّم لدعم تجارب تعليمية مرنة، وتختلف إمكانيات التعلم أونلاين أو أوفلاين بحسب الدرس أو الخدمة المتاحة على المنصة.",
      },
      {
        question: "كيف يجد الطلاب الكورسات والدروس؟",
        answer: "يمكن للطلاب استعراض الكورسات والدروس المتاحة وفتح صفحة أي كورس أو درس لمعرفة التفاصيل قبل التسجيل عندما يكون التسجيل متاحًا.",
      },
      {
        question: "هل يستطيع المعلمون نشر الكورسات والدروس؟",
        answer: "نعم. يمتلك المعلمون أدوات مخصصة لإنشاء المحتوى التعليمي وإدارته ونشره بعد تسجيل الدخول بحساب المعلم.",
      },
      {
        question: "هل يستطيع ولي الأمر متابعة تعلم أبنائه؟",
        answer: "نعم. تم تصميم حساب ولي الأمر للمساعدة في متابعة نشاط الأبناء التعليمي وتقدمهم.",
      },
      {
        question: "كيف يمكنني الحصول على المساعدة من المعلّم؟",
        answer: "يمكنك التواصل مع فريق المعلّم من خلال صفحة تواصل معنا وإرسال استفسارك أو طلب الدعم باستخدام نموذج التواصل.",
      },
    ],
  },
};

export const getFaqCopy = (language: Language) => copy[language];
