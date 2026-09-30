import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  LogOut,
  MapPin,
  MessageCircleMore,
  Upload,
  User,
  UserPen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LogoutModal from "../LogoutModal";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";
import { useGetParentProfile } from "@/lib/react-query/parent/parentProfile";
import { useGetStudentProfile } from "@/lib/react-query/student/studentProfile";
import { useGetTeacherProfile } from "@/lib/react-query/teacher/teacherProfile";

const ProfileDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const navigate = useNavigate();
  const role = cookieService.getRole();
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const ar = language === "ar";

  const studentProfile = useGetStudentProfile(token, role === "student");
  const parentProfile = useGetParentProfile(token, role === "parent");
  const teacherProfile = useGetTeacherProfile(token, role === "teacher");

  const profile =
    role === "student"
      ? studentProfile.data?.data
      : role === "parent"
        ? parentProfile.data?.data
        : role === "teacher"
          ? teacherProfile.data?.data
          : undefined;

  const profileImage = profile?.profile_image?.trim() || undefined;
  const profileName =
    profile?.name?.trim() || (ar ? "الملف الشخصي" : "Profile");
  const fallbackLetter = profileName.charAt(0).toUpperCase();

  const text = {
    account: ar ? "حسابي" : "My Account",
    profile: ar ? "الملف الشخصي" : "Profile",
    edit: ar ? "تعديل الملف الشخصي" : "Edit Profile",
    courses: ar ? "كورساتي" : "My Courses",
    lessons: ar ? "دروسي" : "My Lessons",
    uploadCourses: ar ? "رفع الكورسات" : "Upload Courses",
    uploadLessons: ar ? "رفع الدروس" : "Upload Lessons",
    serviceAreas: ar ? "مناطق الخدمة" : "Service Areas",
    chat: ar ? "الدردشة" : "Chat",
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={ar ? "الملف الشخصي" : "Profile"}
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
        >
          <Avatar className="h-10 w-10 border border-black-blue/10">
            <AvatarImage
              src={profileImage}
              alt={profileName}
              className="object-cover"
            />
            <AvatarFallback className="bg-[#F2F2F2] text-black-blue text-sm font-bold">
              {fallbackLetter}
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>

      <PopoverContent className="max-w-fit min-w-52 p-2">
        <div className="space-y-1">
          <div className="px-2 py-1.5 text-sm font-semibold font-sora text-black-blue">
            {text.account}
          </div>
          <div className="border-b border-black-blue" />

          <div className="space-y-1 text-black-blue">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-sm font-sora font-medium transition-all duration-300 ease-in-out hover:bg-white-gray"
              onClick={() => {
                navigate("/profile");
                setIsOpen(false);
              }}
            >
              <User className="h-4 w-4" />
              {text.profile}
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-sm font-sora font-medium transition-all duration-300 ease-in-out hover:bg-white-gray"
              onClick={() => {
                navigate("/profile/update");
                setIsOpen(false);
              }}
            >
              <UserPen className="h-4 w-4" />
              {text.edit}
            </button>

            {role === "student" && (
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-sm font-sora font-medium transition-all duration-300 ease-in-out hover:bg-white-gray"
                onClick={() => {
                  navigate("/profile", { state: { myCourses: true } });
                  setIsOpen(false);
                }}
              >
                <BookOpen className="h-4 w-4" />
                {text.courses}
              </button>
            )}

            {role === "teacher" && (
              <>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-sm font-sora font-medium transition-all duration-300 ease-in-out hover:bg-white-gray"
                  onClick={() => {
                    navigate("/profile", { state: { myCourses: true } });
                    setIsOpen(false);
                  }}
                >
                  <BookOpen className="h-4 w-4" />
                  {text.courses}
                </button>

                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-sm font-sora font-medium transition-all duration-300 ease-in-out hover:bg-white-gray"
                  onClick={() => {
                    navigate("/profile", { state: { myLessons: true } });
                    setIsOpen(false);
                  }}
                >
                  <BookOpen className="h-4 w-4" />
                  {text.lessons}
                </button>

                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-sm font-sora font-medium transition-all duration-300 ease-in-out hover:bg-white-gray"
                  onClick={() => {
                    navigate("/profile/teacher/courses/upload");
                    setIsOpen(false);
                  }}
                >
                  <Upload className="h-4 w-4" />
                  {text.uploadCourses}
                </button>

                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-sm font-sora font-medium transition-all duration-300 ease-in-out hover:bg-white-gray"
                  onClick={() => {
                    navigate("/profile/teacher/lessons/upload");
                    setIsOpen(false);
                  }}
                >
                  <Upload className="h-4 w-4" />
                  {text.uploadLessons}
                </button>

                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-sm font-sora font-medium transition-all duration-300 ease-in-out hover:bg-white-gray"
                  onClick={() => {
                    navigate("/profile/teacher/service-areas");
                    setIsOpen(false);
                  }}
                >
                  <MapPin className="h-4 w-4" />
                  {text.serviceAreas}
                </button>
              </>
            )}

            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-sm font-sora font-medium transition-all duration-300 ease-in-out hover:bg-white-gray"
              onClick={() => {
                navigate("/profile", { state: { chat: true } });
                setIsOpen(false);
              }}
            >
              <MessageCircleMore className="h-4 w-4" />
              {text.chat}
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-sm font-sora font-medium transition-all duration-300 ease-in-out text-destructive hover:bg-white-gray"
              onClick={() => {
                setIsOpen(false);
                setIsLogoutOpen(true);
              }}
            >
              <LogOut className="h-4 w-4" />
              {language === "ar" ? "تسجيل الخروج" : "Logout"}
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>

    <LogoutModal
      open={isLogoutOpen}
      onOpenChange={setIsLogoutOpen}
      showTrigger={false}
    />
  );
};

export default ProfileDropdownMenu;
