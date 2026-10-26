import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { containerVariants, itemVariants } from "@/animations";
import BadgeTitle from "@/components/ui/BadgeTitle";
import { useI18n } from "@/i18n";
import { getPublicSubjects } from "@/services/main";
import SubjectCard from "./SubjectCard";

const Categories = () => {
  const { t } = useI18n();
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["public-subjects", "homepage"],
    queryFn: () => getPublicSubjects(1, 8),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const subjects = data?.data.subjects ?? [];

  return (
    <section id="categories" aria-labelledby="home-subjects-title" className="relative z-10 bg-white py-14 md:py-16">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="flex flex-col items-center justify-between gap-5 md:flex-row md:items-end"
        >
          <motion.div variants={itemVariants} className="flex flex-col items-center gap-2 md:items-start">
            <BadgeTitle title={t("home.subjects.badge")} />
            <h2 id="home-subjects-title" className="text-center text-3xl font-bold capitalize leading-tight text-black-blue sm:text-4xl md:text-left lg:text-[45px]">
              {t("home.subjects.titlePrefix")}{" "}
              <span className="font-exo font-semibold text-main">{t("home.subjects.titleHighlight")}</span>
            </h2>
          </motion.div>
          <Link to="/subjects" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-main px-5 py-2.5 font-bold text-main transition hover:bg-main hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2">
            {t("home.subjects.viewAll")}
          </Link>
        </motion.div>

        {isPending ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4" role="status" aria-label={t("home.subjects.loading")}>
            {Array.from({ length: 8 }, (_, index) => <div key={index} className="h-56 animate-pulse rounded-xl bg-slate-100" />)}
          </div>
        ) : isError ? (
          <div className="mt-8 py-10 text-center" role="alert">
            <p className="text-[#4D5756]">{t("home.subjects.error")}</p>
            <button type="button" onClick={() => void refetch()} className="mt-4 rounded-lg bg-main px-5 py-2.5 font-semibold text-white transition hover:bg-main/90">
              {t("home.subjects.retry")}
            </button>
          </div>
        ) : subjects.length === 0 ? (
          <p className="mt-8 py-10 text-center text-[#4D5756]" role="status">{t("home.subjects.empty")}</p>
        ) : (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants} className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {subjects.map((subject) => (
              <motion.div variants={itemVariants} key={subject.id}>
                <SubjectCard subject={subject} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Categories;
