import { Loader } from "lucide-react";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import CoursesList from "@/components/courses/CoursesList";
import { useGetStudentCourses } from "@/lib/react-query/student/studentProfile";

const StudentCourses = () => {
  const token = cookieService.getToken()!;
  const { data: courses, isLoading } = useGetStudentCourses(token);

  return (
    <div className="pb-10 mt-4 overflow-hidden bg-white rounded-lg">
      <h2 className="font-sora font-bold text-center capitalize text-main text-2xl mt-5">
        my courses
      </h2>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
      >
        <div className="py-12 md:py-16  px-3 md:px-8">
          {isLoading ? (
            <Loader size={40} className="animate-spin mx-auto" />
          ) : (
            <CoursesList courses={courses?.data || []} />
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default StudentCourses;
