import { containerVariants, itemVariants } from "@/animations";
import { motion } from "framer-motion";
import { ILesson } from "@/interfaces/lessons/lesson";
import type { LessonsCopy } from "@/pages/lessons/lessonCopy";
import { getLessonsCopy } from "@/pages/lessons/lessonCopy";
import { useI18n } from "@/i18n";
import LessonCard from "./LessonCard";

interface IProps {
  lessons: ILesson[];
  copy?: LessonsCopy;
  customGridClass?: string;
}

const LessonsList = ({ lessons, copy: providedCopy, customGridClass }: IProps) => {
  const { language } = useI18n();
  const copy = providedCopy ?? getLessonsCopy(language);

  if (!lessons.length) {
    return (
      <p className="font-medium font-sora text-lg text-center text-[#4D5756] pt-5" role="status">
        {copy.empty}
      </p>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      viewport={{ once: true }}
      initial="hidden"
      whileInView="visible"
      className={customGridClass || "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-9"}
    >
      {lessons.map((lesson) => (
        <motion.div variants={itemVariants} key={lesson.id}>
          <LessonCard lesson={lesson} copy={copy} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default LessonsList;
