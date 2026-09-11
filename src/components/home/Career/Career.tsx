import { containerVariants } from "@/animations";
import BadgeTitle from "@/components/ui/BadgeTitle";
import { motion } from "framer-motion";
import { CAREER_CONTENT } from "@/constant";
import CareerCard from "./CareerCard";
import { useI18n } from "@/i18n";

const CAREER_ROUTES = ["/sign-up", "/teacher/sign-up"] as const;

const Career = () => {
  const { t } = useI18n();

  return (
    <section
      id="career"
      aria-labelledby="career-title"
      className="bg-gradient-to-b from-[#F8F6F1] to-[#FFFFFF] py-16 sm:py-20"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-2 pt-6 sm:pt-10"
        >
          <BadgeTitle title={t("home.career.badge")} />
          <h2
            id="career-title"
            className="px-2 text-center text-3xl font-bold capitalize leading-tight text-black-blue sm:text-4xl md:text-left lg:text-[45px]"
          >
            {t("home.career.title")}
          </h2>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 grid grid-cols-1 gap-6 lg:mt-20 lg:grid-cols-2"
        >
          {CAREER_CONTENT.map((item, index) => (
            <CareerCard
              key={index}
              title={t(`home.career.items.${index}.title`)}
              description={t(`home.career.items.${index}.description`)}
              image={item.image}
              href={CAREER_ROUTES[index]}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Career;
