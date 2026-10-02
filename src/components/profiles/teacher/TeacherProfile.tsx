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

const TeacherProfile = () => {
  const { state } = useLocation();
  const { language } = useI18n();
  const isArabic = language === "ar";

  const labels = isArabic
    ? {
        main: "الرئيسية",
        courses: "كورساتي",
        lessons: "دروسي",
        serviceAreas: "مناطق الخدمة",
        chat: "الدردشة",
        quizzes: "الاختبارات",
      }
    : {
        main: "Main",
        courses: "My Courses",
        lessons: "My Lessons",
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

  const triggerClass =
    "h-full min-h-14 rounded-none border-b-4 border-transparent !bg-[#21374B] px-2 py-3 text-sm font-semibold text-white shadow-none transition-colors hover:text-[#FBDC0F] data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none sm:text-base md:min-h-16";

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="container mb-10 px-0 sm:px-2"
    >
      <div className="mt-6 md:mt-10">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="!mx-auto grid h-auto w-full grid-cols-2 overflow-hidden rounded-lg bg-[#21374B] p-0 sm:grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="main-profile" className={triggerClass}>{labels.main}</TabsTrigger>
            <TabsTrigger value="courses" className={triggerClass}>{labels.courses}</TabsTrigger>
            <TabsTrigger value="lessons" className={triggerClass}>{labels.lessons}</TabsTrigger>
            <TabsTrigger value="service-areas" className={triggerClass}>{labels.serviceAreas}</TabsTrigger>
            <TabsTrigger value="chat" className={triggerClass}>{labels.chat}</TabsTrigger>
            <TabsTrigger value="quizzes" className={triggerClass}>{labels.quizzes}</TabsTrigger>
          </TabsList>

          <TabsContent value="main-profile" className="mt-0"><TeacherMainProfile /></TabsContent>
          <TabsContent value="courses" className="mt-0"><TeacherCourses /></TabsContent>
          <TabsContent value="lessons" className="mt-0"><TeacherLessons /></TabsContent>
          <TabsContent value="service-areas" className="mt-0"><TeacherServiceAreas /></TabsContent>
          <TabsContent value="chat" className="mt-0"><Chat /></TabsContent>
          <TabsContent value="quizzes" className="mt-0"><UploadQuiz /></TabsContent>
        </Tabs>
      </div>
    </motion.section>
  );
};

export default TeacherProfile;
