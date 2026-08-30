import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BookOpen,
  MessageCircleMore,
  Upload,
  User,
  UserPen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "./ChangePasswordModal";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LogoutModal from "../LogoutModal";
import cookieService from "@/utils/cookieService";

const ProfileDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const role = cookieService.getRole();

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
          <div className="px-2 py-1.5 text-sm font-semibold font-sora text-black-blue">
            My Account
          </div>
          <div className="border-b border-black-blue" />
          <div className="text-black-blue space-y-1">
            <button
              className="flex items-center gap-2 hover:bg-white-gray w-full px-2 py-1.5 text-sm font-sora font-medium rounded-[5px] transition-all duration-300 ease-in-out"
              onClick={() => {
                navigate("/profile");
                setIsOpen(false);
              }}
            >
              <User className="h-4 w-4" /> Profile
            </button>
            <ChangePasswordModal />
            <button
              className="flex items-center gap-2 hover:bg-white-gray w-full px-2 py-1.5 text-sm font-sora font-medium rounded-[5px] transition-all duration-300 ease-in-out"
              onClick={() => {
                navigate("/profile/update");
                setIsOpen(false);
              }}
            >
              <UserPen className="h-4 w-4" /> Edit Profile
            </button>
            <button
              className="flex items-center gap-2 hover:bg-white-gray w-full px-2 py-1.5 text-sm font-sora font-medium rounded-[5px] transition-all duration-300 ease-in-out"
              onClick={() => {
                navigate("/profile", {
                  state: {
                    myCourses: true,
                  },
                });
                setIsOpen(false);
              }}
            >
              <BookOpen className="h-4 w-4" /> My Courses
            </button>
            <button
              className="flex items-center gap-2 hover:bg-white-gray w-full px-2 py-1.5 text-sm font-sora font-medium rounded-[5px] transition-all duration-300 ease-in-out"
              onClick={() => {
                navigate("/profile", { state: { myLessons: true } });
                setIsOpen(false);
              }}
            >
              <BookOpen className="h-4 w-4" /> My Lessons
            </button>
            {role === "teacher" && (
              <button
                className="flex items-center gap-2 hover:bg-white-gray w-full px-2 py-1.5 text-sm font-sora font-medium rounded-[5px] transition-all duration-300 ease-in-out"
                onClick={() => {
                  navigate("/profile/teacher/courses/upload");
                  setIsOpen(false);
                }}
              >
                <Upload className="h-4 w-4" /> Upload Courses
              </button>
            )}
            {role === "teacher" && (
              <button
                className="flex items-center gap-2 hover:bg-white-gray w-full px-2 py-1.5 text-sm font-sora font-medium rounded-[5px] transition-all duration-300 ease-in-out"
                onClick={() => {
                  navigate("/profile/teacher/lessons/upload");
                  setIsOpen(false);
                }}
              >
                <Upload className="h-4 w-4" /> Upload Lessons
              </button>
            )}
            <button
              className="flex items-center gap-2 hover:bg-white-gray w-full px-2 py-1.5 text-sm font-sora font-medium rounded-[5px] transition-all duration-300 ease-in-out"
              onClick={() => {
                navigate("/profile", {
                  state: {
                    chat: true,
                  },
                });
                setIsOpen(false);
              }}
            >
              <MessageCircleMore className="h-4 w-4" /> Chat
            </button>
            <LogoutModal />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileDropdownMenu;
