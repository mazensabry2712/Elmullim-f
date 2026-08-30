import Loader from "@/components/Loader";
import { useGetParentProfile } from "@/lib/react-query/parent/parentProfile";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import ProfileHeader from "../ProfileHeader";

const ParentProfiles = () => {
  const token = cookieService.getToken()!;
  const { data: parent, isLoading } = useGetParentProfile(token);
  if (isLoading)
    return (
      <div className="container overflow-hidden">
        <div className="flex items-center justify-center py-20 my-20 overflow-hidden bg-white rounded-lg">
          <Loader />
        </div>
      </div>
    );
  const { name, description, profile_image, students } = parent?.data || {};
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="container"
    >
      <div className="pb-10 my-20 overflow-hidden bg-white rounded-lg">
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
          <div className="mb-8">
            <h2 className="text-4xl min-w-[314px] font-bold text-black-blue font-epilogue capitalize">
              {name}
            </h2>
            <p className="md:text-[20px] text-black-blue font-exo font-medium capitalize mb-2">
              parent account
            </p>
            <div>
              <p className="h-[46px] w-[133px] m-auto md:m-0 flex items-center justify-center text-[20px] capitalize text-main font-exo bg-[url('/icons/verification-code-circle.svg')] bg-contain bg-no-repeat bg-center">
                description:
              </p>
              <p className="text-[20px] max-w-[520px] m-auto md:m-0 text-black-blue font-exo font-medium mt-2 capitalize">
                {description || "Nothing"}
              </p>
            </div>
          </div>

          {/* Following Students */}
          <div>
            <h2 className="text-2xl md:text-[36px] font-sora text-black-blue capitalize my-4">
              following students:
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-4 md:flex-row md:flex-wrap"
            >
              {students &&
                students.map((student, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center justify-center py-5 rounded-[3px] w-[187px] bg-main`}
                  >
                    <img
                      src={
                        student.profile_image
                          ? student.profile_image
                          : "/images/profile-avatar.webp"
                      }
                      alt={student.name}
                      className="w-[120px] h-[120px] rounded-full border-1 border-white object-cover mb-10"
                    />
                    <p className="text-[20px] font-sora text-white text-center capitalize">
                      {student.name}
                    </p>
                  </div>
                ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ParentProfiles;
