import Loader from "@/components/Loader";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";

import {
  useGetTeacherProfile,
  useGetTeacherRatings,
} from "@/lib/react-query/teacher/teacherProfile";
import StudentRating from "../student/StudentRating";

const TeacherMainProfile = () => {
  const token = cookieService.getToken()!;
  const { data: teacher, isLoading } = useGetTeacherProfile(token);
  const {
    name,
    profile_image,
    email,
    phone,
    address,
    description,
    qualification,
    experince,
    subjects,
  } = teacher?.data || {};

  const { data: ratings } = useGetTeacherRatings(token);

  // Group subjects by education level
  const groupedSubjects =
    subjects?.reduce((acc: any, subject: any) => {
      const levelName = subject.education_level?.name || "Unknown Level";
      if (!acc[levelName]) {
        acc[levelName] = [];
      }
      acc[levelName].push(subject);
      return acc;
    }, {}) || {};

  if (isLoading)
    return (
      <div className="container overflow-hidden">
        <div className="flex items-center justify-center py-20 my-20 overflow-hidden bg-white rounded-lg">
          <Loader />
        </div>
      </div>
    );

  return (
    <div className="pb-10 mt-4 overflow-hidden bg-white rounded-lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
        className="px-2 text-center md:px-20 md:text-left"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-4 mt-5 lg:mt-20">
          <div className="bg-white flex flex-col items-center lg:items-start shadow-md p-2 rounded-md">
            <div className="lg:aspect-square">
              <img
                src={
                  profile_image ? profile_image : "/images/profile-avatar.webp"
                }
                className="w-full h-full object-contain bg-white rounded-lg"
                alt="profile"
              />
            </div>
            <div className="space-y-2">
              <h2 className="font-epilogue text-center lg:text-start text-xl font-black text-black-blue capitalize my-5">
                {name}
              </h2>
              <p className="font-sora text-md text-black-blue">
                Email: <span className="text-[#666666] text-sm">{email}</span>
              </p>
              <p className="font-sora text-md text-black-blue">
                Phone Number:{" "}
                <span className="text-[#666666] text-sm">{phone}</span>
              </p>

              <p className="font-sora text-md text-black-blue">
                Address:{" "}
                <span className="text-[#666666] text-sm">
                  {address || "Not found"}
                </span>
              </p>
            </div>
            <div className="space-y-2 w-full">
              <h3 className="capitalize w-full font-black text-[#194D80] text-lg font-epilogue mt-10 text-center">
                about me
              </h3>
              <p className="w-full font-epilogue text-[#666666] text-sm leading-relaxed p-4 text-center">
                {description || "Not found"}
              </p>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white shadow-md rounded-lg p-2 flex flex-col items-center lg:items-start justify-between lg:flex-row gap-10 lg:gap-4 mb-10">
              <div className="order-2 lg:order-1 justify-items-center lg:justify-items-start">
                <h3 className=" capitalize font-black text-[#194D80] text-xl font-epilogue mb-3">
                  qualifications
                </h3>
                <p className="font-epilogue text-[#194D80]  text-sm mb-3 font-medium text-center lg:text-left ">
                  {qualification || (
                    <span className="text-muted font-normal">Not found</span>
                  )}
                </p>
              </div>
              <div className="md:w-52 lg:w-64  items-center me-2 order-1 lg:order-2">
                <img
                  src="/images/image 33.png"
                  alt=""
                  className="object-cover w-full"
                />
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg flex flex-col lg:flex-row p-2 gap-4">
              <div className="flex-1">
                <div className="flex flex-col items-center">
                  <h3 className="capitalize font-black text-[#194D80] text-xl font-epilogue mb-3">
                    Experience
                  </h3>
                  <p className="font-epilogue text-[#194D80]  text-sm mb-3 font-medium text-center lg:text-left ">
                    {experince ? (
                      `${experince} years of experience`
                    ) : (
                      <span className="text-muted font-normal">Not found</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <div className="grid justify-items-center gap-4">
                  <h3 className="bg-[#F0FEFC] text-[#194D80] shadow-md rounded-md border text-xl border-[#194D80] font-bold font-sora py-3 px-12 inline-block my-5">
                    CV
                  </h3>
                  <img
                    src="/images/pdf.png"
                    className="w-24 h-24"
                    alt="my-cv"
                  />
                  <div className="flex items-center justify-center gap-2 border border-[#08917B] rounded-md shadow-md px-2 min-w-64">
                    <img
                      src="/images/pdf.png"
                      className="w-16 h-16"
                      alt="my-cv"
                    />
                    <span className="capitalize font-sora text-xs text-[#194D80]">
                      {name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Dynamic Subjects Section */}
        <div className="my-10">
          <div className="flex justify-center lg:justify-start">
            <h3 className="bg-white text-[#194D80] shadow-md rounded-md border text-xl border-[#194D80] font-bold font-sora px-7 py-3 inline-block my-5">
              My Subjects
            </h3>
          </div>

          {subjects && subjects.length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedSubjects).map(
                ([levelName, levelSubjects]: [string, any]) => (
                  <div
                    key={levelName}
                    className="flex flex-col items-center lg:items-start"
                  >
                    <h2 className="capitalize font-bold text-xl md:text-2xl text-main mb-4">
                      {levelName}
                    </h2>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                      {levelSubjects.map(
                        (subject: { name: string }, idx: number) => (
                          <div className="flex justify-center" key={idx}>
                            <h3 className="bg-[#F0FEFC] text-[#194D80] shadow-md rounded-md border text-lg border-[#194D80] font-bold font-sora px-3 py-5 inline-block">
                              {subject.name}
                            </h3>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-muted">No subjects found</p>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-[36px] mt-10 mb-3 font-sora text-black-blue capitalize">
            students ratings:
          </h2>
          <div className="grid">
            <div className="space-y-3  overflow-y-auto shadow-xl">
              {!ratings?.data.length ? (
                <p className="text-lg text-muted text-center px-4 py-8">
                  No ratings yet
                </p>
              ) : (
                ratings?.data.map((rate, index) => (
                  <StudentRating key={index} rate={rate} />
                ))
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TeacherMainProfile;
