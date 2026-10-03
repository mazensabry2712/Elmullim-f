import { motion } from "framer-motion";
import CreateLesson from "@/components/profiles/teacher/lessons/CreateLesson";
import { useI18n } from "@/i18n";

const UploadLesson = () => {
  const { language } = useI18n();
  const copy = language === "ar"
    ? { title: "بناء درس", home: "الرئيسية" }
    : { title: "Build Lesson", home: "Home" };

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container text-center text-white space-y-4 md:space-y-6 pt-20 md:pt-32 pb-16 md:pb-24"
      >
        <h1 className="text-4xl font-bold leading-tight uppercase md:text-6xl md:leading-[74px]">{copy.title}</h1>
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
        <div className="container py-12 md:py-24 overflow-hidden">
          <CreateLesson />
        </div>
      </motion.section>
    </main>
  );
};

export default UploadLesson;
