import { AlertCircle, ArrowLeft, Loader, Clock, Award, CheckCircle2 } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import type { ILecture } from "@/interfaces/courses/lectures";
import { useI18n } from "@/i18n";
import cookieService from "@/utils/cookieService";
import { formatDate, formatDateTime } from "@/utils/dateTime";
import {
  useGetStudentQuiz,
  useGetStudentQuizResult,
  useStartStudentQuiz,
  useSubmitStudentQuiz,
} from "@/lib/react-query/student/quizzes";

const copy = {
  en: {
    title: "Quiz", breadcrumb: "Quiz page breadcrumb", home: "Home", loading: "Loading quiz", starting: "Starting your quiz", unavailable: "Unable to load this quiz right now.", retry: "Try again", back: "Back to quiz schedule", notSelected: "Select a quiz from the schedule to continue.", subject: "Subject", teacher: "Teacher", date: "Date", time: "Time", limit: "Time limit", minutes: "minutes", score: "Total score", choose: "Choose one answer", textAnswer: "Written answer", enterTextAnswer: "Type your answer here", submit: "Submit quiz", submitting: "Submitting...", answerAll: "Please answer all questions before submitting.", submitFailed: "Unable to submit the quiz right now. Please try again.", startFailed: "Unable to start this quiz right now.", expired: "The quiz time has expired. Your answers can no longer be submitted.", remaining: "Time remaining", resultLoading: "Loading your saved result", resultUnavailable: "Your submission was saved, but the result could not be loaded.", resultTitle: "Quiz result", achieved: "Score", percentage: "Percentage", correct: "Correct answers", submittedAt: "Submitted at", answerReview: "Answer review", correctAnswer: "Correct", wrongAnswer: "Incorrect", selected: "Selected option", noResultAnswers: "No answer details are available.",
  },
  ar: {
    title: "الاختبار", breadcrumb: "مسار صفحة الاختبار", home: "الرئيسية", loading: "جاري تحميل الاختبار", starting: "جاري بدء الاختبار", unavailable: "تعذر تحميل هذا الاختبار حاليًا.", retry: "حاول مرة أخرى", back: "العودة إلى جدول الاختبارات", notSelected: "اختر اختبارًا من الجدول للمتابعة.", subject: "المادة", teacher: "المعلم", date: "التاريخ", time: "الوقت", limit: "المدة", minutes: "دقيقة", score: "الدرجة الكلية", choose: "اختر إجابة واحدة", textAnswer: "الإجابة النصية", enterTextAnswer: "اكتب إجابتك هنا", submit: "إرسال الاختبار", submitting: "جاري الإرسال...", answerAll: "يرجى الإجابة عن جميع الأسئلة قبل إرسال الاختبار.", submitFailed: "تعذر إرسال الاختبار حاليًا. حاول مرة أخرى.", startFailed: "تعذر بدء الاختبار حاليًا.", expired: "انتهى وقت الاختبار، ولا يمكن إرسال الإجابات الآن.", remaining: "الوقت المتبقي", resultLoading: "جاري تحميل النتيجة المحفوظة", resultUnavailable: "تم حفظ إجابتك، لكن تعذر تحميل النتيجة.", resultTitle: "نتيجة الاختبار", achieved: "الدرجة", percentage: "النسبة المئوية", correct: "الإجابات الصحيحة", submittedAt: "وقت الإرسال", answerReview: "مراجعة الإجابات", correctAnswer: "صحيحة", wrongAnswer: "غير صحيحة", selected: "الإجابة المختارة", noResultAnswers: "لا تتوفر تفاصيل للإجابات.",
  },
} as const;

const formatRemainingTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

const ViewQuiz = () => {
  const { language } = useI18n();
  const pageCopy = copy[language];
  const token = cookieService.getToken() || undefined;
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const returnLecture = (location.state as { lecture?: ILecture } | null)?.lecture;
  const quizId = Number(searchParams.get("quiz"));
  const validQuizId = Number.isInteger(quizId) && quizId > 0;
  const returnCourseId = Number(searchParams.get("course"));
  const hasCourseContext = Number.isSafeInteger(returnCourseId) && returnCourseId > 0;
  const backHref = hasCourseContext ? `/courses/${returnCourseId}/view` : "/profile";
  const backLabel = hasCourseContext
    ? (language === "ar" ? "العودة إلى الكورس" : "Back to course")
    : pageCopy.back;
  const { data, isLoading, isError, refetch } = useGetStudentQuiz({ token, quizId });
  const { mutateAsync: startQuiz, isPending: isStartPending } = useStartStudentQuiz();
  const submitQuiz = useSubmitStudentQuiz();
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [deadlineAt, setDeadlineAt] = useState<string | null>(null);
  const [clockMs, setClockMs] = useState(() => Date.now());
  const [startError, setStartError] = useState<string | null>(null);
  const hasStartedRef = useRef(false);

  const { data: resultData, isLoading: isResultLoading, isError: isResultError } = useGetStudentQuizResult({ token, quizId, enabled: isSubmitted });

  const quiz = data?.data?.quiz;
  const questions = data?.data?.questions ?? [];

  useEffect(() => {
    if (!validQuizId || !token || !quiz || hasStartedRef.current) return;
    hasStartedRef.current = true;
    setStartError(null);
    void startQuiz({ token, quizId })
      .then((response) => {
        const attempt = response.data;
        setDeadlineAt(attempt.deadline_at);
        setIsSubmitted(Boolean(attempt.submitted_at));
      })
      .catch(() => {
        hasStartedRef.current = false;
        setStartError(pageCopy.startFailed);
      });
  }, [pageCopy.startFailed, quiz, quizId, startQuiz, token, validQuizId]);

  useEffect(() => {
    if (!deadlineAt || isSubmitted) return;
    const updateClock = () => setClockMs(Date.now());
    updateClock();
    const interval = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(interval);
  }, [deadlineAt, isSubmitted]);

  const remainingSeconds = deadlineAt ? Math.max(0, Math.ceil((Date.parse(deadlineAt) - clockMs) / 1000)) : null;
  const isExpired = remainingSeconds !== null && remainingSeconds <= 0;

  useEffect(() => {
    if (isExpired && !isSubmitted) setSubmissionError(pageCopy.expired);
  }, [isExpired, isSubmitted, pageCopy.expired]);

  if (!validQuizId) return <main><section className="container py-24 text-center" role="status"><p className="text-[#4D5756]">{pageCopy.notSelected}</p><Link to={backHref} state={returnLecture ? { lecture: returnLecture } : undefined} className="mt-5 inline-flex items-center gap-2 bg-main text-white rounded-[5px] px-6 py-2"><ArrowLeft size={18} aria-hidden="true" />{backLabel}</Link></section></main>;

  if (isLoading) return <main><div className="container py-24" role="status" aria-live="polite"><Loader className="mx-auto animate-spin" size={40} aria-hidden="true" /><span className="sr-only">{pageCopy.loading}</span></div></main>;

  if (isError || !quiz) return <main><div className="container py-24 text-center" role="alert"><AlertCircle className="mx-auto mb-3 text-main" size={40} aria-hidden="true" /><p className="text-[#4D5756]">{pageCopy.unavailable}</p><div className="mt-5 flex justify-center gap-3"><button type="button" onClick={() => void refetch()} className="bg-main text-white rounded-[5px] px-6 py-2">{pageCopy.retry}</button><Link to={backHref} state={returnLecture ? { lecture: returnLecture } : undefined} className="border border-main text-main rounded-[5px] px-6 py-2">{backLabel}</Link></div></div></main>;

  if (isStartPending || (!hasStartedRef.current && !startError)) return <main><div className="container py-24" role="status" aria-live="polite"><Loader className="mx-auto animate-spin" size={40} aria-hidden="true" /><p className="mt-4 text-center text-[#4D5756]">{pageCopy.starting}</p></div></main>;

  if (startError) return <main><div className="container py-24 text-center" role="alert"><AlertCircle className="mx-auto mb-3 text-main" size={40} aria-hidden="true" /><p className="text-[#4D5756]">{startError}</p><button type="button" onClick={() => { setStartError(null); hasStartedRef.current = false; }} className="mt-5 bg-main text-white rounded-[5px] px-6 py-2">{pageCopy.retry}</button></div></main>;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionError(null);
    if (isExpired) { setSubmissionError(pageCopy.expired); return; }
    const hasAllAnswers = questions.every((question) => {
      const answer = answers[question.id];
      return question.answer_type === "text"
        ? typeof answer === "string" && answer.trim().length > 0
        : typeof answer === "number";
    });
    if (!hasAllAnswers) { setSubmissionError(pageCopy.answerAll); return; }
    try {
      await submitQuiz.mutateAsync({
        token: token as string,
        quizId,
        answers: questions.map((question) =>
          question.answer_type === "text"
            ? { question_id: question.id, answer_text: String(answers[question.id] ?? "") }
            : { question_id: question.id, option_id: Number(answers[question.id]) },
        ),
      });
      setIsSubmitted(true);
    } catch { setSubmissionError(pageCopy.submitFailed); }
  };

  if (isSubmitted && isResultLoading) return <main><div className="container py-24" role="status" aria-live="polite"><Loader className="mx-auto animate-spin" size={40} aria-hidden="true" /><p className="mt-4 text-center text-[#4D5756]">{pageCopy.resultLoading}</p></div></main>;

  if (isSubmitted && (isResultError || !resultData?.data)) return <main><div className="container py-24 text-center" role="alert"><AlertCircle className="mx-auto mb-3 text-main" size={40} aria-hidden="true" /><p className="text-[#4D5756]">{pageCopy.resultUnavailable}</p><Link to={backHref} state={returnLecture ? { lecture: returnLecture } : undefined} className="mt-5 inline-flex items-center gap-2 border border-main text-main rounded-[5px] px-6 py-2"><ArrowLeft size={18} aria-hidden="true" />{backLabel}</Link></div></main>;

  if (isSubmitted && resultData?.data) {
    const result = resultData.data;
    return <main><header className="container text-center text-white space-y-4 md:space-y-6 pt-16 md:pt-24 pb-12 md:pb-20"><h1 className="uppercase text-4xl md:text-6xl font-bold leading-[74px]">{pageCopy.resultTitle}</h1><p className="font-sora font-light leading-[30px]" aria-label={pageCopy.breadcrumb}>{pageCopy.home} <span className="text-main">//</span> {pageCopy.resultTitle}</p></header><section className="bg-white py-12 md:py-20" aria-labelledby="quiz-result-title"><div className="container max-w-5xl"><div className="rounded-xl bg-[#F0FEFC] p-6 shadow-sm border border-[#194D80]"><div className="flex items-start justify-between gap-4"><div><p className="text-sm text-[#4D5756]">{pageCopy.resultTitle}</p><h2 id="quiz-result-title" className="mt-1 text-2xl md:text-3xl font-bold text-[#194D80]">{quiz.title}</h2></div><CheckCircle2 className="text-main shrink-0" size={32} aria-hidden="true" /></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"><div className="rounded-lg border border-[#5299E0] bg-white p-4 text-center"><p className="text-sm text-[#4D5756]">{pageCopy.achieved}</p><p className="mt-1 text-2xl font-bold text-[#194D80]">{result.score} / {result.total_score}</p></div><div className="rounded-lg border border-[#5299E0] bg-white p-4 text-center"><p className="text-sm text-[#4D5756]">{pageCopy.percentage}</p><p className="mt-1 text-2xl font-bold text-[#194D80]">{result.percentage}%</p></div><div className="rounded-lg border border-[#5299E0] bg-white p-4 text-center"><p className="text-sm text-[#4D5756]">{pageCopy.correct}</p><p className="mt-1 text-2xl font-bold text-[#194D80]">{result.correct_answers}</p></div></div>{result.submitted_at && <p className="mt-5 text-sm text-[#4D5756]"><strong>{pageCopy.submittedAt}:</strong> {formatDateTime(result.submitted_at, language)}</p>}</div><section className="mt-8" aria-labelledby="answer-review-title"><h3 id="answer-review-title" className="text-xl font-bold text-[#194D80]">{pageCopy.answerReview}</h3>{!result.answers.length ? <p className="mt-4 text-[#4D5756]">{pageCopy.noResultAnswers}</p> : <div className="mt-4 space-y-3">{result.answers.map((answer, index) => <div key={`${answer.question_id}-${index}`} className="rounded-lg border border-[#5299E0] bg-white p-4"><div className="flex items-center justify-between gap-3"><span className="font-semibold text-[#194D80]">{answer.question_title || `Question ${answer.question_id}`}</span><span className={answer.is_correct ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{answer.is_correct ? pageCopy.correctAnswer : pageCopy.wrongAnswer}</span></div><p className="mt-2 text-sm text-[#4D5756]"><strong>{pageCopy.selected}:</strong> {answer.submitted_text || answer.selected_option_title || (answer.selected_option_id ? String(answer.selected_option_id) : "—")}</p></div>)}</div>}</section><Link to={backHref} state={returnLecture ? { lecture: returnLecture } : undefined} className="mt-8 inline-flex items-center gap-2 bg-main text-white rounded-[5px] px-6 py-2"><ArrowLeft size={18} aria-hidden="true" />{backLabel}</Link></div></section></main>;
  }

  return <main><header className="container text-center text-white space-y-4 md:space-y-6 pt-16 md:pt-24 pb-12 md:pb-20"><h1 className="uppercase text-4xl md:text-6xl font-bold leading-[74px]">{quiz.title || pageCopy.title}</h1><p className="font-sora font-light leading-[30px]" aria-label={pageCopy.breadcrumb}>{pageCopy.home} <span className="text-main">//</span> {pageCopy.title}</p></header><section className="bg-white py-12 md:py-20" aria-labelledby="quiz-title"><div className="container max-w-5xl"><div className="rounded-xl bg-[#F0FEFC] p-6 shadow-sm border border-[#194D80] mb-8"><h2 id="quiz-title" className="text-2xl md:text-3xl font-bold text-[#194D80]">{quiz.title}</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 text-[#194D80]"><p><strong>{pageCopy.subject}:</strong> {quiz.subject?.name || "—"}</p><p><strong>{pageCopy.teacher}:</strong> {quiz.teacher?.name || "—"}</p><p><strong>{pageCopy.date}:</strong> {quiz.date ? formatDate(quiz.date, language) : "—"}</p><p className="flex items-center gap-2"><Clock size={16} aria-hidden="true" /><strong>{pageCopy.time}:</strong> {quiz.start_time || "—"} – {quiz.end_time || "—"}</p><p><strong>{pageCopy.limit}:</strong> {quiz.time_limit} {pageCopy.minutes}</p>{remainingSeconds !== null && <p className="flex items-center gap-2" aria-live="polite"><Clock size={16} aria-hidden="true" /><strong>{pageCopy.remaining}:</strong> {formatRemainingTime(remainingSeconds)}</p>}<p className="flex items-center gap-2"><Award size={16} aria-hidden="true" /><strong>{pageCopy.score}:</strong> {quiz.total_score}</p></div></div>{!questions.length ? <p className="py-12 text-center text-[#194D80]" role="status">{pageCopy.unavailable}</p> : <form className="space-y-8" onSubmit={(event) => void handleSubmit(event)}>{questions.map((question, index) => <fieldset key={question.id} className="rounded-xl border border-[#194D80] p-6"><legend className="px-2 text-lg font-bold text-[#194D80]">{index + 1}. {question.title}</legend>{question.image_url && <img src={question.image_url} alt={question.title || `${pageCopy.title} ${index + 1}`} loading="lazy" className="mt-3 max-h-80 w-auto max-w-full rounded-lg object-contain" />}{question.answer_type === "text" ? <label className="mt-4 block"><span className="mb-2 block text-sm font-medium text-[#4D5756]">{pageCopy.textAnswer}</span><textarea rows={4} maxLength={10000} value={typeof answers[question.id] === "string" ? answers[question.id] : ""} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} placeholder={pageCopy.enterTextAnswer} className="w-full rounded-md border border-[#5299E0] p-3 text-[#194D80] focus:border-[#194D80] focus:outline-none focus:ring-2 focus:ring-[#5299E0]" /></label> : <><p className="mt-2 text-sm text-[#4D5756]">{pageCopy.choose}</p><div className="mt-4 grid gap-3">{question.options.map((option) => <label key={option.id} className="flex items-center gap-3 rounded-md border border-[#5299E0] p-3 cursor-pointer"><input type="radio" name={`question-${question.id}`} value={option.id} checked={answers[question.id] === option.id} onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))} /><span className="text-[#194D80]">{option.title}</span></label>)}</div></>}</fieldset>)}{submissionError && <p className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700" role="alert">{submissionError}</p>}<button type="submit" disabled={submitQuiz.isPending || isExpired} className="inline-flex items-center justify-center gap-2 bg-main text-white rounded-[5px] px-6 py-3 disabled:opacity-60 disabled:cursor-not-allowed">{submitQuiz.isPending && <Loader className="animate-spin" size={18} aria-hidden="true" />}{submitQuiz.isPending ? pageCopy.submitting : pageCopy.submit}</button></form>}</div></section></main>;
};

export default ViewQuiz;
