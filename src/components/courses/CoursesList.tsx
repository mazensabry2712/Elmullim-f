import { containerVariants, itemVariants } from "@/animations";
import CourseCard from "./CourseCard";
import { motion } from "framer-motion";
import { ICourse } from "@/interfaces/courses/courses";

interface IProps {
  courses: ICourse[];
}

const CoursesList = ({ courses }: IProps) => {
  return (
    <>
      {!courses.length ? (
        <p className="font-medium fon-sora text-lg text-center text-[#4D5756] pt-5">
          No courses found
        </p>
      ) : (
        <motion.div
          variants={containerVariants}
          viewport={{ once: true }}
          initial="hidden"
          whileInView="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-9"
        >
          {courses.map((course, idx) => (
            <motion.div variants={itemVariants} key={idx}>
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
};

export default CoursesList;
