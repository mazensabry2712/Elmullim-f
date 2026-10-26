import { BENEFITS } from "@/constant";
import BenefitCard from "./BenefitCard";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/animations";
import BadgeTitle from "@/components/ui/BadgeTitle";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";
import { BookOpen, CheckCircle2, GraduationCap, Sparkles, UsersRound } from "lucide-react";

const Hero = () => {
  const { t } = useI18n();

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#F7FBF9] via-white to-[#E8F8F2] py-8 sm:py-10 xl:py-14">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-main/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-[#F6C96B]/20 blur-3xl" aria-hidden="true" />

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
              <motion.div variants={itemVariants} className="mb-5 flex justify-center xl:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full border border-main/15 bg-white/85 px-4 py-2 text-sm font-bold text-main shadow-sm backdrop-blur">
                  <Sparkles size={16} aria-hidden="true" />
                  {t("home.hero.eyebrow")}
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="mx-auto max-w-[650px] text-center text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[1.1] text-black-blue xl:text-start"
              >
                <span className="block">{t("home.hero.title")}</span>
                <span className="mt-2 block font-exo font-semibold text-main">{t("home.hero.titleHighlight")}</span>
              </motion.h1>

              <p className="mx-auto mt-5 max-w-[620px] text-center font-sora text-[15px] leading-relaxed text-[#465B58] sm:text-[16px] md:text-[17px] xl:mx-0 xl:text-start">
                {t("home.hero.description")}
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row xl:justify-start">
                <Link
                  to="/lessons"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-main px-6 py-3 text-center font-semibold text-white shadow-[0_10px_24px_rgba(10,185,157,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-main/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 sm:w-auto"
                >
                  {t("home.hero.cta.lessons")}
                </Link>
                <Link
                  to="/teachers"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-main/25 bg-white/90 px-6 py-3 text-center font-semibold text-black-blue shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-main hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 sm:w-auto"
                >
                  {t("home.hero.cta.teachers")}
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-3 xl:justify-start">
                {[
                  { icon: CheckCircle2, label: "home.hero.trust.online" },
                  { icon: GraduationCap, label: "home.hero.trust.teachers" },
                  { icon: UsersRound, label: "home.hero.trust.family" },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-2 text-sm font-semibold text-[#49615B]">
                    <Icon size={17} className="shrink-0 text-main" aria-hidden="true" />
                    {t(label)}
                  </span>
                ))}
              </div>
            </div>

            <motion.div
              variants={itemVariants}
              className="mx-auto w-full max-w-[540px] px-0 sm:px-4 xl:max-w-[576px]"
            >
              <div className="relative mx-auto flex min-h-[300px] w-full items-center justify-center rounded-[2rem] border border-white/80 bg-white/35 px-2 py-5 shadow-[0_24px_80px_rgba(10,185,157,0.12)] backdrop-blur-sm sm:min-h-[420px]">
                <div className="pointer-events-none absolute inset-4 rounded-[1.6rem] bg-gradient-to-br from-main/10 via-white/10 to-[#F7D98C]/25" aria-hidden="true" />
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src="/images/hero-img-bg.webp"
                  alt=""
                  aria-hidden="true"
                  className="absolute h-auto w-full max-w-[30rem] opacity-75"
                />
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  src="/images/hero-img.webp"
                  alt={t("home.hero.imageAlt")}
                  fetchPriority="high"
                  className="relative z-10 h-auto w-full max-w-[30rem] drop-shadow-[4px_12px_18px_rgba(20,45,55,0.18)]"
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

                <Link
                  to="/lessons"
                  aria-label={t("home.hero.visual.lessons.title")}
                  className="absolute right-0 top-[13%] z-20 hidden w-[205px] items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-3 text-start shadow-xl shadow-black/10 backdrop-blur transition duration-200 hover:-translate-y-1 md:flex"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
                    <BookOpen size={22} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-extrabold leading-snug text-black-blue">{t("home.hero.visual.lessons.title")}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-slate-500">{t("home.hero.visual.lessons.description")}</span>
                  </span>
                </Link>

                <Link
                  to="/courses"
                  aria-label={t("home.hero.visual.courses.title")}
                  className="absolute bottom-[7%] left-0 z-20 hidden w-[205px] items-center gap-3 rounded-2xl border border-white/10 bg-[#173F46] p-3 text-start text-white shadow-xl shadow-black/15 transition duration-200 hover:-translate-y-1 md:flex"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#8CE6D1]">
                    <GraduationCap size={23} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-extrabold leading-snug">{t("home.hero.visual.courses.title")}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-white/75">{t("home.hero.visual.courses.description")}</span>
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-white/80 bg-white/60 p-3 shadow-sm backdrop-blur-sm sm:mt-10 sm:p-4">
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
