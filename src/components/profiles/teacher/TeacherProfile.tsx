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
  const text = language === "ar"
    ? { main: "الرئيسية", courses: "الكورسات", lessons: "الدروس", serviceAreas: "مناطق الخدمة", chat: "الدردشة", quizzes: "الاختبارات" }
    : { main: "Main", courses: "Courses", lessons: "Lessons", serviceAreas: "Service Areas", chat: "Chat", quizzes: "Quizzes" };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} viewport={{ once: true }} className="container mb-10">
      <div className="mt-10">
        <Tabs defaultValue={state?.myCourses ? "courses" : state?.myLessons ? "lessons" : state?.serviceAreas ? "service-areas" : state?.chat ? "chat" : "main-profile"} className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1.5 overflow-hidden rounded-2xl bg-[#21374B] p-1.5 sm:grid-cols-3 lg:flex lg:justify-center">
            <div className="contents lg:flex lg:items-center lg:justify-center">
              <TabsTrigger value="main-profile" className="min-w-0 rounded-xl border-0 px-2.5 py-3 text-xs font-bold text-white transition-all data-[state=active]:bg-white data-[state=active]:text-[#21374B] data-[state=active]:shadow-sm sm:px-4 sm:text-sm lg:min-w-[125px] lg:px-5">{text.main}</TabsTrigger>
              <TabsTrigger value="courses" className="h-full rounded-none border-b-4 border-transparent px-0 py-3 text-lg font-semibold text-white data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none !bg-[#21374B]">{text.courses}</TabsTrigger>
              <TabsTrigger value="lessons" className="h-full rounded-none border-b-4 border-transparent px-0 py-3 text-lg font-semibold text-white data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none !bg-[#21374B]">{text.lessons}</TabsTrigger>
              <TabsTrigger value="service-areas" className="h-full rounded-none border-b-4 border-transparent px-0 py-3 text-lg font-semibold text-white data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none !bg-[#21374B]">{text.serviceAreas}</TabsTrigger>
              <TabsTrigger value="chat" className="h-full rounded-none border-b-4 border-transparent px-0 py-3 text-lg font-semibold text-white data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none !bg-[#21374B]">{text.chat}</TabsTrigger>
              <TabsTrigger value="quizzes" className="h-full rounded-none border-b-4 border-transparent px-0 py-3 text-lg font-semibold text-white data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none !bg-[#21374B]">{text.quizzes}</TabsTrigger>
            </div>
          </TabsList>
          <TabsContent value="main-profile"><TeacherMainProfile /></TabsContent>
          <TabsContent value="courses"><TeacherCourses /></TabsContent>
          <TabsContent value="lessons"><TeacherLessons /></TabsContent>
          <TabsContent value="service-areas"><TeacherServiceAreas /></TabsContent>
          <TabsContent value="chat"><Chat /></TabsContent>
          <TabsContent value="quizzes"><UploadQuiz /></TabsContent>
        </Tabs>
      </div>
    </motion.section>
  );
};

export default TeacherProfile;
