import { motion } from "framer-motion";
import BadgeTitle from "@/components/ui/BadgeTitle";
import CoursesList from "../courses/CoursesList";
import { useGetCourses } from "@/lib/react-query/courses/courses";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";

const PopularCourses = () => {
  const { t } = useI18n();
  const token = cookieService.getToken();
  const { data: courses, isLoading } = useGetCourses({
    ...(token && { token }),
  });

  return (
    <section
      id="popular-courses"
      aria-labelledby="popular-courses-title"
      className="pt-20 pb-10 bg-[#F2F2F2]"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center gap-4 items-center text-center"
        >
          <BadgeTitle title={t("home.courses.badge")} />
          <h2
            id="popular-courses-title"
            className="capitalize text-black-blue font-bold text-2xl md:text-3xl leading-relaxed"
          >
            {t("home.courses.titlePrefix")} <br className="sm:hidden" /> {t("home.courses.titleSuffix")}
          </h2>
        </motion.div>

        <div className="mt-10">
          {isLoading ? (
            <div className="py-10" role="status" aria-label={t("common.loading")}>
              <Loader size={40} className="animate-spin mx-auto" />
            </div>
          ) : (
            <CoursesList courses={courses?.data?.slice(0, 6) || []} />
          )}

          <Link
            to="/courses"
            className="block w-fit mt-5 bg-main hover:bg-main/90 duration-200 rounded-lg mx-auto px-10 py-3 text-white"
          >
            {t("home.courses.allCourses")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularCourses;
