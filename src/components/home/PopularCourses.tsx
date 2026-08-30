import { motion } from "framer-motion";
import BadgeTitle from "@/components/ui/BadgeTitle";
import CoursesList from "../courses/CoursesList";
import { useGetCourses } from "@/lib/react-query/courses/courses";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import cookieService from "@/utils/cookieService";

const PopularCourses = () => {
  const token = cookieService.getToken();
  const { data: courses, isLoading } = useGetCourses({
    ...(token && { token }),
  });
  return (
    <div id="online-lessons" className="pt-20 pb-10 bg-[#F2F2F2]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center gap-4 items-center text-center"
        >
          <BadgeTitle title="Top Popular Course" />
          <h4 className="capitalize text-black-blue font-bold text-2xl md:text-3xl leading-relaxed">
            Buy these courses too and join <br /> many other students in these
            courses
          </h4>
        </motion.div>
        <div className="mt-10">
          {isLoading ? (
            <div className="py-10">
              <Loader size={40} className="animate-spin mx-auto" />
            </div>
          ) : (
            <CoursesList courses={courses?.data.slice(0, 6) || []} />
          )}
          <Link
            to={"/courses"}
            className="block w-fit mt-5 bg-main hover:bg-main/90 duration-200 rounded-lg mx-auto px-10 py-3 text-white"
          >
            All Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PopularCourses;
