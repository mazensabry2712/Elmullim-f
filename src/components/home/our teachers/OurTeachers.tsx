import { containerVariants, itemVariants } from "@/animations";
import { motion } from "framer-motion";
import { TEACHERS } from "@/constant";
import TeacherCard from "./TeacherCard";

const OurTeachers = () => {
  return (
    <section className="bg-main pt-20 pb-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container"
      >
        <motion.div variants={itemVariants}>
          <h3 className="capitalize text-6xl font-sora font-semibold text-white text-center">
            our teachers
          </h3>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10"
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
