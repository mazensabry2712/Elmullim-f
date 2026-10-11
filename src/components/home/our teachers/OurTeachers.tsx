import { containerVariants, itemVariants } from "@/animations";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getPublicTeachers } from "@/services/main";
import { useI18n } from "@/i18n";
import TeacherCard from "./TeacherCard";

const OurTeachers = () => {
  const { t } = useI18n();
  const isArabic = typeof document !== "undefined" && document.documentElement.lang === "ar";
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
      className="overflow-hidden bg-main pb-10 pt-16 sm:pt-20"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container"
      >
        <motion.div variants={itemVariants}>
          <h2
            id="our-teachers-title"
            className="px-2 text-center font-sora text-4xl font-semibold leading-tight capitalize text-white sm:text-5xl lg:text-6xl"
          >
            {t("home.teachers.title")}
          </h2>
        </motion.div>

        {isPending ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4" aria-label={isArabic ? "جاري تحميل المعلمين" : "Loading teachers"}>
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-[25rem] animate-pulse rounded-xl bg-white/10" />
            ))}
          </div>
        ) : isError ? (
          <p role="status" className="mx-auto mt-8 max-w-2xl text-center text-white/80">
            {isArabic ? "تعذر تحميل المعلمين حاليًا. حاول مرة أخرى لاحقًا." : "Teachers are unavailable right now. Please try again later."}
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
      </motion.div>
    </section>
  );
};

export default OurTeachers;
