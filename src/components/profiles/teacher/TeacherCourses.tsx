import { Loader, Plus, Sparkles } from "lucide-react";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { useGetTeacherCourses } from "@/lib/react-query/teacher/courses";
import { containerVariants, itemVariants } from "@/animations";
import TeacherCourseCard from "./courses/TeacherCourseCard";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";

const TeacherCourses = () => {
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const isArabic = language === "ar";
  const { data: courses, isLoading, isError, refetch } = useGetTeacherCourses(token);
  const courseCount = courses?.data?.length ?? 0;

  return (
    <section className="overflow-hidden rounded-3xl border border-black-blue/[0.06] bg-white shadow-[0_18px_55px_rgba(33,55,75,0.06)]">
      <div className="border-b border-black-blue/[0.06] px-5 py-5 md:px-8 md:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-main/10 px-3 py-1.5 text-xs font-bold text-main">
              <Sparkles className="h-3.5 w-3.5" />
              {isArabic ? "محتوى المعلم" : "Teacher content"}
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-black-blue md:text-3xl">
              {isArabic ? "كورساتي" : "My Courses"}
            </h2>
            <p className="mt-1 text-sm text-black-blue/50">
              {isArabic
                ? "اعرض كورساتك وحدثها بسهولة من نفس الصفحة."
                : "Manage and update your courses from one place."}
            </p>
          </div>

          <Link
            to="/profile/teacher/courses/upload"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-main px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(10,185,157,0.18)] transition hover:-translate-y-0.5 hover:bg-main/90 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            {isArabic ? "إضافة كورس" : "Add course"}
          </Link>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-5 md:px-8 md:py-8">
        {isLoading ? (
          <div className="flex min-h-72 items-center justify-center rounded-2xl bg-[#FBFDFC]" role="status" aria-live="polite">
            <div className="text-center">
              <Loader size={38} className="mx-auto animate-spin text-main" />
              <span className="sr-only">
                {isArabic ? "جاري تحميل الكورسات" : "Loading courses"}
              </span>
            </div>
          </div>
        ) : isError ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/50 px-5 text-center" role="alert">
            <p className="max-w-md text-sm font-semibold text-black-blue/65">
              {isArabic ? "تعذر تحميل الكورسات حاليًا." : "Unable to load courses right now."}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-xl bg-main px-5 py-2.5 text-sm font-bold text-white transition hover:bg-main/90"
            >
              {isArabic ? "حاول مرة أخرى" : "Try again"}
            </button>
          </div>
        ) : !courseCount ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-black-blue/[0.1] bg-[#FBFDFC] px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-main/10 text-main">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="mt-4 text-base font-extrabold text-black-blue">
              {isArabic ? "لا توجد كورسات بعد" : "No courses yet"}
            </p>
            <p className="mt-1 max-w-md text-sm leading-6 text-black-blue/50">
              {isArabic
                ? "أضف أول كورس ليظهر هنا ويكون جاهزًا للإدارة."
                : "Add your first course to make it available here."}
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            viewport={{ once: true }}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6"
          >
            {(courses?.data ?? []).map((course) => (
              <motion.div variants={itemVariants} key={course.id} className="h-full">
                <TeacherCourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TeacherCourses;
