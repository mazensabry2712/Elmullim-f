import { motion } from "framer-motion";
import BadgeTitle from "@/components/ui/BadgeTitle";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import cookieService from "@/utils/cookieService";
import { useGetLessons } from "@/lib/react-query/lessons/lessons";
import LessonList from "../lessons/LessonsList";

const PopularLessons = () => {
  const token = cookieService.getToken();
  const { data: lessons, isLoading } = useGetLessons({
    ...(token && { token }),
  });
  return (
    <div id="online-lessons" className=" pb-10 bg-[#F2F2F2]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center gap-4 items-center text-center"
        >
          <BadgeTitle title="Top Popular Lessons" />
          <h4 className="capitalize text-black-blue font-bold text-2xl md:text-3xl leading-relaxed">
            Buy these lessons too and join <br /> many other students in these
            lessons
          </h4>
        </motion.div>
        <div className="mt-10">
          {isLoading ? (
            <div className="py-10">
              <Loader size={40} className="animate-spin mx-auto" />
            </div>
          ) : (
            <LessonList lessons={lessons?.data.slice(0, 6) || []} />
          )}
          <Link
            to={"/lessons"}
            className="block w-fit mt-5 bg-main hover:bg-main/90 duration-200 rounded-lg mx-auto px-10 py-3 text-white"
          >
            All Lessons
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PopularLessons;
