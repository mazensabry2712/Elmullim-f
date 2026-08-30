import { Loader } from "lucide-react";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { useGetTeacherLessons } from "@/lib/react-query/teacher/lessons";
import { containerVariants, itemVariants } from "@/animations";
import TeacherLessonCard from "./lessons/TeacherLessonCard";
import { Link } from "react-router-dom";

const TeacherLessons = () => {
  const token = cookieService.getToken()!;
  const { data: lessons, isLoading } = useGetTeacherLessons(token);

  return (
    <div className="pb-10 mt-4 overflow-hidden bg-white rounded-lg">
      <h2 className="font-sora font-bold text-center capitalize text-main text-2xl my-5">
        my lessons
      </h2>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
      >
        <div className="px-3 md:px-8">
          <Link
            to={"/profile/teacher/lessons/upload"}
            className="flex justify-center items-center bg-main text-white rounded-md py-3 px-6 w-full sm:w-fit ml-auto"
          >
            Add new lesson
          </Link>
        </div>
        <div className="py-12 md:py-16 px-3 md:px-8">
          {isLoading ? (
            <Loader size={40} className="animate-spin mx-auto" />
          ) : (
            <>
              {!lessons?.data.length ? (
                <p className="font-medium fon-sora text-lg text-center text-[#4D5756] pt-5">
                  No lessons found
                </p>
              ) : (
                <motion.div
                  variants={containerVariants}
                  viewport={{ once: true }}
                  initial="hidden"
                  whileInView="visible"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-9"
                >
                  {lessons.data.map((lesson, idx) => (
                    <motion.div variants={itemVariants} key={idx}>
                      <TeacherLessonCard lesson={lesson} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default TeacherLessons;
