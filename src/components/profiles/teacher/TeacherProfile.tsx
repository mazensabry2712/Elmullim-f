import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";
import Chat from "@/components/chat/Chat";
import TeacherMainProfile from "./TeacherMainProfile";
import TeacherCourses from "./TeacherCourses";
import TeacherLessons from "./TeacherLessons";
import TeacherServiceAreas from "./TeacherServiceAreas";
import UploadQuiz from "@/pages/profile/teacher/UploadQuiz";
import { useI18n } from "@/i18n";
import {
  BookOpen,
  ClipboardCheck,
  LayoutDashboard,
  MapPinned,
  MessageCircle,
  Video,
} from "lucide-react";

const TeacherProfile = () => {
  const { state } = useLocation();
  const { language } = useI18n();
  const isArabic = language === "ar";

  const text = isArabic
    ? {
        title: "مساحة المعلم",
        subtitle: "إدارة ملفك ودروسك وكورساتك من مكان واحد.",
        main: "الرئيسية",
        courses: "الكورسات",
        lessons: "الدروس",
        serviceAreas: "مناطق الخدمة",
        chat: "الدردشة",
        quizzes: "الاختبارات",
      }
    : {
        title: "Teacher workspace",
        subtitle: "Manage your profile, lessons and courses in one place.",
        main: "Overview",
        courses: "Courses",
        lessons: "Lessons",
        serviceAreas: "Service Areas",
        chat: "Chat",
        quizzes: "Quizzes",
      };

  const defaultTab = state?.myCourses
    ? "courses"
    : state?.myLessons
      ? "lessons"
      : state?.serviceAreas
        ? "service-areas"
        : state?.chat
          ? "chat"
          : "main-profile";

  const tabs = [
    { value: "main-profile", label: text.main, icon: LayoutDashboard },
    { value: "courses", label: text.courses, icon: BookOpen },
    { value: "lessons", label: text.lessons, icon: Video },
    { value: "service-areas", label: text.serviceAreas, icon: MapPinned },
    { value: "chat", label: text.chat, icon: MessageCircle },
    { value: "quizzes", label: text.quizzes, icon: ClipboardCheck },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="container mb-12 px-3 sm:px-4 lg:px-0"
    >
      <div className="mb-5 mt-6 md:mb-7 md:mt-8">
        <div className="rounded-3xl border border-black-blue/[0.06] bg-white px-5 py-5 shadow-[0_18px_55px_rgba(33,55,75,0.06)] md:px-7 md:py-6">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-main">
              ELMULLIM
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight text-black-blue md:text-3xl">
              {text.title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-black-blue/55 md:text-base">
              {text.subtitle}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-3xl border border-black-blue/[0.07] bg-white p-2 shadow-[0_16px_45px_rgba(33,55,75,0.05)] sm:grid-cols-3 lg:grid-cols-6">
          {tabs.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="group min-w-0 rounded-2xl border border-transparent px-2.5 py-3.5 text-xs font-bold text-black-blue/65 transition-all duration-200 hover:bg-main/[0.05] hover:text-black-blue data-[state=active]:border-main/15 data-[state=active]:bg-main data-[state=active]:text-white data-[state=active]:shadow-[0_8px_22px_rgba(10,185,157,0.22)] sm:px-3 sm:text-sm"
            >
              <span className="flex min-w-0 items-center justify-center gap-2">
                <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=active]:scale-105" />
                <span className="truncate">{label}</span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-4 md:mt-5">
          <TabsContent value="main-profile" className="mt-0 focus-visible:outline-none">
            <TeacherMainProfile />
          </TabsContent>
          <TabsContent value="courses" className="mt-0 focus-visible:outline-none">
            <TeacherCourses />
          </TabsContent>
          <TabsContent value="lessons" className="mt-0 focus-visible:outline-none">
            <TeacherLessons />
          </TabsContent>
          <TabsContent value="service-areas" className="mt-0 focus-visible:outline-none">
            <TeacherServiceAreas />
          </TabsContent>
          <TabsContent value="chat" className="mt-0 focus-visible:outline-none">
            <Chat />
          </TabsContent>
          <TabsContent value="quizzes" className="mt-0 focus-visible:outline-none">
            <UploadQuiz />
          </TabsContent>
        </div>
      </Tabs>
    </motion.section>
  );
};

export default TeacherProfile;
