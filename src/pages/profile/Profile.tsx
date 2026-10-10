import { lazy } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
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
  // Prefer the role validated by /check-auth. RootLayout dispatches
  // syncSession() after the server confirms the current token's role.
  // Subscribing here ensures the profile switches if that role changes
  // after the initial render instead of staying on the student tabs.
  const stateRole = useSelector((state: RootState) => state.auth.role);
  const role = stateRole ?? cookieService.getRole();

  if (role === "teacher") {
    return <TeacherProfile />;
  }

  if (role === "parent") {
    return <ParentProfile />;
  }

  return <StudentProfile />;
};

export default Profile;
