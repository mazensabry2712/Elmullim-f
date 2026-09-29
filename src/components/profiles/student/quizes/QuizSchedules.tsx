import { Clock, User, Search, Loader, AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import cookieService from "@/utils/cookieService";
import { useGetStudentQuizzes } from "@/lib/react-query/student/quizzes";
import { useI18n } from "@/i18n";
import { formatDate, formatWeekday } from "@/utils/dateTime";

type QuizScheduleCopy = {
  title: string;
  search: string;
  all: string;
  selectDay: string;
  noQuizzes: string;
  unavailable: string;
  retry: string;
  viewQuiz: string;
  time: string;
};

const copy: Record<"en" | "ar", QuizScheduleCopy> = {
  en: {
    title: "Quiz Schedule",
    search: "Search quizzes...",
    all: "All",
    selectDay: "Select day",
    noQuizzes: "No quizzes are available for your education level.",
    unavailable: "Unable to load quizzes right now.",
    retry: "Try again",
    viewQuiz: "View Quiz",
    time: "Time",
  },
  ar: {
    title: "جدول الاختبارات",
    search: "ابحث عن الاختبارات...",
    all: "الكل",
    selectDay: "اختر اليوم",
    noQuizzes: "لا توجد اختبارات متاحة لمستواك التعليمي حاليًا.",
    unavailable: "تعذر تحميل الاختبارات حاليًا.",
    retry: "حاول مرة أخرى",
    viewQuiz: "عرض الاختبار",
    time: "الوقت",
  },
};

const getDayName = (date: string | null | undefined, language: "en" | "ar") =>
  date ? formatWeekday(date, language) || "—" : "—";

const QuizSchedules = () => {
  const { language } = useI18n();
  const pageCopy = copy[language];
  const token = cookieService.getToken() || undefined;
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const { data, isLoading, isError, refetch } = useGetStudentQuizzes(token);

  const quizzes = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return (data?.data ?? []).filter((quiz) => {
      const day = getDayName(quiz.date, language);
      const matchesDay = !selectedDay || day === selectedDay;
      const haystack = [quiz.title, quiz.subject?.name, quiz.teacher?.name, quiz.academic_year]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesDay && (!normalized || haystack.includes(normalized));
    });
  }, [data?.data, language, search, selectedDay]);

  const days = useMemo(
    () => Array.from(new Set((data?.data ?? []).map((quiz) => getDayName(quiz.date, language)).filter((day) => day !== "—"))),
    [data?.data, language]
  );

  return (
    <section className="p-6 bg-white rounded-md pb-10" aria-labelledby="quiz-schedule-title">
      <div className="flex flex-col md:flex-row gap-3 justify-between mb-6">
        <h2 id="quiz-schedule-title" className="text-xl font-bold text-[#194D80]">{pageCopy.title}</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <label className="relative">
            <span className="sr-only">{pageCopy.search}</span>
            <Search className="absolute start-3 top-1/2 -translate-y-1/2" size={18} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="border border-main rounded-md py-2 ps-9 pe-3 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-main"
              placeholder={pageCopy.search}
              aria-label={pageCopy.search}
            />
          </label>
          <select
            value={selectedDay}
            onChange={(event) => setSelectedDay(event.target.value)}
            className="border border-[#194D80] rounded-md px-3 py-2"
            aria-label={pageCopy.selectDay}
          >
            <option value="">{pageCopy.all}</option>
            {days.map((day) => <option key={day} value={day}>{day}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12" role="status" aria-live="polite">
          <Loader className="mx-auto animate-spin" size={40} aria-hidden="true" />
        </div>
      ) : isError ? (
        <div className="py-12 text-center" role="alert">
          <AlertCircle className="mx-auto mb-3 text-main" size={36} aria-hidden="true" />
          <p className="text-[#194D80]">{pageCopy.unavailable}</p>
          <button type="button" onClick={() => void refetch()} className="mt-4 bg-main text-white rounded-md px-5 py-2">
            {pageCopy.retry}
          </button>
        </div>
      ) : !quizzes.length ? (
        <p className="py-12 text-center text-[#194D80]" role="status">{pageCopy.noQuizzes}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map((quiz) => (
            <article key={quiz.id} className="shadow-md rounded-lg p-5 border-s-4 border-s-[#194D80] border-b-4 border-b-main bg-white">
              <p className="text-main font-bold">{quiz.subject?.name || "—"}</p>
              <h3 className="text-lg font-bold text-[#194D80] mt-1">{quiz.title || "—"}</h3>
              <p className="text-sm text-[#194D80] flex items-center gap-2 mt-2"><User size={16} aria-hidden="true" />{quiz.teacher?.name || "—"}</p>
              <p className="text-sm text-[#194D80] flex items-center gap-2"><Clock size={16} aria-hidden="true" />{quiz.start_time || "—"} – {quiz.end_time || "—"}</p>
              <p className="text-sm text-[#194D80] mt-1">{quiz.date ? formatDate(quiz.date, language) : "—"}</p>
              <button
                type="button"
                onClick={() => navigate(`/view-quiz?quiz=${quiz.id}`)}
                className="mt-4 text-xs w-full rounded-lg py-2 bg-[#194D80] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
              >
                {pageCopy.viewQuiz}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default QuizSchedules;
