import { containerVariants, itemVariants } from "@/animations";
import { motion } from "framer-motion";
import { ILesson } from "@/interfaces/courses/lessons";
import type { LessonsCopy } from "@/pages/lessons/lessonCopy";
import LessonCard from "./LessonCard";

interface IProps {
  lessons: ILesson[];
  copy?: LessonsCopy;
  customGridClass?: string;
}

const LessonsList = ({ lessons, copy, customGridClass }: IProps) => {
  if (!lessons.length) {
    return (
      <p className="font-medium font-sora text-lg text-center text-[#4D5756] pt-5" role="status">
        {copy?.empty ?? "No lessons found"}
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
