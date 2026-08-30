import { containerVariants } from "@/animations";
import { ITeacher } from "@/interfaces/teachers/teacherProfile";
import { motion } from "framer-motion";
import { StarIcon } from "lucide-react";

interface IProps {
  instructor: ITeacher;
}

const InstructorDetails = ({ instructor }: IProps) => {
  return (
    <motion.div variants={containerVariants} className="my-10">
      <div className="flex flex-col lg:flex-row gap-x-8 gap-y-5 items-center">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[40%]"
        >
          <div className="max-h-[400px] lg:max-h-[600px] w-[80%] sm:w-[60%] mx-auto lg:w-full relative z-10 before:absolute before:w-full before:h-full before:-top-3 lg:before:-top-6 before:-left-3 lg:before:-left-6 before:bg-black-blue before:-z-10 before:rounded-lg before:shadow-lg">
            <div className="bg-slate-100 flex items-center justify-center rounded-lg">
              <img
                src={instructor?.profile_image || "/images/profile-avatar.webp"}
                alt="course"
                className="rounded-lg max-w-full object-cover max-h-[400px] lg:max-h-[600px] w-full h-full object-top"
              />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[60%] space-y-4"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-4xl text-black-blue text-center">
              Instructor Details
            </h3>
            <hr className="w-[20%] mx-auto h-2 bg-main rounded-lg" />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-3xl text-black-blue text-center lg:text-start capitalize">
              {instructor?.name}
            </h4>
            <h5 className="font-semibold text-2xl text-black-blue text-center lg:text-start">
              {instructor?.qualification}
            </h5>
            <div>
              <h6 className="flex items-center justify-center lg:justify-start gap-2 font-sora">
                <span className="flex items-center gap-0.5">
                  <StarIcon className="text-main fill-current" />
                  {instructor?.rating}
                </span>
                (Ratings)
              </h6>
            </div>
            <p className="leading-relaxed text-[#4D5756] font-sora !mt-6 text-center lg:text-start">
              {instructor?.description}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            <div className="py-4 px-5 shadow-[0px_4px_4px_0px_#00000040] space-y-2 rounded-lg flex flex-col items-center justify-center">
              <h3 className="font-bold text-xl text-main">
                {instructor?.courses_count}
              </h3>
              <h4 className="font-extrabold text-black-blue text-xl capitalize">
                Courses
              </h4>
            </div>
            <div className="py-4 px-5 shadow-[0px_4px_4px_0px_#00000040] space-y-2 rounded-lg flex flex-col items-center justify-center">
              <h3 className="font-bold text-xl text-main">
                {instructor?.lessons_count}
              </h3>
              <h4 className="font-extrabold text-black-blue text-xl capitalize">
                Lessons
              </h4>
            </div>
            <div className="py-4 px-5 shadow-[0px_4px_4px_0px_#00000040] space-y-2 rounded-lg flex flex-col items-center justify-center">
              <h3 className="font-bold text-xl text-main">
                {instructor?.experince || "0"}+
              </h3>
              <h4 className="font-extrabold text-black-blue text-xl capitalize">
                experience
              </h4>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InstructorDetails;
