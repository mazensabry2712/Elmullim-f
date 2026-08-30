import { containerVariants, itemVariants } from "@/animations";
import { motion } from "framer-motion";
import { ILesson } from "@/interfaces/courses/lessons";
import LessonCard from "./LessonCard";

interface IProps {
  lessons: ILesson[];
  customGridClass?: string;
}

const LessonList = ({ lessons,customGridClass }: IProps) => {
  return (
    <>
      {!lessons.length ? (
        <p className="font-medium fon-sora text-lg text-center text-[#4D5756] pt-5">
          No lessons found
        </p>
      ) : (
        <motion.div
          variants={containerVariants}
          viewport={{ once: true }}
          initial="hidden"
          whileInView="visible"
          className={customGridClass || "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-9"}
        >
          {lessons.map((lesson, idx) => (
            <motion.div variants={itemVariants} key={idx}>
              <LessonCard lesson={lesson} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
};

export default LessonList;
