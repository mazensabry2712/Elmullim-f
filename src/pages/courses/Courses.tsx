import { useEffect } from "react";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import Newsletter from "@/components/Newsletter";
import CoursesList from "@/components/courses/CoursesList";
import SearchInput from "@/components/SearchInput";
import useDebounce from "@/hooks/useDebounce";
import { useGetCourses } from "@/lib/react-query/courses/courses";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";
import { getCoursesCopy } from "./courseCopy";

const Courses = () => {
  const { language } = useI18n();
  const copy = getCoursesCopy(language);
  const [searchParams] = useSearchParams();
  const search = useDebounce(searchParams.get("q"), 500) ?? undefined;
  const token = cookieService.getToken() || undefined;
  const { data: courses, isLoading, isError, refetch } = useGetCourses({
    q: search,
    ...(token && { token }),
  });

  useEffect(() => {
    document.title = `${copy.title} | Elmullim`;
  }, [copy.title]);

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container text-center text-white space-y-4 md:space-y-6 pt-20 md:pt-32 pb-16 md:pb-24"
      >
        <h1 className="text-4xl font-bold leading-tight uppercase md:text-6xl md:leading-[74px]">
          {copy.title}
        </h1>
        <p
          className="font-sora font-light leading-[30px]"
          aria-label={copy.breadcrumb}
        >
          {copy.home} <span className="text-main">//</span> {copy.title}
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
        aria-labelledby="courses-title"
      >
        <div className="container py-12 md:py-24">
          <h2 id="courses-title" className="sr-only">
            {copy.title}
          </h2>

          <div className="mb-5">
            <SearchInput
              placeholder={copy.searchPlaceholder}
              ariaLabel={copy.searchLabel}
            />
          </div>

          {isLoading ? (
            <div className="py-10" role="status" aria-live="polite">
              <Loader size={40} className="animate-spin mx-auto" aria-hidden="true" />
              <span className="sr-only">{copy.loading}</span>
            </div>
          ) : isError ? (
            <div className="py-10 text-center" role="alert">
              <p className="font-sora text-lg text-[#4D5756]">{copy.error}</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 w-fit bg-main hover:bg-main/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm px-6 py-2"
              >
                {copy.retry}
              </button>
            </div>
          ) : (
            <CoursesList courses={courses?.data ?? []} copy={copy} />
          )}
        </div>
      </motion.section>

      <Newsletter />
    </main>
  );
};

export default Courses;
