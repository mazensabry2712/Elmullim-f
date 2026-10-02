import { Filter, Loader, Plus, Search, Sparkles } from "lucide-react";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { useGetTeacherLessons } from "@/lib/react-query/teacher/lessons";
import { containerVariants, itemVariants } from "@/animations";
import TeacherLessonCard from "./lessons/TeacherLessonCard";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";
import { useMemo, useState } from "react";

const TeacherLessons = () => {
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const isArabic = language === "ar";
  const { data: lessons, isLoading, isError, refetch } = useGetTeacherLessons(token);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "pending_approval" | "rejected" | "draft">("all");

  const allLessons = lessons?.data ?? [];
  const stats = useMemo(() => ({
    total: allLessons.length,
    published: allLessons.filter((lesson) => lesson.publishing_status === "published").length,
    pending: allLessons.filter((lesson) => lesson.publishing_status === "pending_approval").length,
    drafts: allLessons.filter((lesson) => lesson.publishing_status === "draft" || lesson.publishing_status === "rejected").length,
  }), [allLessons]);

  const filteredLessons = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allLessons.filter((lesson) => {
      const matchesSearch =
        !query ||
        lesson.title.toLowerCase().includes(query) ||
        (lesson.grade || "").toLowerCase().includes(query);
      const matchesStatus = status === "all" || lesson.publishing_status === status;
      return matchesSearch && matchesStatus;
    });
  }, [allLessons, search, status]);

  const lessonCount = filteredLessons.length;

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
              <p className="mt-1 max-w-2xl text-sm leading-6 text-black-blue/50">
                {isArabic
                  ? "أنشئ دروسك، راقب جاهزيتها للحجز، وتابع التوافر والمكان والحالة من نفس الشاشة."
                  : "Create lessons, monitor booking readiness, and manage availability, location and status from one place."}
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

        <div className="border-b border-black-blue/[0.06] bg-[#FBFDFC] px-4 py-4 sm:px-5 md:px-8">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              [isArabic ? "إجمالي الدروس" : "Total lessons", stats.total],
              [isArabic ? "منشورة" : "Published", stats.published],
              [isArabic ? "قيد المراجعة" : "Pending review", stats.pending],
              [isArabic ? "تحتاج متابعة" : "Needs attention", stats.drafts],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border border-black-blue/[0.06] bg-white px-4 py-3 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wide text-black-blue/40">{label}</p>
                <p className="mt-1 text-2xl font-black text-black-blue">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-6 sm:px-5 md:px-8 md:py-8">
          <div className="mb-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
            <label className="relative block">
              <span className="sr-only">{isArabic ? "بحث في الدروس" : "Search lessons"}</span>
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black-blue/35" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={isArabic ? "ابحث باسم الدرس أو الصف..." : "Search by lesson title or grade..."}
                className="h-11 w-full rounded-xl border border-black-blue/10 bg-white ps-10 pe-4 text-sm text-black-blue outline-none transition focus:border-main/40 focus:ring-2 focus:ring-main/10"
              />
            </label>
            <label className="relative block">
              <span className="sr-only">{isArabic ? "تصفية الحالة" : "Filter status"}</span>
              <Filter className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black-blue/35" />
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as typeof status)}
                className="h-11 w-full appearance-none rounded-xl border border-black-blue/10 bg-white ps-10 pe-4 text-sm font-semibold text-black-blue outline-none focus:border-main/40 focus:ring-2 focus:ring-main/10"
              >
                <option value="all">{isArabic ? "كل الحالات" : "All statuses"}</option>
                <option value="published">{isArabic ? "منشور" : "Published"}</option>
                <option value="pending_approval">{isArabic ? "قيد المراجعة" : "Pending review"}</option>
                <option value="rejected">{isArabic ? "مرفوض" : "Rejected"}</option>
                <option value="draft">{isArabic ? "مسودة" : "Draft"}</option>
              </select>
            </label>
          </div>

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
                {allLessons.length === 0
                  ? (isArabic ? "لا توجد دروس بعد" : "No lessons yet")
                  : (isArabic ? "لا توجد نتائج مطابقة" : "No matching lessons")}
              </p>
              <p className="mt-1 max-w-md text-sm leading-6 text-black-blue/50">
                {allLessons.length === 0
                  ? (isArabic
                      ? "أضف أول درس ليظهر هنا ويكون جاهزًا للحجز."
                      : "Add your first lesson to make it ready for booking.")
                  : (isArabic
                      ? "غيّر البحث أو الفلتر لعرض دروسك الأخرى."
                      : "Change your search or filter to see your other lessons.")}
              </p>
            </div>
          ) : (
            <div className="mb-4 rounded-xl bg-main/[0.04] px-4 py-3 text-xs font-semibold text-black-blue/60">
              {isArabic ? `عرض ${filteredLessons.length} من ${allLessons.length} درس` : `Showing ${filteredLessons.length} of ${allLessons.length} lessons`}
            </div>
            <motion.div
              variants={containerVariants}
              viewport={{ once: true }}
              initial="hidden"
              whileInView="visible"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6"
            >
              {filteredLessons.map((lesson) => (
                <motion.div variants={itemVariants} key={lesson.id} className="h-full">
                  <TeacherLessonCard lesson={lesson} />
                </motion.div>
              ))}
            </motion.div>
            </>
          )}
        </div>
      </div>

    </section>
  );
};

const VideoIcon = () => <Sparkles className="h-6 w-6" />;

export default TeacherLessons;
