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
import Swal from "sweetalert2";
import useLogout from "@/hooks/useLogout";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";
import { useGetParentProfile } from "@/lib/react-query/parent/parentProfile";
import { useGetStudentProfile } from "@/lib/react-query/student/studentProfile";
import { useGetTeacherProfile } from "@/lib/react-query/teacher/teacherProfile";
import { getAuthCopy } from "@/i18n/authCopy";

const ProfileDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const role = cookieService.getRole();
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const ar = language === "ar";
  const copy = getAuthCopy(language);
  const { performLogout } = useLogout();

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
  const profileEmail = profile?.email?.trim() || "";
  const fallbackLetter = profileName.charAt(0).toUpperCase();

  const roleLabel =
    role === "student"
      ? ar
        ? "طالب"
        : "Student"
      : role === "parent"
        ? ar
          ? "ولي أمر"
          : "Parent"
        : role === "teacher"
          ? ar
            ? "معلم"
            : "Teacher"
          : "";

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
    logout: copy.logout,
    logoutHint: ar
      ? "إنهاء الجلسة الحالية"
      : "End your current session",
    logoutLocalFallback: ar
      ? "تم إنهاء الجلسة على هذا الجهاز، لكن تعذر تأكيد الإلغاء مع الخادم."
      : "Your session ended on this device, but the server could not be reached to confirm revocation.",
  };

  const handleLogout = async () => {
    const confirmation = await Swal.fire({
      title: copy.logoutConfirmation,
      text: copy.logoutQuestion,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: copy.logout,
      cancelButtonText: copy.cancel,
      reverseButtons: ar,
      focusCancel: true,
      allowOutsideClick: true,
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "!rounded-lg !px-5 !py-2.5",
        cancelButton: "!rounded-lg !px-5 !py-2.5",
      },
    });

    if (!confirmation.isConfirmed) return;

    const { response, error } = await performLogout();

    if (response?.status) {
      void Swal.fire({
        title: copy.success,
        text: response.message,
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "!rounded-lg !px-5 !py-2.5",
        },
      });
      return;
    }

    const fallbackText = response?.message || text.logoutLocalFallback;

    void Swal.fire({
      title: error ? copy.error : copy.success,
      text: fallbackText,
      icon: error ? "warning" : "error",
      confirmButtonText: "OK",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "!rounded-lg !px-5 !py-2.5",
      },
    });
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={ar ? "الملف الشخصي" : "Profile"}
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
          >
            <Avatar className="h-10 w-10 border border-black-blue/10 bg-white shadow-sm">
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

        <PopoverContent
          align={ar ? "start" : "end"}
          sideOffset={10}
          className="w-[min(320px,calc(100vw-24px))] rounded-2xl border border-black-blue/10 bg-white p-2.5 shadow-xl"
        >
          <div className="overflow-hidden rounded-xl">
            <div className="border-b border-black-blue/10 bg-white px-3 py-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 shrink-0 border border-black-blue/10">
                  <AvatarImage
                    src={profileImage}
                    alt={profileName}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-[#F2F2F2] text-black-blue text-sm font-bold">
                    {fallbackLetter}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1 text-start">
                  <p className="truncate font-sora text-sm font-bold text-black-blue">
                    {profileName}
                  </p>
                  {profileEmail && (
                    <p className="mt-0.5 truncate font-sora text-xs text-black-blue/55">
                      {profileEmail}
                    </p>
                  )}
                  {roleLabel && (
                    <span className="mt-1 inline-flex rounded-full bg-main/10 px-2 py-0.5 font-sora text-[10px] font-semibold text-black-blue">
                      {roleLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="px-1.5 py-2">
              <div className="px-2 pb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-black-blue/45">
                {text.account}
              </div>

              <div className="space-y-0.5">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-start font-sora text-sm font-medium text-black-blue transition-colors hover:bg-black-blue/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
                  onClick={() => {
                    navigate("/profile");
                    setIsOpen(false);
                  }}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black-blue/5">
                    <User className="h-4 w-4" />
                  </span>
                  {text.profile}
                </button>

                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-start font-sora text-sm font-medium text-black-blue transition-colors hover:bg-black-blue/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
                  onClick={() => {
                    navigate("/profile/update");
                    setIsOpen(false);
                  }}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black-blue/5">
                    <UserPen className="h-4 w-4" />
                  </span>
                  {text.edit}
                </button>

                {role === "student" && (
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-start font-sora text-sm font-medium text-black-blue transition-colors hover:bg-black-blue/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
                    onClick={() => {
                      navigate("/profile", { state: { myCourses: true } });
                      setIsOpen(false);
                    }}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black-blue/5">
                      <BookOpen className="h-4 w-4" />
                    </span>
                    {text.courses}
                  </button>
                )}

                {role === "teacher" && (
                  <>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-start font-sora text-sm font-medium text-black-blue transition-colors hover:bg-black-blue/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
                      onClick={() => {
                        navigate("/profile", { state: { myCourses: true } });
                        setIsOpen(false);
                      }}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black-blue/5">
                        <BookOpen className="h-4 w-4" />
                      </span>
                      {text.courses}
                    </button>

                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-start font-sora text-sm font-medium text-black-blue transition-colors hover:bg-black-blue/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
                      onClick={() => {
                        navigate("/profile", { state: { myLessons: true } });
                        setIsOpen(false);
                      }}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black-blue/5">
                        <BookOpen className="h-4 w-4" />
                      </span>
                      {text.lessons}
                    </button>

                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-start font-sora text-sm font-medium text-black-blue transition-colors hover:bg-black-blue/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
                      onClick={() => {
                        navigate("/profile/teacher/courses/upload");
                        setIsOpen(false);
                      }}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black-blue/5">
                        <Upload className="h-4 w-4" />
                      </span>
                      {text.uploadCourses}
                    </button>

                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-start font-sora text-sm font-medium text-black-blue transition-colors hover:bg-black-blue/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
                      onClick={() => {
                        navigate("/profile/teacher/lessons/upload");
                        setIsOpen(false);
                      }}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black-blue/5">
                        <Upload className="h-4 w-4" />
                      </span>
                      {text.uploadLessons}
                    </button>

                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-start font-sora text-sm font-medium text-black-blue transition-colors hover:bg-black-blue/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
                      onClick={() => {
                        navigate("/profile/teacher/service-areas");
                        setIsOpen(false);
                      }}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black-blue/5">
                        <MapPin className="h-4 w-4" />
                      </span>
                      {text.serviceAreas}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-start font-sora text-sm font-medium text-black-blue transition-colors hover:bg-black-blue/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
                  onClick={() => {
                    navigate("/profile", { state: { chat: true } });
                    setIsOpen(false);
                  }}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black-blue/5">
                    <MessageCircleMore className="h-4 w-4" />
                  </span>
                  {text.chat}
                </button>
              </div>
            </div>

            <div className="border-t border-black-blue/10 px-1.5 pt-1.5 pb-1">
              <button
                type="button"
                className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-start font-sora transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                onClick={() => {
                  setIsOpen(false);
                  window.setTimeout(() => {
                    void handleLogout();
                  }, 0);
                }}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors group-hover:bg-red-100">
                  <LogOut className="h-4 w-4" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-red-600">
                    {text.logout}
                  </span>
                  <span className="block truncate text-[11px] font-medium text-black-blue/45">
                    {text.logoutHint}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

    </>
  );
};

export default ProfileDropdownMenu;
