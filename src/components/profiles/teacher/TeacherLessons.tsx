import { Loader, Plus, Sparkles } from "lucide-react";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { useGetTeacherLessons } from "@/lib/react-query/teacher/lessons";
import { containerVariants, itemVariants } from "@/animations";
import TeacherLessonCard from "./lessons/TeacherLessonCard";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";

const TeacherLessons = () => {
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const isArabic = language === "ar";
  const { data: lessons, isLoading, isError, refetch } = useGetTeacherLessons(token);
  const lessonCount = lessons?.data?.length ?? 0;

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-black-blue/[0.06] bg-white shadow-[0_18px_55px_rgba(33,55,75,0.06)]">
        <div className="border-b border-black-blue/[0.06] px-5 py-5 md:px-8 md:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-main/10 px-3 py-1.5 text-xs font-bold text-main">
                <Sparkles className="h-3.5 w-3.5" />
                {isArabic ? "إدارة الدروس" : "Lesson management"}
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-black-blue md:text-3xl">
                {isArabic ? "دروسي" : "My Lessons"}
              </h2>
              <p className="mt-1 text-sm text-black-blue/50">
                {isArabic
                  ? "أنشئ دروسك وتابع إعدادات الحجز والتوافر."
                  : "Create lessons and manage their booking availability."}
              </p>
            </div>

            <Link
              to="/profile/teacher/lessons/upload"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-main px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(10,185,157,0.18)] transition hover:-translate-y-0.5 hover:bg-main/90 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              {isArabic ? "إضافة درس" : "Add lesson"}
            </Link>
          </div>
        </div>

        <div className="px-4 py-6 sm:px-5 md:px-8 md:py-8">
          {isLoading ? (
            <div className="flex min-h-72 items-center justify-center rounded-2xl bg-[#FBFDFC]" role="status" aria-live="polite">
              <Loader size={38} className="mx-auto animate-spin text-main" />
              <span className="sr-only">
                {isArabic ? "جاري تحميل الدروس" : "Loading lessons"}
              </span>
            </div>
          ) : isError ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/50 px-5 text-center" role="alert">
              <p className="max-w-md text-sm font-semibold text-black-blue/65">
                {isArabic ? "تعذر تحميل الدروس حاليًا." : "Unable to load lessons right now."}
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 rounded-xl bg-main px-5 py-2.5 text-sm font-bold text-white transition hover:bg-main/90"
              >
                {isArabic ? "حاول مرة أخرى" : "Try again"}
              </button>
            </div>
          ) : !lessonCount ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-black-blue/[0.1] bg-[#FBFDFC] px-5 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-main/10 text-main">
                <VideoIcon />
              </div>
              <p className="mt-4 text-base font-extrabold text-black-blue">
                {isArabic ? "لا توجد دروس بعد" : "No lessons yet"}
              </p>
              <p className="mt-1 max-w-md text-sm leading-6 text-black-blue/50">
                {isArabic
                  ? "أضف أول درس ليظهر هنا ويكون جاهزًا للحجز."
                  : "Add your first lesson to make it ready for booking."}
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
              {(lessons?.data ?? []).map((lesson) => (
                <motion.div variants={itemVariants} key={lesson.id} className="h-full">
                  <TeacherLessonCard lesson={lesson} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

    </section>
  );
};

const VideoIcon = () => <Sparkles className="h-6 w-6" />;

export default TeacherLessons;
