import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { lazy } from "react";
const UpdateStudentProfileForm = lazy(
  () => import("@/components/forms/profiles/UpdateStudentProfileForm")
);
const UpdateParentProfileForm = lazy(
  () => import("@/components/forms/profiles/UpdateParentProfileForm")
);
const UpdateTeacherProfileForm = lazy(
  () => import("@/components/forms/profiles/UpdateTeacherProfileForm")
);

const UpdateProfile = () => {
  const role = cookieService.getRole()!;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="bg-[#21374B]"
    >
      <div className="mt-4 bg-[#FCFCFC]">
        <div className="container py-24 md:py-36">
          <div className="bg-[#F0F0F0] px-4 md:px-10 lg:px-20 py-6 shadow-md rounded-lg">
            <h2 className="border-b border-main text-center text-main uppercase font-semibold text-3xl md:text-6xl">
              Update Info
            </h2>
            {role === "teacher" ? (
              <UpdateTeacherProfileForm />
            ) : role === "parent" ? (
              <UpdateParentProfileForm />
            ) : (
              <UpdateStudentProfileForm />
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default UpdateProfile;
