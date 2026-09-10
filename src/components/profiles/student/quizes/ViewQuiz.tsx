import { AlertCircle, ArrowLeft, Loader, Clock, Award } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useI18n } from "@/i18n";
import cookieService from "@/utils/cookieService";
import { useGetStudentQuiz } from "@/lib/react-query/student/quizzes";

const copy = {
  en: {
    title: "Quiz",
    breadcrumb: "Quiz page breadcrumb",
    home: "Home",
    loading: "Loading quiz",
    unavailable: "Unable to load this quiz right now.",
    retry: "Try again",
    back: "Back to quiz schedule",
    notSelected: "Select a quiz from the schedule to continue.",
    subject: "Subject",
    teacher: "Teacher",
    date: "Date",
    time: "Time",
    limit: "Time limit",
    minutes: "minutes",
    score: "Total score",
    choose: "Choose one answer",
    submitUnavailable: "Quiz submission will be connected after a student submission endpoint is available in the backend.",
  },
  ar: {
    title: "الاختبار",
    breadcrumb: "مسار صفحة الاختبار",
    home: "الرئيسية",
    loading: "جاري تحميل الاختبار",
    unavailable: "تعذر تحميل هذا الاختبار حاليًا.",
    retry: "حاول مرة أخرى",
    back: "العودة إلى جدول الاختبارات",
    notSelected: "اختر اختبارًا من الجدول للمتابعة.",
    subject: "المادة",
    teacher: "المعلم",
    date: "التاريخ",
    time: "الوقت",
    limit: "المدة",
    minutes: "دقيقة",
    score: "الدرجة الكلية",
    choose: "اختر إجابة واحدة",
    submitUnavailable: "سيتم ربط إرسال الإجابات بعد توفر endpoint لإرسال اختبارات الطلاب في الـBackend.",
  },
} as const;

const ViewQuiz = () => {
  const { language } = useI18n();
  const pageCopy = copy[language];
  const token = cookieService.getToken() || undefined;
  const [searchParams] = useSearchParams();
  const quizId = Number(searchParams.get("quiz"));
  const validQuizId = Number.isInteger(quizId) && quizId > 0;
  const { data, isLoading, isError, refetch } = useGetStudentQuiz({ token, quizId });
  const [answers, setAnswers] = useState<Record<number, number>>({});

  if (!validQuizId) {
    return (
      <main>
        <section className="container py-24 text-center" role="status">
          <p className="text-[#4D5756]">{pageCopy.notSelected}</p>
          <Link to="/profile" className="mt-5 inline-flex items-center gap-2 bg-main text-white rounded-[5px] px-6 py-2">
            <ArrowLeft size={18} aria-hidden="true" />{pageCopy.back}
          </Link>
        </section>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main>
        <div className="container py-24" role="status" aria-live="polite">
          <Loader className="mx-auto animate-spin" size={40} aria-hidden="true" />
          <span className="sr-only">{pageCopy.loading}</span>
        </div>
      </main>
    );
  }

  if (isError || !data?.data) {
    return (
      <main>
        <div className="container py-24 text-center" role="alert">
          <AlertCircle className="mx-auto mb-3 text-main" size={40} aria-hidden="true" />
          <p className="text-[#4D5756]">{pageCopy.unavailable}</p>
          <div className="mt-5 flex justify-center gap-3">
            <button type="button" onClick={() => void refetch()} className="bg-main text-white rounded-[5px] px-6 py-2">{pageCopy.retry}</button>
            <Link to="/profile" className="border border-main text-main rounded-[5px] px-6 py-2">{pageCopy.back}</Link>
          </div>
        </div>
      </main>
    );
  }

  const quiz = data.data.quiz;
  const questions = data.data.questions;

  return (
    <main>
      <header className="container text-center text-white space-y-4 md:space-y-6 pt-16 md:pt-24 pb-12 md:pb-20">
        <h1 className="uppercase text-4xl md:text-6xl font-bold leading-[74px]">{quiz.title || pageCopy.title}</h1>
        <p className="font-sora font-light leading-[30px]" aria-label={pageCopy.breadcrumb}>
          {pageCopy.home} <span className="text-main">//</span> {pageCopy.title}
        </p>
      </header>

      <section className="bg-white py-12 md:py-20" aria-labelledby="quiz-title">
        <div className="container max-w-5xl">
          <div className="rounded-xl bg-[#F0FEFC] p-6 shadow-sm border border-[#194D80] mb-8">
            <h2 id="quiz-title" className="text-2xl md:text-3xl font-bold text-[#194D80]">{quiz.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 text-[#194D80]">
              <p><strong>{pageCopy.subject}:</strong> {quiz.subject?.name || "—"}</p>
              <p><strong>{pageCopy.teacher}:</strong> {quiz.teacher?.name || "—"}</p>
              <p><strong>{pageCopy.date}:</strong> {quiz.date ? new Date(quiz.date).toLocaleDateString(language) : "—"}</p>
              <p className="flex items-center gap-2"><Clock size={16} aria-hidden="true" /><strong>{pageCopy.time}:</strong> {quiz.start_time || "—"} – {quiz.end_time || "—"}</p>
              <p><strong>{pageCopy.limit}:</strong> {quiz.time_limit} {pageCopy.minutes}</p>
              <p className="flex items-center gap-2"><Award size={16} aria-hidden="true" /><strong>{pageCopy.score}:</strong> {quiz.total_score}</p>
            </div>
          </div>

          {!questions.length ? (
            <p className="py-12 text-center text-[#194D80]" role="status">{pageCopy.unavailable}</p>
          ) : (
            <form className="space-y-8">
              {questions.map((question, index) => (
                <fieldset key={question.id} className="rounded-xl border border-[#194D80] p-6">
                  <legend className="px-2 text-lg font-bold text-[#194D80]">{index + 1}. {question.title}</legend>
                  <p className="mt-2 text-sm text-[#4D5756]">{pageCopy.choose}</p>
                  <div className="mt-4 grid gap-3">
                    {question.options.map((option) => (
                      <label key={option.id} className="flex items-center gap-3 rounded-md border border-[#5299E0] p-3 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.id}
                          checked={answers[question.id] === option.id}
                          onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
                        />
                        <span className="text-[#194D80]">{option.title}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </form>
          )}

          <p className="mt-8 rounded-lg border border-dashed border-[#194D80] p-4 text-sm text-[#4D5756]" role="status">
            {pageCopy.submitUnavailable}
          </p>
        </div>
      </section>
    </main>
  );
};

export default ViewQuiz;
