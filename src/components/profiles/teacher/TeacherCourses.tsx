import { Loader } from "lucide-react";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { useGetTeacherCourses } from "@/lib/react-query/teacher/courses";
import { containerVariants, itemVariants } from "@/animations";
import TeacherCourseCard from "./courses/TeacherCourseCard";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";

const TeacherCourses = () => {
  const token = cookieService.getToken()!;
  const { language } = useI18n();
  const isArabic = language === "ar";
  const { data: courses, isLoading, isError, refetch } = useGetTeacherCourses(token);

  return (
    <div className="pb-10 mt-4 overflow-hidden bg-white rounded-lg">
      <h2 className="font-sora font-bold text-center capitalize text-main text-2xl my-5">
        {isArabic ? "كورساتي" : "My Courses"}
      </h2>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
      >
        <div className="px-3 md:px-8">
          <Link
            to={"/profile/teacher/courses/upload"}
            className="flex justify-center items-center bg-main text-white rounded-md py-3 px-6 w-full sm:w-fit ml-auto"
          >
            {isArabic ? "إضافة كورس جديد" : "Add new course"}
          </Link>
        </div>
        <div className="py-12 md:py-16 px-3 md:px-8">
          {isLoading ? (
            <div className="py-12" role="status" aria-live="polite">
              <Loader size={40} className="animate-spin mx-auto" />
              <span className="sr-only">{isArabic ? "جاري تحميل الكورسات" : "Loading courses"}</span>
            </div>
          ) : isError ? (
            <div className="py-12 text-center" role="alert">
              <p className="font-sora text-sm text-[#4D5756]">{isArabic ? "تعذر تحميل الكورسات حاليًا." : "Unable to load courses right now."}</p>
              <button type="button" onClick={() => void refetch()} className="mt-4 rounded-md bg-main px-5 py-2 text-sm font-semibold text-white">{isArabic ? "حاول مرة أخرى" : "Try again"}</button>
            </div>
          ) : (
            <>
              {!courses?.data.length ? (
                <p className="font-medium fon-sora text-lg text-center text-[#4D5756] pt-5">
                  {isArabic ? "لا توجد كورسات بعد." : "No courses found"}
                </p>
              ) : (
                <motion.div
                  variants={containerVariants}
                  viewport={{ once: true }}
                  initial="hidden"
                  whileInView="visible"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-9"
                >
                  {courses.data.map((course, idx) => (
                    <motion.div variants={itemVariants} key={idx}>
                      <TeacherCourseCard course={course} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default TeacherCourses;
