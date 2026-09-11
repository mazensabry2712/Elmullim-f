import { containerVariants, itemVariants } from "@/animations";
import { motion } from "framer-motion";
import { TEACHERS } from "@/constant";
import { useI18n } from "@/i18n";
import TeacherCard from "./TeacherCard";

const OurTeachers = () => {
  const { t } = useI18n();

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

        <motion.div
          className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4"
          variants={containerVariants}
        >
          {TEACHERS.map((teacher) => (
            <TeacherCard teacher={teacher} key={teacher.id} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default OurTeachers;
