import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, MapPin, MessageCircleMore, Upload, User, UserPen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "./ChangePasswordModal";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import LogoutModal from "../LogoutModal";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";

const ProfileDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const role = cookieService.getRole();
  const { language } = useI18n();
  const ar = language === "ar";
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
    <Popover open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <PopoverTrigger>
        <Avatar>
          <AvatarFallback className="bg-[#F2F2F2] text-black-blue text-2xl flex justify-center items-center border border-muted">
            <i className="fi fi-sr-user text-black-blue text-2xl flex justify-center items-center" />
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="p-2 max-w-fit min-w-52">
        <div className="space-y-1">
          <div className="px-2 py-1.5 text-sm font-semibold font-sora text-black-blue">{text.account}</div>
          <div className="border-b border-black-blue" />
          <div className="text-black-blue space-y-1">
            <button className="flex items-center gap-2 hover:bg-white-gray w-full px-2 py-1.5 text-sm font-sora font-medium rounded-[5px] transition-all duration-300 ease-in-out" onClick={() => { navigate("/profile"); setIsOpen(false); }}>
              <User className="h-4 w-4" /> {text.profile}
            </button>
            <ChangePasswordModal />
            <button className="flex items-center gap-2 hover:bg-white-gray w-full px-2 py-1.5 text-sm font-sora font-medium rounded-[5px] transition-all duration-300 ease-in-out" onClick={() => { navigate("/profile/update"); setIsOpen(false); }}>
              <UserPen className="h-4 w-4" /> {text.edit}
            </button>
            <button className="flex items-center gap-2 hover:bg-white-gray w-full px-2 py-1.5 text-sm font-sora font-medium rounded-[5px] transition-all duration-300 ease-in-out" onClick={() => { navigate("/profile", { state: { myCourses: true } }); setIsOpen(false); }}>
              <BookOpen className="h-4 w-4" /> {text.courses}
            </button>
            <button className="flex items-center gap-2 hover:bg-white-gray w-full px-2 py-1.5 text-sm font-sora font-medium rounded-[5px] transition-all duration-300 ease-in-out" onClick={() => { navigate("/profile", { state: { myLessons: true } }); setIsOpen(false); }}>
              <BookOpen className="h-4 w-4" /> {text.lessons}
            </button>
            {role === "teacher" && (
              <button className="flex items-center gap-2 hover:bg-white-gray w-full px-2 py-1.5 text-sm font-sora font-medium rounded-[5px] transition-all duration-300 ease-in-out" onClick={() => { navigate("/profile/teacher/courses/upload"); setIsOpen(false); }}>
                <Upload className="h-4 w-4" /> {text.uploadCourses}
              </button>
            )}
            {role === "teacher" && (
              <button className="flex items-center gap-2 hover:bg-white-gray w-full px-2 py-1.5 text-sm font-sora font-medium rounded-[5px] transition-all duration-300 ease-in-out" onClick={() => { navigate("/profile/teacher/lessons/upload"); setIsOpen(false); }}>
                <Upload className="h-4 w-4" /> {text.uploadLessons}
              </button>
            )}
            {role === "teacher" && (
              <button className="flex items-center gap-2 hover:bg-white-gray w-full px-2 py-1.5 text-sm font-sora font-medium rounded-[5px] transition-all duration-300 ease-in-out" onClick={() => { navigate("/profile/teacher/service-areas"); setIsOpen(false); }}>
                <MapPin className="h-4 w-4" /> {text.serviceAreas}
              </button>
            )}
            <button className="flex items-center gap-2 hover:bg-white-gray w-full px-2 py-1.5 text-sm font-sora font-medium rounded-[5px] transition-all duration-300 ease-in-out" onClick={() => { navigate("/profile", { state: { chat: true } }); setIsOpen(false); }}>
              <MessageCircleMore className="h-4 w-4" /> {text.chat}
            </button>
            <LogoutModal />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileDropdownMenu;
