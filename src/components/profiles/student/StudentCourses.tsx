import { Loader } from "lucide-react";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import CoursesList from "@/components/courses/CoursesList";
import { useGetMyCourses } from "@/lib/react-query/student/enrolling";
import { useI18n } from "@/i18n";

const StudentCourses = () => {
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const isArabic = language === "ar";
  const { data: courses, isLoading, isError, refetch } = useGetMyCourses(
    token,
    !!token
  );

  return (
    <div className="pb-10 mt-4 overflow-hidden bg-white rounded-lg">
      <h2 className="font-sora font-bold text-center text-main text-2xl mt-5">
        {isArabic ? "كورساتي" : "My Courses"}
      </h2>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
      >
        <div className="py-12 md:py-16 px-3 md:px-8">
          {isLoading ? (
            <div className="py-10" role="status" aria-live="polite">
              <Loader size={40} className="animate-spin mx-auto" aria-hidden="true" />
              <span className="sr-only">
                {isArabic ? "جاري تحميل كورساتك" : "Loading your courses"}
              </span>
            </div>
          ) : isError ? (
            <div className="py-10 text-center" role="alert">
              <p className="font-sora text-lg text-[#4D5756]">
                {isArabic
                  ? "تعذر تحميل كورساتك حاليًا. يرجى المحاولة مرة أخرى."
                  : "Unable to load your courses right now. Please try again."}
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 w-fit rounded-[5px] bg-main px-6 py-2 font-sora text-sm text-white transition-all duration-200 hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
              >
                {isArabic ? "حاول مرة أخرى" : "Try again"}
              </button>
            </div>
          ) : (
            <CoursesList courses={courses?.data || []} />
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default StudentCourses;
