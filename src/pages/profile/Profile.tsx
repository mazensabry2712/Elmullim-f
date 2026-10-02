import { lazy } from "react";
import cookieService from "@/utils/cookieService";

const StudentProfile = lazy(
  () => import("@/components/profiles/student/StudentProfile")
);
const ParentProfile = lazy(
  () => import("@/components/profiles/parent/ParentProfile")
);

const Profile = () => {
  const role = cookieService.getRole()!;

  // Teacher profile is intentionally blank for now.
  if (role === "teacher") {
    return <div className="min-h-screen w-full bg-white" aria-hidden="true" />;
  }

  if (role === "parent") {
    return <ParentProfile />;
  }

  return <StudentProfile />;
};

export default Profile;
