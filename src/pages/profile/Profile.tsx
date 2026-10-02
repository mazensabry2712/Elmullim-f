import { lazy } from "react";
import cookieService from "@/utils/cookieService";

const StudentProfile = lazy(
  () => import("@/components/profiles/student/StudentProfile")
);
const ParentProfile = lazy(
  () => import("@/components/profiles/parent/ParentProfile")
);
const TeacherProfile = lazy(
  () => import("@/components/profiles/teacher/TeacherProfile")
);

const Profile = () => {
  const role = cookieService.getRole();

  if (role === "teacher") {
    return <TeacherProfile />;
  }

  if (role === "parent") {
    return <ParentProfile />;
  }

  return <StudentProfile />;
};

export default Profile;
