import { BENEFITS } from "@/constant";
import BenefitCard from "./BenefitCard";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/animations";
import BadgeTitle from "@/components/ui/BadgeTitle";
import { useI18n } from "@/i18n";

const Hero = () => {
  const { t } = useI18n();

  return (
    <section className="overflow-hidden bg-[#F2F2F2] py-6 sm:py-8">
      <div className="relative container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[220px] -translate-x-1/2 bg-main blur-[180px] sm:h-[450px] sm:w-[320px] sm:blur-[260px] xl:left-0 xl:w-full xl:max-w-[400px] xl:translate-x-0 xl:blur-[600px]"
          aria-hidden="true"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
          className="relative z-10 flex flex-col justify-between gap-8 xl:flex-row xl:gap-4"
        >
          <div className="relative mt-2 w-full xl:mt-0 xl:max-w-[646px]">
            <motion.div
              className="absolute bottom-0 left-0 -z-10 hidden h-[85%] w-full bg-[#F6F6F6] xl:block"
              style={{
                clipPath: "polygon(44% 0, 100% 0, 68% 100%, 8% 100%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />

            <motion.h1
              variants={itemVariants}
              className="mx-auto max-w-[646px] px-1 text-center text-[clamp(2rem,8vw,2.8125rem)] font-bold leading-[1.1] capitalize text-black-blue sm:px-0"
            >
              {t("home.hero.title")} {" "}
              <span className="font-exo font-semibold text-main">ELMULLIM</span>
            </motion.h1>

            <div className="space-y-6 font-sora">
              <motion.div
                variants={itemVariants}
                className="mt-4 flex flex-col items-center gap-2 xl:items-start"
              >
                <BadgeTitle title={t("home.hero.whyChooseUs")} />
                <p className="max-w-[646px] text-center text-[15px] leading-relaxed text-[#333931] sm:text-[16px] md:text-[17px] xl:text-start">
                  {t("home.hero.description")}
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center gap-4 xl:items-start"
              >
                <BadgeTitle title={t("home.hero.benefits")} />
                <motion.div
                  variants={containerVariants}
                  className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2"
                >
                  {BENEFITS.map((benefit, idx) => (
                    <motion.div key={idx} variants={itemVariants} className="min-w-0">
                      <BenefitCard benefit={benefit} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>

          <motion.div
            variants={itemVariants}
            className="mx-auto w-full max-w-[576px] px-0 py-8 sm:px-4 sm:py-12 xl:mt-10 xl:max-w-[576px] xl:py-16"
          >
            <div className="relative mx-auto flex w-full max-w-[576px] items-center justify-center">
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                src="/images/hero-img-bg.webp"
                alt={t("home.hero.backgroundAlt")}
                className="absolute h-auto w-full max-w-[30rem]"
              />
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.3 }}
                src="/images/hero-img.webp"
                alt={t("home.hero.imageAlt")}
                className="relative z-10 h-auto w-full max-w-[30rem] drop-shadow-[4px_4px_4px_rgba(0,0,0,0.25)]"
              />
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.3 }}
                src="/icons/cap-icon.svg"
                alt={t("home.hero.capAlt")}
                className="absolute left-0 top-6 z-20 w-10 sm:-left-2 sm:top-10 sm:w-auto xl:-left-8 xl:top-12"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
