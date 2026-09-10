import type { Language } from "@/i18n";

export const TESTIMONIAL_ITEMS = [
  { id: "learning", image: "/images/teacher-img1.png", roleKey: "student" },
  { id: "teaching", image: "/images/teacher-img2.png", roleKey: "teacher" },
  { id: "family", image: "/images/teacher-img3.png", roleKey: "parent" },
  { id: "course", image: "/images/teacher-img4.png", roleKey: "student" },
  { id: "community", image: "/images/teacher-img1.png", roleKey: "teacher" },
  { id: "progress", image: "/images/teacher-img2.png", roleKey: "parent" },
] as const;

const copy = {
  en: {
    title: "Testimonials",
    breadcrumb: "Testimonials page breadcrumb",
    home: "Home",
    imageAlt: "Elmullim testimonial profile",
    names: {
      learning: "Aisha Hassan",
      teaching: "Omar Khaled",
      family: "Mona Adel",
      course: "Youssef Samir",
      community: "Sara Mahmoud",
      progress: "Hany Mostafa",
    },
    roles: {
      student: "Student",
      teacher: "Teacher",
      parent: "Parent",
    },
    quotes: {
      learning: "Elmullim makes lessons easier to follow and helps me stay connected with my teachers.",
      teaching: "The platform gives me a clear way to organize lessons and keep students engaged.",
      family: "I can follow my child's learning progress and stay informed about their education.",
      course: "The course experience is simple, focused, and easy to continue from any device.",
      community: "The platform helps students and teachers build a supportive learning community.",
      progress: "Elmullim gives learners the structure and flexibility they need to keep improving.",
    },
  },
  ar: {
    title: "آراء المستخدمين",
    breadcrumb: "مسار صفحة آراء المستخدمين",
    home: "الرئيسية",
    imageAlt: "صورة صاحب الرأي في المعلّم",
    names: {
      learning: "عائشة حسن",
      teaching: "عمر خالد",
      family: "منى عادل",
      course: "يوسف سمير",
      community: "سارة محمود",
      progress: "هاني مصطفى",
    },
    roles: {
      student: "طالب",
      teacher: "معلم",
      parent: "ولي أمر",
    },
    quotes: {
      learning: "المعلّم يجعل متابعة الدروس أسهل ويساعدني على البقاء على تواصل مع معلميّ.",
      teaching: "المنصة تمنحني طريقة واضحة لتنظيم الدروس والحفاظ على تفاعل الطلاب.",
      family: "أستطيع متابعة تقدم ابني في التعلم والبقاء على اطلاع بمسيرته التعليمية.",
      course: "تجربة الكورس بسيطة ومركزة وسهلة المتابعة من أي جهاز.",
      community: "تساعد المنصة الطلاب والمعلمين على بناء مجتمع تعليمي داعم.",
      progress: "يوفر المعلّم للمتعلمين التنظيم والمرونة اللذين يحتاجونهما للاستمرار في التطور.",
    },
  },
} as const;

export const getTestimonialsCopy = (language: Language) => copy[language];
