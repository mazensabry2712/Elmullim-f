import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import Newsletter from "@/components/Newsletter";
import TeacherCard from "@/components/home/our teachers/TeacherCard";
import { getPublicTeacherDirectory } from "@/services/main";
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
        previous: "Previous page",
        next: "Next page",
        page: "Page",
        of: "of",
      };

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["public-teachers", "directory", page],
    queryFn: () => getPublicTeacherDirectory(page, PAGE_SIZE),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const teachers = data?.data.teachers ?? [];
  const pagination = data?.data.pagination;

  useEffect(() => {
    document.title = `${copy.title} | Elmullim`;
  }, [copy.title]);

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
              {copy.empty}
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
