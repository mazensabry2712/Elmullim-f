import Newsletter from "@/components/Newsletter";
import AboutTestimonial from "@/components/about/AboutTestimonial";
import CoursesList from "@/components/courses/CoursesList";
import FunFacts from "@/components/FunFacts";
import { useI18n } from "@/i18n";
import { useGetCourses } from "@/lib/react-query/courses/courses";
import { RootState } from "@/store/store";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { ArrowRight, Loader } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const About = () => {
  const { t } = useI18n();
  const token = cookieService.getToken();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: courses, isLoading } = useGetCourses({
    ...(token && { token }),
  });

  return (
    <main aria-labelledby="about-page-title">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container text-center text-white space-y-4 md:space-y-6 pt-20 md:pt-32 pb-16 md:pb-24"
      >
        <h1
          id="about-page-title"
          className="text-4xl font-bold leading-tight uppercase md:text-6xl md:leading-[74px]"
        >
          {t("about.hero.title")}
        </h1>
        <p className="font-sora font-light leading-[30px]" aria-label={t("about.hero.breadcrumb") }>
          <Link to="/" className="hover:text-main transition-colors">
            {t("nav.home")}
          </Link>{" "}
          <span className="text-main" aria-hidden="true">
            //
          </span>{" "}
          {t("about.hero.title")}
        </p>
      </motion.div>

      <motion.section
        aria-labelledby="about-overview-title"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
      >
        <div className="container py-12 md:py-24 overflow-hidden">
          <div className="flex flex-col xl:flex-row items-center justify-center gap-x-4 gap-y-7">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <img
                src="/images/about.webp"
                alt={t("about.overview.imageAlt")}
                width={700}
                height={700}
                loading="lazy"
                className="w-full h-full scale-110"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1 relative"
            >
              <img
                src="/icons/triangle.webp"
                alt=""
                aria-hidden="true"
                width={288}
                height={288}
                loading="lazy"
                className="w-72 absolute -bottom-8 -right-0 lg:-right-32"
              />

              <div className="relative">
                <div className="space-y-2 xl:space-y-3 text-center xl:text-start">
                  <p className="text-main font-sora uppercase flex items-center justify-center xl:justify-start gap-1 xl:text-lg font-light">
                    <i
                      className="fi fi-ts-book-bookmark flex justify-center items-center"
                      aria-hidden="true"
                    />
                    {t("about.overview.badge")}
                  </p>
                  <h2
                    id="about-overview-title"
                    className="text-black-blue text-3xl xl:text-[44px] leading-[55px] capitalize font-bold"
                  >
                    {t("about.overview.title")}{" "}
                    <span className="text-main">{t("about.overview.highlight")}</span>
                  </h2>
                  <p className="text-[#4D5756] font-sora leading-[32px]">
                    {t("about.overview.description")}
                  </p>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-5">
                    <div
                      className="flex-shrink-0 bg-black-blue text-white rounded-[10px] w-[60px] h-[60px] flex justify-center items-center"
                      aria-hidden="true"
                    >
                      <i className="fi fi-tr-lesson text-3xl flex justify-center items-center" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl text-black-blue font-bold">
                        {t("about.overview.feature.screen.title")}
                      </h3>
                      <p className="text-[#4D5756] text-[17px] font-sora">
                        {t("about.overview.feature.screen.description")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div
                      className="flex-shrink-0 bg-black-blue text-white rounded-[10px] w-[60px] h-[60px] flex justify-center items-center"
                      aria-hidden="true"
                    >
                      <i className="fi fi-rr-lightbulb-on text-3xl flex justify-center items-center" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl text-black-blue font-bold">
                        {t("about.overview.feature.presenter.title")}
                      </h3>
                      <p className="text-[#4D5756] text-[17px] font-sora">
                        {t("about.overview.feature.presenter.description")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col md:flex-row items-center justify-center md:justify-start gap-x-8 gap-y-3">
                  <Link
                    to={isAuthenticated ? "/profile" : "/sign-in"}
                    className="w-full md:w-fit flex justify-center items-center gap-2 bg-main rounded-[5px] px-5 py-4 capitalize text-white font-sora"
                  >
                    {t("about.overview.cta")}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                  <img
                    src="/icons/arrows.webp"
                    alt=""
                    aria-hidden="true"
                    width={256}
                    height={64}
                    loading="lazy"
                    className="max-w-64"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <FunFacts />
        <AboutTestimonial />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container py-12 md:py-24 space-y-6"
        >
          <div className="space-y-2">
            <p className="text-main uppercase flex items-center gap-2 justify-center font-semibold text-lg">
              <i
                className="fi fi-ts-book-bookmark flex justify-center items-center"
                aria-hidden="true"
              />
              {t("about.courses.badge")}
              <i
                className="fi fi-ts-book-bookmark flex justify-center items-center"
                aria-hidden="true"
              />
            </p>
            <h2 className="text-center text-black-blue text-3xl xl:text-[44px] leading-[55px] capitalize font-bold mx-auto max-w-[660px]">
              {t("about.courses.title")}
            </h2>
          </div>
          {isLoading ? (
            <div className="py-5" role="status" aria-live="polite">
              <Loader size={40} className="animate-spin mx-auto" aria-hidden="true" />
              <span className="sr-only">{t("common.loading")}</span>
            </div>
          ) : (
            <CoursesList courses={courses?.data?.slice(0, 3) || []} />
          )}
          <Link
            to="/courses"
            className="block w-fit mt-5 bg-main hover:bg-main/90 duration-200 rounded-lg mx-auto px-10 py-3 text-white"
          >
            {t("about.courses.allCourses")}
          </Link>
        </motion.div>
        <Newsletter />
      </motion.section>
    </main>
  );
};

export default About;
