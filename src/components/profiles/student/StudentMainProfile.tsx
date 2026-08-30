import Loader from "@/components/Loader";
import {
  useGetStudentProfile,
  useGetStudentRatings,
} from "@/lib/react-query/student/studentProfile";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import ProfileHeader from "../ProfileHeader";
import StudentRating from "./StudentRating";

const StudentMainProfile = () => {
  const token = cookieService.getToken()!;
  const { data: student, isLoading } = useGetStudentProfile(token);

  const { data: ratings } = useGetStudentRatings(token);

  if (isLoading)
    return (
      <div className="container overflow-hidden">
        <div className="flex items-center justify-center py-20 my-20 overflow-hidden bg-white rounded-lg">
          <Loader />
        </div>
      </div>
    );

  const {
    name,
    description,
    education_level,
    favourite_subjects,
    profile_image,
    email,
  } = student?.data || {};
  return (
    <div className="pb-10 mt-4 overflow-hidden bg-white rounded-lg">
      {/* profile header */}
      <ProfileHeader profileImage={profile_image!} />
      {/* profile content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
        className="px-2 text-center md:px-20 md:text-left"
      >
        <div className="grid lg:grid-cols-[70%__minmax(0,1fr)] ">
          <div className="mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-black-blue font-epilogue capitalize">
              {name}
            </h2>
            <p className="h-[46px] py-10 w-[145px] m-auto md:m-0 flex items-center justify-start ps-5 text-[20px] capitalize text-main font-exo bg-[url('/icons/verification-code-circle.svg')] bg-contain bg-no-repeat bg-center">
              about:
            </p>
            <p className="md:text-lg text-black-blue font-exo font-medium capitalize mb-2">
              {education_level?.name}
            </p>
            <p className="md:text-lg text-[#666666] font-sora font-[300px] mb-2">
              <span className="uppercase font-medium font-sora text-black-blue">
                email :
              </span>{" "}
              {email}
            </p>
            <div>
              <p className="h-[46px] py-10 w-[155px] m-auto md:m-0 flex items-center justify-center font-medium text-[20px] capitalize text-main font-exo bg-[url('/icons/verification-code-circle.svg')] bg-contain bg-no-repeat bg-center">
                description:
              </p>
              <p className="text-lg max-w-[520px] m-auto md:m-0 text-black-blue font-exo font-medium mt-2 capitalize">
                {description || "Nothing"}
              </p>
            </div>
          </div>
          {/* Favorites subjects: */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-lg lg:-me-24 lg:text-center md:text-[24px] font-sora text-black font-bold capitalize mb-8">
              Favorite subjects
            </h2>
            <div className="flex lg:-me-24 justify-center lg:flex-col  flex-wrap gap-6 lg:gap-y-8  items-center">
              {favourite_subjects?.map((subject) => (
                <div className="font-medium w-[260px] py-3.5 flex items-center justify-center border-[1px] border-main rounded-[10px]">
                  {subject.name}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl md:text-2xl mt-10 mb-3 font-sora text-black-blue capitalize">
            teacher ratings:
          </h2>
          <div className="grid lg:grid-cols-[70%__minmax(0,1fr)] gap-3 ">
            <div className="space-y-3 overflow-y-auto h-[480px] shadow-xl">
              {!ratings?.data.length ? (
                <p className="text-lg text-muted-foreground">No ratings yet</p>
              ) : (
                ratings?.data.map((rate, index) => (
                  <StudentRating key={index} rate={rate} />
                ))
              )}
            </div>
            {/* Personal data: */}
            <div className=" lg:-me-24 relative ">
              <h2 className="text-lg lg:-mt-10 mb-10 mt-10 text-center md:text-[24px] font-sora text-[#194D80] font-bold capitalize my-4">
                Personal data
              </h2>
              <p className="md:text-[16px] flex flex-col gap-y-1 items-center justify-center text-center text-[#194D80] font-sora font-[400px] capitalize mb-2">
                <span className="uppercase font-bold text-[14px] font-sora text-[#194D80]">
                  Education Level :
                </span>{" "}
                {education_level?.name}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StudentMainProfile;
