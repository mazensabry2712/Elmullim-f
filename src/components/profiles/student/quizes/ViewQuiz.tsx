import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";

type QuizCopy = {
  title: string;
  breadcrumb: string;
  home: string;
  unavailableTitle: string;
  unavailableDescription: string;
  backToLessons: string;
};

const copy: Record<"en" | "ar", QuizCopy> = {
  en: {
    title: "Quiz",
    breadcrumb: "Quiz page breadcrumb",
    home: "Home",
    unavailableTitle: "Quiz is not available yet",
    unavailableDescription:
      "This page currently has no connected quiz API or real quiz data. Elmullim will show the quiz here once the backend quiz integration is available.",
    backToLessons: "Back to lessons",
  },
  ar: {
    title: "الاختبار",
    breadcrumb: "مسار صفحة الاختبار",
    home: "الرئيسية",
    unavailableTitle: "الاختبار غير متاح حاليًا",
    unavailableDescription:
      "لا توجد حاليًا واجهة API متصلة للاختبارات أو بيانات اختبار حقيقية لهذه الصفحة. سيعرض Elmullim الاختبار هنا بعد توفر تكامل الاختبارات من الـBackend.",
    backToLessons: "العودة إلى الدروس",
  },
};

const ViewQuiz = () => {
  const { language } = useI18n();
  const pageCopy = copy[language];

  return (
    <main>
      <header className="container text-center text-white space-y-4 md:space-y-6 pt-16 md:pt-24 pb-12 md:pb-20">
        <h1 className="uppercase text-4xl md:text-6xl font-bold leading-[74px]">
          {pageCopy.title}
        </h1>
        <p
          className="font-sora font-light leading-[30px]"
          aria-label={pageCopy.breadcrumb}
        >
          {pageCopy.home} <span className="text-main">//</span> {pageCopy.title}
        </p>
      </header>

      <section
        className="bg-white py-16 md:py-24"
        aria-labelledby="quiz-unavailable-title"
      >
        <div className="container">
          <div
            className="mx-auto max-w-2xl rounded-xl border border-[#194D80] bg-[#F0FEFC] p-8 text-center shadow-sm"
            role="status"
          >
            <AlertCircle
              className="mx-auto mb-4 text-main"
              size={42}
              aria-hidden="true"
            />
            <h2
              id="quiz-unavailable-title"
              className="text-2xl md:text-3xl font-bold text-[#194D80]"
            >
              {pageCopy.unavailableTitle}
            </h2>
            <p className="mt-4 text-[#4D5756] leading-relaxed">
              {pageCopy.unavailableDescription}
            </p>
            <Link
              to="/lessons"
              className="mt-6 inline-flex items-center gap-2 rounded-[5px] bg-main px-6 py-3 font-sora text-sm text-white transition-all duration-200 hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
            >
              <ArrowLeft size={18} aria-hidden="true" />
              {pageCopy.backToLessons}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ViewQuiz;
