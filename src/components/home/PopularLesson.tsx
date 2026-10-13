import { motion } from "framer-motion";
import BadgeTitle from "@/components/ui/BadgeTitle";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import cookieService from "@/utils/cookieService";
import { useGetLessons } from "@/lib/react-query/lessons/lessons";
import LessonList from "../lessons/LessonsList";
import { useI18n } from "@/i18n";

const PopularLessons = () => {
  const { t } = useI18n();
  const token = cookieService.getToken();
  const { data: lessons, isLoading, isError, refetch } = useGetLessons({
    ...(token && { token }),
  });
  const lessonItems = lessons?.data?.slice(0, 6) ?? [];

  return (
    <section
      id="popular-lessons"
      aria-labelledby="popular-lessons-title"
      className="bg-[#F2F2F2] pb-10"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center gap-4 text-center"
        >
          <BadgeTitle title={t("home.lessons.badge")} />
          <h2
            id="popular-lessons-title"
            className="text-2xl font-bold capitalize leading-relaxed text-black-blue md:text-3xl"
          >
            {t("home.lessons.titlePrefix")}{" "}
            <br className="sm:hidden" /> {t("home.lessons.titleSuffix")}
          </h2>
        </motion.div>

        <div className="mt-10">
          {isLoading ? (
            <div className="py-10" role="status" aria-label={t("common.loading")}>
              <Loader size={40} className="mx-auto animate-spin" aria-hidden="true" />
            </div>
          ) : isError ? (
            <div className="py-10 text-center" role="alert">
              <p className="font-sora text-base text-[#4D5756]">
                {t("home.lessons.error")}
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 rounded-lg bg-main px-6 py-2.5 font-semibold text-white transition hover:bg-main/90"
              >
                {t("home.lessons.retry")}
              </button>
            </div>
          ) : lessonItems.length > 0 ? (
            <LessonList lessons={lessonItems} />
          ) : (
            <p role="status" className="py-10 text-center font-sora text-[#4D5756]">
              {t("home.lessons.empty")}
            </p>
          )}

          <Link
            to="/lessons"
            className="mx-auto mt-5 block w-fit rounded-lg bg-main px-10 py-3 text-white duration-200 hover:bg-main/90"
          >
            {t("home.lessons.allLessons")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularLessons;
