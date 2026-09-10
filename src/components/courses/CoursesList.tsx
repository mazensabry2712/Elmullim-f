import { containerVariants, itemVariants } from "@/animations";
import CourseCard from "./CourseCard";
import { motion } from "framer-motion";
import { ICourse } from "@/interfaces/courses/courses";
import type { CoursesCopy } from "@/pages/courses/courseCopy";

interface IProps {
  courses: ICourse[];
  copy: CoursesCopy;
}

const CoursesList = ({ courses, copy }: IProps) => {
  if (!courses.length) {
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
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-9"
    >
      {courses.map((course) => (
        <motion.div variants={itemVariants} key={course.id}>
          <CourseCard course={course} copy={copy} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CoursesList;
