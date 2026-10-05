import { Filter, Loader, Plus, Search, Sparkles } from "lucide-react";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { useGetTeacherCourses } from "@/lib/react-query/teacher/courses";
import { containerVariants, itemVariants } from "@/animations";
import TeacherCourseCard from "./courses/TeacherCourseCard";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";
import { useMemo, useState } from "react";
import { CoursePublishingStatus } from "@/interfaces/courses/courses";

const TeacherCourses = () => {
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const isArabic = language === "ar";
  const { data: courses, isLoading, isError, refetch } = useGetTeacherCourses(token);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CoursePublishingStatus | "all">("all");
  const [level, setLevel] = useState("all");
  const [category, setCategory] = useState("all");

  const allCourses = useMemo(() => courses?.data ?? [], [courses?.data]);

  const levelOptions = useMemo(
    () =>
      Array.from(
        new Set(allCourses.map((course) => String(course.level || "")).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b)),
    [allCourses]
  );

  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Map(
          allCourses
            .filter((course) => course.sub_category?.category?.name)
            .map((course) => [
              String(course.sub_category.category.id),
              course.sub_category.category.name,
            ])
        ).entries()
      ).sort((a, b) => a[1].localeCompare(b[1])),
    [allCourses]
  );

  const stats = useMemo(
    () => ({
      total: allCourses.length,
      published: allCourses.filter((course) => course.publishing_status === "published").length,
      pending: allCourses.filter((course) => course.publishing_status === "pending_approval").length,
      drafts: allCourses.filter((course) => course.publishing_status === "draft").length,
      rejected: allCourses.filter((course) => course.publishing_status === "rejected").length,
    }),
    [allCourses]
  );

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allCourses.filter((course) => {
      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        String(course.level || "").toLowerCase().includes(query) ||
        String(course.sub_category?.name || "").toLowerCase().includes(query) ||
        String(course.sub_category?.category?.name || "").toLowerCase().includes(query);

      const matchesStatus = status === "all" || course.publishing_status === status;
      const matchesLevel = level === "all" || String(course.level || "") === level;
      const matchesCategory =
        category === "all" || String(course.sub_category?.category?.id || "") === category;

      return matchesSearch && matchesStatus && matchesLevel && matchesCategory;
    });
  }, [allCourses, search, status, level, category]);

  const courseCount = filteredCourses.length;

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-black-blue/[0.06] bg-white shadow-[0_18px_55px_rgba(33,55,75,0.06)]">
        <div className="border-b border-black-blue/[0.06] px-5 py-5 md:px-8 md:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-main/10 px-3 py-1.5 text-xs font-bold text-main">
                <Sparkles className="h-3.5 w-3.5" />
                {isArabic ? "إدارة الكورسات" : "Course management"}
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-black-blue md:text-3xl">
                {isArabic ? "كورساتي" : "My Courses"}
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-black-blue/50">
                {isArabic
                  ? "أنشئ كورساتك، تابع حالة المراجعة، وأدر المحتوى من نفس الشاشة."
                  : "Create courses, track review status, and manage your course content from one screen."}
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

        <div className="border-b border-black-blue/[0.06] bg-[#FBFDFC] px-4 py-4 sm:px-5 md:px-8">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              [isArabic ? "إجمالي الكورسات" : "Total courses", stats.total],
              [isArabic ? "منشور" : "Published", stats.published],
              [isArabic ? "قيد المراجعة" : "Pending review", stats.pending],
              [isArabic ? "مسودات" : "Drafts", stats.drafts],
              [isArabic ? "مرفوض" : "Rejected", stats.rejected],
            ].map(([label, value]) => (
              <div
                key={String(label)}
                className="rounded-2xl border border-black-blue/[0.06] bg-white px-4 py-3 shadow-sm"
              >
                <p className="text-[11px] font-bold uppercase tracking-wide text-black-blue/40">
                  {label}
                </p>
                <p className="mt-1 text-2xl font-black text-black-blue">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-6 sm:px-5 md:px-8 md:py-8">
          <div className="mb-6 grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
            <label className="relative block">
              <span className="sr-only">
                {isArabic ? "بحث في الكورسات" : "Search courses"}
              </span>
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black-blue/35" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={
                  isArabic
                    ? "ابحث باسم الكورس أو الوصف أو المرحلة..."
                    : "Search by title, description or level..."
                }
                className="h-11 w-full rounded-xl border border-black-blue/10 bg-white ps-10 pe-4 text-sm text-black-blue outline-none transition focus:border-main/40 focus:ring-2 focus:ring-main/10"
              />
            </label>

            <label className="relative block">
              <span className="sr-only">
                {isArabic ? "تصفية الحالة" : "Filter status"}
              </span>
              <Filter className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black-blue/35" />
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as CoursePublishingStatus | "all")
                }
                className="h-11 w-full appearance-none rounded-xl border border-black-blue/10 bg-white ps-10 pe-4 text-sm font-semibold text-black-blue outline-none focus:border-main/40 focus:ring-2 focus:ring-main/10"
              >
                <option value="all">{isArabic ? "كل الحالات" : "All statuses"}</option>
                <option value="published">{isArabic ? "منشور" : "Published"}</option>
                <option value="pending_approval">
                  {isArabic ? "قيد المراجعة" : "Pending review"}
                </option>
                <option value="rejected">{isArabic ? "مرفوض" : "Rejected"}</option>
                <option value="draft">{isArabic ? "مسودة" : "Draft"}</option>
              </select>
            </label>

            <label className="block">
              <span className="sr-only">
                {isArabic ? "تصفية المرحلة" : "Filter level"}
              </span>
              <select
                aria-label={isArabic ? "المرحلة" : "Level"}
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                className="h-11 w-full rounded-xl border border-black-blue/10 bg-white px-4 text-sm font-semibold text-black-blue outline-none focus:border-main/40 focus:ring-2 focus:ring-main/10"
              >
                <option value="all">{isArabic ? "كل المراحل" : "All levels"}</option>
                {levelOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="sr-only">
                {isArabic ? "تصفية التصنيف" : "Filter category"}
              </span>
              <select
                aria-label={isArabic ? "التصنيف" : "Category"}
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-11 w-full rounded-xl border border-black-blue/10 bg-white px-4 text-sm font-semibold text-black-blue outline-none focus:border-main/40 focus:ring-2 focus:ring-main/10"
              >
                <option value="all">{isArabic ? "كل التصنيفات" : "All categories"}</option>
                {categoryOptions.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {isLoading ? (
            <div
              className="flex min-h-72 items-center justify-center rounded-2xl bg-[#FBFDFC]"
              role="status"
              aria-live="polite"
            >
              <div className="text-center">
                <Loader size={38} className="mx-auto animate-spin text-main" />
                <span className="sr-only">
                  {isArabic ? "جاري تحميل الكورسات" : "Loading courses"}
                </span>
              </div>
            </div>
          ) : isError ? (
            <div
              className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/50 px-5 text-center"
              role="alert"
            >
              <p className="max-w-md text-sm font-semibold text-black-blue/65">
                {isArabic
                  ? "تعذر تحميل الكورسات حاليًا."
                  : "Unable to load courses right now."}
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
                {allCourses.length === 0
                  ? isArabic
                    ? "لا توجد كورسات بعد"
                    : "No courses yet"
                  : isArabic
                    ? "لا توجد نتائج مطابقة"
                    : "No matching courses"}
              </p>

              <p className="mt-1 max-w-md text-sm leading-6 text-black-blue/50">
                {allCourses.length === 0
                  ? isArabic
                    ? "أضف أول كورس ليظهر هنا وتبدأ في بناء المحتوى."
                    : "Add your first course to start building its content."
                  : isArabic
                    ? "غيّر البحث أو الفلاتر لعرض كورساتك الأخرى."
                    : "Change your search or filters to see your other courses."}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 rounded-xl bg-main/[0.04] px-4 py-3 text-xs font-semibold text-black-blue/60">
                {isArabic
                  ? `عرض ${filteredCourses.length} من ${allCourses.length} كورس`
                  : `Showing ${filteredCourses.length} of ${allCourses.length} courses`}
              </div>

              <motion.div
                variants={containerVariants}
                viewport={{ once: true }}
                initial="hidden"
                whileInView="visible"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6"
              >
                {filteredCourses.map((course) => (
                  <motion.div
                    variants={itemVariants}
                    key={course.id}
                    className="h-full"
                  >
                    <TeacherCourseCard course={course} />
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

export default TeacherCourses;
