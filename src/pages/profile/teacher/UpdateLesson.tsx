import { motion } from "framer-motion";
import LessonUpdate from "@/components/profiles/teacher/lessons/UpdateLesson";
import { useI18n } from "@/i18n";

const UpdateLesson = () => {
  const { language } = useI18n();
  const copy = language === "ar"
    ? { title: "تعديل الدرس", home: "الرئيسية" }
    : { title: "Update Lesson", home: "Home" };

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container text-center text-white space-y-4 md:space-y-6 pt-20 md:pt-32 pb-16 md:pb-24"
      >
        <h1 className="uppercase text-4xl md:text-6xl font-bold leading-[74px]">{copy.title}</h1>
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
          <LessonUpdate />
        </div>
      </motion.section>
    </main>
  );
};

export default UpdateLesson;
