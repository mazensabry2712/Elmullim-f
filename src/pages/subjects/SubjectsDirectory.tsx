import { useEffect, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Newsletter from "@/components/Newsletter";
import SubjectCard from "@/components/home/categories/SubjectCard";
import { useI18n } from "@/i18n";
import { getPublicSubjects } from "@/services/main";

const PAGE_SIZE = 24;

const SubjectsDirectory = () => {
  const { t, language } = useI18n();
  const isArabic = language === "ar";
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPage = Number(searchParams.get("page") ?? "1");
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const search = (searchParams.get("q") ?? "").trim();
  const [searchDraft, setSearchDraft] = useState(search);

  useEffect(() => setSearchDraft(search), [search]);
  useEffect(() => { document.title = `${t("subjects.catalog.title")} | Elmullim`; }, [t, language]);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["public-subjects", "directory", page, search],
    queryFn: () => getPublicSubjects(page, PAGE_SIZE, search || undefined),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const subjects = data?.data.subjects ?? [];
  const pagination = data?.data.pagination;

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = new URLSearchParams(searchParams);
    const value = searchDraft.trim();
    if (value) next.set("q", value);
    else next.delete("q");
    next.delete("page");
    setSearchParams(next);
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
      <header className="bg-main">
        <div className="container space-y-4 pb-14 pt-20 text-center text-white md:pb-20 md:pt-28">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">{t("subjects.catalog.title")}</h1>
          <p className="font-sora font-light leading-[30px]" aria-label={t("subjects.catalog.breadcrumb")}>
            {t("nav.home")} <span className="text-white/70">//</span> {t("subjects.catalog.title")}
          </p>
        </div>
      </header>
      <section className="bg-white" aria-labelledby="subjects-catalog-heading">
        <div className="container py-10 md:py-16">
          <h2 id="subjects-catalog-heading" className="sr-only">{t("subjects.catalog.title")}</h2>
          <form onSubmit={submitSearch} className="mx-auto mb-8 flex w-full max-w-2xl gap-2">
            <label className="sr-only" htmlFor="subject-search">{t("subjects.catalog.searchPlaceholder")}</label>
            <div className="relative min-w-0 flex-1">
              <Search className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${isArabic ? "right-3" : "left-3"}`} aria-hidden="true" />
              <input
                id="subject-search" type="search" value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder={t("subjects.catalog.searchPlaceholder")}
                className={`h-12 w-full rounded-lg border border-slate-200 bg-white py-2 text-black-blue outline-none transition focus:border-main focus:ring-2 focus:ring-main/15 ${isArabic ? "pr-10 pl-3" : "pl-10 pr-3"}`}
              />
            </div>
            <button type="submit" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-main px-5 font-bold text-white transition hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2">
              {t("subjects.catalog.search")}
            </button>
          </form>
          {pagination && !isPending && !isError ? <p className="mb-6 text-sm font-semibold text-black-blue/60" aria-live="polite">{pagination.total} {t("subjects.catalog.results")}</p> : null}
          {isPending ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4" role="status" aria-label={t("subjects.catalog.loading")}>
              {Array.from({ length: 8 }, (_, index) => <div key={index} className="h-56 animate-pulse rounded-xl bg-slate-100" />)}
            </div>
          ) : isError ? (
            <div className="py-12 text-center" role="alert">
              <p className="text-[#4D5756]">{t("subjects.catalog.error")}</p>
              <button type="button" onClick={() => void refetch()} className="mt-4 rounded-lg bg-main px-5 py-2.5 font-semibold text-white">{t("subjects.catalog.retry")}</button>
            </div>
          ) : subjects.length === 0 ? (
            <p className="py-12 text-center text-[#4D5756]" role="status">{t("subjects.catalog.empty")}</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {subjects.map((subject) => <SubjectCard subject={subject} key={subject.id} />)}
            </div>
          )}
          {!isPending && !isError && pagination && pagination.last_page > 1 ? (
            <nav aria-label={isArabic ? "التنقل بين صفحات المواد" : "Subject catalog pagination"} className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button type="button" onClick={() => changePage(page - 1)} disabled={page <= 1} aria-label={t("subjects.catalog.previous")} className="inline-flex items-center gap-2 rounded-lg border border-main/20 px-4 py-2.5 font-semibold text-black-blue transition hover:border-main hover:text-main disabled:cursor-not-allowed disabled:opacity-40">
                {isArabic ? <ChevronRight size={18} aria-hidden="true" /> : <ChevronLeft size={18} aria-hidden="true" />}
                {t("subjects.catalog.previous")}
              </button>
              <span className="text-sm font-semibold text-black-blue/70" aria-live="polite">{t("subjects.catalog.page")} {page} {t("subjects.catalog.of")} {pagination.last_page}</span>
              <button type="button" onClick={() => changePage(page + 1)} disabled={page >= pagination.last_page} aria-label={t("subjects.catalog.next")} className="inline-flex items-center gap-2 rounded-lg border border-main/20 px-4 py-2.5 font-semibold text-black-blue transition hover:border-main hover:text-main disabled:cursor-not-allowed disabled:opacity-40">
                {t("subjects.catalog.next")}
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

export default SubjectsDirectory;
