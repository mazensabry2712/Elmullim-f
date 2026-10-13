import { BENEFITS } from "@/constant";
import BenefitCard from "./BenefitCard";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/animations";
import BadgeTitle from "@/components/ui/BadgeTitle";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";

const Hero = () => {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-[#F2F2F2] py-8 sm:py-10 xl:py-12">
      <div className="relative container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[220px] -translate-x-1/2 bg-main blur-[150px] sm:h-[400px] sm:w-[320px] sm:blur-[220px] xl:left-0 xl:h-[460px] xl:w-[400px] xl:translate-x-0 xl:blur-[260px]"
          aria-hidden="true"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
          className="relative z-10"
        >
          <div className="grid w-full items-center gap-6 xl:grid-cols-2 xl:gap-10">
            <div className="relative min-w-0">
              <motion.h1
                variants={itemVariants}
                className="mx-auto max-w-[650px] text-center text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[1.1] text-black-blue xl:text-start"
              >
                {t("home.hero.title")}{" "}
                <span className="font-exo font-semibold text-main">ELMULLIM</span>
              </motion.h1>

              <p className="mx-auto mt-5 max-w-[620px] text-center font-sora text-[15px] leading-relaxed text-[#333931] sm:text-[16px] md:text-[17px] xl:mx-0 xl:text-start">
                {t("home.hero.description")}
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row xl:justify-start">
                <Link
                  to="/lessons"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-main px-6 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 sm:w-auto"
                >
                  {t("home.hero.cta.lessons")}
                </Link>
                <Link
                  to="/teachers"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-main/30 bg-white px-6 py-3 text-center font-semibold text-black-blue transition hover:border-main hover:bg-main/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 sm:w-auto"
                >
                  {t("home.hero.cta.teachers")}
                </Link>
              </div>
            </div>

            <motion.div
              variants={itemVariants}
              className="mx-auto w-full max-w-[540px] px-0 sm:px-4 xl:max-w-[576px]"
            >
              <div className="relative mx-auto flex w-full items-center justify-center">
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src="/images/hero-img-bg.webp"
                  alt=""
                  aria-hidden="true"
                  className="absolute h-auto w-full max-w-[30rem]"
                />
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  src="/images/hero-img.webp"
                  alt={t("home.hero.imageAlt")}
                  fetchPriority="high"
                  className="relative z-10 h-auto w-full max-w-[30rem] drop-shadow-[4px_4px_4px_rgba(0,0,0,0.25)]"
                />
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  src="/icons/cap-icon.svg"
                  alt=""
                  aria-hidden="true"
                  className="absolute left-0 top-6 z-20 w-10 sm:-left-2 sm:top-10 sm:w-auto xl:-left-8 xl:top-12"
                />
              </div>
            </motion.div>
          </div>

          <div className="mt-8 sm:mt-10">
            <div className="mb-4 flex justify-center">
              <BadgeTitle title={t("home.hero.benefits")} />
            </div>
            <motion.div
              id="home-hero-benefits"
              variants={containerVariants}
              className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
            >
              {BENEFITS.map((benefit) => (
                <motion.div key={benefit.title} variants={itemVariants} className="min-w-0">
                  <BenefitCard benefit={benefit} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
