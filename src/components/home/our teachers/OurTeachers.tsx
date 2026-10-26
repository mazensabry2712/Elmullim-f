import { containerVariants, itemVariants } from "@/animations";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getPublicTeachers } from "@/services/main";
import { useI18n } from "@/i18n";
import TeacherCard from "./TeacherCard";

const OurTeachers = () => {
  const { t, language } = useI18n();
  const isArabic = language === "ar";
  const { data, isPending, isError } = useQuery({
    queryKey: ["public-teachers", "homepage"],
    queryFn: () => getPublicTeachers(8),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const teachers = data?.data ?? [];

  return (
    <section
      id="our-teachers"
      aria-labelledby="our-teachers-title"
      className="relative overflow-hidden bg-gradient-to-br from-[#123B43] via-[#087A68] to-[#0AB99D] pb-10 pt-16 sm:pt-20"
    >
      <div className="pointer-events-none absolute -end-24 -top-28 h-80 w-80 rounded-full border-[42px] border-white/5" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-36 -start-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container"
      >
        <motion.div variants={itemVariants} className="mx-auto max-w-3xl text-center">
          <p className="font-sora text-xs font-extrabold uppercase tracking-[0.2em] text-[#BDF6E8] sm:text-sm">
            {t("home.teachers.eyebrow")}
          </p>
          <h2
            id="our-teachers-title"
            className="mt-3 px-2 text-center font-sora text-4xl font-semibold leading-tight capitalize text-white sm:text-5xl lg:text-6xl"
          >
            {t("home.teachers.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl px-3 font-sora text-sm leading-7 text-white/80 sm:text-base">
            {t("home.teachers.description")}
          </p>
        </motion.div>

        {isPending ? (
          <div
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4"
            aria-label={isArabic ? "جاري تحميل المعلمين" : "Loading teachers"}
          >
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-[25rem] animate-pulse rounded-xl bg-white/10" />
            ))}
          </div>
        ) : isError ? (
          <p role="status" className="mx-auto mt-8 max-w-2xl text-center text-white/80">
            {isArabic
              ? "تعذر تحميل المعلمين حاليًا. حاول مرة أخرى لاحقًا."
              : "Teachers are unavailable right now. Please try again later."}
          </p>
        ) : teachers.length === 0 ? (
          <p role="status" className="mx-auto mt-8 max-w-2xl text-center text-white/80">
            {isArabic ? "سيتم عرض المعلمين هنا قريبًا." : "Our teachers will be featured here soon."}
          </p>
        ) : (
          <motion.div
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4"
            variants={containerVariants}
          >
            {teachers.map((teacher) => (
              <TeacherCard teacher={teacher} key={teacher.id} />
            ))}
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/teachers"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/50 px-6 py-2.5 font-semibold text-white transition hover:bg-white hover:text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-main"
          >
            {t("home.teachers.viewAll")}
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default OurTeachers;
