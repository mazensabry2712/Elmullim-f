import { motion } from "framer-motion";
import CreateCourse from "@/components/profiles/teacher/courses/CreateCourse";
import { useI18n } from "@/i18n";

const UploadCourse = () => {
  const { language } = useI18n();
  const copy =
    language === "ar"
      ? { title: "بناء كورس", home: "الرئيسية" }
      : { title: "Build Course", home: "Home" };

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container space-y-4 pb-16 pt-20 text-center text-white md:space-y-6 md:pb-24 md:pt-32"
      >
        <h1 className="text-4xl font-bold leading-tight uppercase md:text-6xl md:leading-[74px]">
          {copy.title}
        </h1>
        <p className="font-sora font-light leading-[30px]">
          {copy.home} <span className="text-main">//</span> {copy.title}
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
      >
        <div className="container overflow-hidden py-12 md:py-24">
          <CreateCourse />
        </div>
      </motion.section>
    </main>
  );
};

export default UploadCourse;
