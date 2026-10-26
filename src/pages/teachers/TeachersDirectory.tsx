import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import Newsletter from "@/components/Newsletter";
import TeacherCard from "@/components/home/our teachers/TeacherCard";
import { getPublicTeacherCategories, getPublicTeacherDirectory } from "@/services/main";
import { useI18n } from "@/i18n";

const PAGE_SIZE = 12;

const TeachersDirectory = () => {
  const { language } = useI18n();
  const isArabic = language === "ar";
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPage = Number(searchParams.get("page") ?? "1");
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const copy = isArabic
    ? {
        title: "المعلمين",
        breadcrumb: "مسار صفحة المعلمين",
        home: "الرئيسية",
        loading: "جاري تحميل المعلمين",
        error: "تعذر تحميل المعلمين حاليًا. يرجى المحاولة مرة أخرى.",
        retry: "حاول مرة أخرى",
        empty: "لا يوجد معلمون متاحون للعرض حاليًا.",
        results: "معلم",
        categoriesTitle: "اختار تخصص المعلم",
        allCategories: "كل التخصصات",
        teacherCount: "معلم",
        filteredEmpty: "لا يوجد معلمون بهذا التخصص حاليًا.",
        previous: "الصفحة السابقة",
        next: "الصفحة التالية",
        page: "صفحة",
        of: "من",
      }
    : {
        title: "Teachers",
        breadcrumb: "Teachers page breadcrumb",
        home: "Home",
        loading: "Loading teachers",
        error: "Teachers are unavailable right now. Please try again.",
        retry: "Try again",
        empty: "There are no public teachers to show right now.",
        results: "teachers",
        categoriesTitle: "Browse teachers by subject",
        allCategories: "All subjects",
        teacherCount: "teachers",
        filteredEmpty: "No teachers are available in this subject right now.",
        previous: "Previous page",
        next: "Next page",
        page: "Page",
        of: "of",
      };

  const rawSubjectId = Number(searchParams.get("subject_id") ?? "");
  const selectedSubjectId = Number.isInteger(rawSubjectId) && rawSubjectId > 0 ? rawSubjectId : undefined;

  const { data: subjectResponse, isPending: subjectsPending } = useQuery({
    queryKey: ["public-teachers", "subjects"],
    queryFn: getPublicTeacherCategories,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const subjects = subjectResponse?.data ?? [];

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["public-teachers", "directory", page, selectedSubjectId ?? null],
    queryFn: () => getPublicTeacherDirectory(page, PAGE_SIZE, selectedSubjectId),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const teachers = data?.data.teachers ?? [];
  const pagination = data?.data.pagination;

  useEffect(() => {
    document.title = `${copy.title} | Elmullim`;
  }, [copy.title]);

  const changeSubject = (nextSubjectId?: number) => {
    const next = new URLSearchParams(searchParams);
    next.delete("page");
    if (nextSubjectId) next.set("subject_id", String(nextSubjectId));
    else next.delete("subject_id");
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changePage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    if (nextPage <= 1) next.delete("page");
    else next.set("page", String(nextPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container space-y-4 pb-16 pt-20 text-center text-white md:space-y-6 md:pb-24 md:pt-32"
      >
        <h1 className="text-4xl font-bold leading-tight md:text-6xl md:leading-[74px]">
          {copy.title}
        </h1>
        <p className="font-sora font-light leading-[30px]" aria-label={copy.breadcrumb}>
          {copy.home} <span className="text-main">//</span> {copy.title}
        </p>
      </motion.div>

      <section className="bg-white" aria-labelledby="teachers-directory-title">
        <div className="container py-12 md:py-20">
          <h2 id="teachers-directory-title" className="sr-only">
            {copy.title}
          </h2>

          <section className="mb-8 rounded-2xl border border-black-blue/[0.07] bg-[#F8FAFA] p-4 sm:p-5" aria-labelledby="teacher-subjects-title">
            <div className="mb-4 flex items-center gap-2 text-black-blue">
              <SlidersHorizontal className="h-5 w-5 text-main" aria-hidden="true" />
              <h2 id="teacher-subjects-title" className="text-base font-extrabold sm:text-lg">{copy.categoriesTitle}</h2>
            </div>
            {subjectsPending ? (
              <div className="flex flex-wrap gap-2" role="status" aria-label={copy.loading}>
                {Array.from({ length: 6 }, (_, index) => <span key={index} className="h-10 w-24 animate-pulse rounded-full bg-slate-200" />)}
              </div>
            ) : subjects.length ? (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  aria-pressed={!selectedSubjectId}
                  onClick={() => changeSubject()}
                  className={[
                    "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2",
                    !selectedSubjectId ? "border-main bg-main text-white" : "border-black-blue/10 bg-white text-black-blue hover:border-main/50 hover:text-main",
                  ].join(" ")}
                >
                  {!selectedSubjectId ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
                  {copy.allCategories}
                </button>
                {subjects.map((subject) => {
                  const selected = selectedSubjectId === subject.id;
                  return (
                    <button
                      key={subject.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => changeSubject(subject.id)}
                      title={subject.education_level_name || subject.name}
                      className={[
                        "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2",
                        selected ? "border-main bg-main text-white" : "border-black-blue/10 bg-white text-black-blue hover:border-main/50 hover:text-main",
                      ].join(" ")}
                    >
                      {selected ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
                      <span>{subject.name}</span>
                      <span className={selected ? "text-white/80" : "text-black-blue/40"}>({subject.teachers_count})</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-black-blue/55">{copy.empty}</p>
            )}
          </section>

          {pagination && !isPending && !isError ? (
            <p className="mb-6 text-sm font-semibold text-black-blue/60" aria-live="polite">
              {pagination.total} {copy.results}
            </p>
          ) : null}

          {isPending ? (
            <div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4"
              role="status"
              aria-label={copy.loading}
            >
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="h-[25rem] animate-pulse rounded-xl bg-slate-100" />
              ))}
              <span className="sr-only">{copy.loading}</span>
            </div>
          ) : isError ? (
            <div className="py-10 text-center" role="alert">
              <p className="font-sora text-lg text-[#4D5756]">{copy.error}</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 rounded-[5px] bg-main px-6 py-2 font-sora text-sm text-white transition-colors hover:bg-main/90"
              >
                {copy.retry}
              </button>
            </div>
          ) : teachers.length === 0 ? (
            <p role="status" className="py-12 text-center text-[#4D5756]">
              {selectedSubjectId ? copy.filteredEmpty : copy.empty}
            </p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4"
            >
              {teachers.map((teacher) => (
                <TeacherCard teacher={teacher} key={teacher.id} />
              ))}
            </motion.div>
          )}

          {!isPending && !isError && pagination && pagination.last_page > 1 ? (
            <nav
              aria-label={isArabic ? "التنقل بين صفحات المعلمين" : "Teacher directory pagination"}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <button
                type="button"
                onClick={() => changePage(page - 1)}
                disabled={page <= 1}
                aria-label={copy.previous}
                className="inline-flex items-center gap-2 rounded-lg border border-main/20 px-4 py-2.5 font-semibold text-black-blue transition-colors hover:border-main hover:text-main disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isArabic ? <ChevronRight size={18} aria-hidden="true" /> : <ChevronLeft size={18} aria-hidden="true" />}
                {copy.previous}
              </button>
              <span className="text-sm font-semibold text-black-blue/70" aria-live="polite">
                {copy.page} {page} {copy.of} {pagination.last_page}
              </span>
              <button
                type="button"
                onClick={() => changePage(page + 1)}
                disabled={page >= pagination.last_page}
                aria-label={copy.next}
                className="inline-flex items-center gap-2 rounded-lg border border-main/20 px-4 py-2.5 font-semibold text-black-blue transition-colors hover:border-main hover:text-main disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copy.next}
                {isArabic ? <ChevronLeft size={18} aria-hidden="true" /> : <ChevronRight size={18} aria-hidden="true" />}
              </button>
            </nav>
          ) : null}
        </div>
      </section>

      <Newsletter />
    </main>
  );
};

export default TeachersDirectory;
