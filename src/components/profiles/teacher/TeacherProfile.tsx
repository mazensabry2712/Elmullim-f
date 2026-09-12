import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";
import Chat from "@/components/chat/Chat";
import TeacherMainProfile from "./TeacherMainProfile";
import TeacherCourses from "./TeacherCourses";
import TeacherLessons from "./TeacherLessons";
import UploadQuiz from "@/pages/profile/teacher/UploadQuiz";
import { useI18n } from "@/i18n";

const TeacherProfile = () => {
  const { state } = useLocation();
  const { language } = useI18n();
  const text = language === "ar"
    ? { main: "الرئيسية", courses: "الكورسات", lessons: "الدروس", chat: "الدردشة", quizzes: "الاختبارات" }
    : { main: "Main", courses: "Courses", lessons: "Lessons", chat: "Chat", quizzes: "Quizzes" };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }} className="container mb-10">
      <div className="mt-10">
        <Tabs defaultValue={state?.myCourses ? "courses" : state?.myLessons ? "lessons" : state?.chat ? "chat" : "main-profile"} className="w-full">
          <TabsList className="!mx-auto w-full h-auto p-0 px-4 justify-center rounded-lg overflow-hidden bg-[#21374B]">
            <div className="max-w-2xl mx-auto space-x-4 sm:space-x-16">
              <TabsTrigger value="main-profile" className="rounded-none px-0 text-white font-semibold text-lg py-3 h-full data-[state=active]:shadow-none border-b-4 border-transparent data-[state=active]:text-[#FBDC0F] !bg-[#21374B] data-[state=active]:border-[#FBDC0F]">{text.main}</TabsTrigger>
              <TabsTrigger value="courses" className="rounded-none px-0 text-white font-semibold text-lg py-3 h-full data-[state=active]:shadow-none border-b-4 border-transparent data-[state=active]:text-[#FBDC0F] !bg-[#21374B] data-[state=active]:border-[#FBDC0F]">{text.courses}</TabsTrigger>
              <TabsTrigger value="lessons" className="rounded-none px-0 text-white font-semibold text-lg py-3 h-full data-[state=active]:shadow-none border-b-4 border-transparent data-[state=active]:text-[#FBDC0F] !bg-[#21374B] data-[state=active]:border-[#FBDC0F]">{text.lessons}</TabsTrigger>
              <TabsTrigger value="chat" className="rounded-none px-0 text-white font-semibold text-lg py-3 h-full data-[state=active]:shadow-none border-b-4 border-transparent data-[state=active]:text-[#FBDC0F] !bg-[#21374B] data-[state=active]:border-[#FBDC0F]">{text.chat}</TabsTrigger>
              <TabsTrigger value="quizzes" className="rounded-none px-0 text-white font-semibold text-lg py-3 h-full data-[state=active]:shadow-none border-b-4 border-transparent data-[state=active]:text-[#FBDC0F] !bg-[#21374B] data-[state=active]:border-[#FBDC0F]">{text.quizzes}</TabsTrigger>
            </div>
          </TabsList>
          <TabsContent value="main-profile"><TeacherMainProfile /></TabsContent>
          <TabsContent value="courses"><TeacherCourses /></TabsContent>
          <TabsContent value="lessons"><TeacherLessons /></TabsContent>
          <TabsContent value="chat"><Chat /></TabsContent>
          <TabsContent value="quizzes"><UploadQuiz /></TabsContent>
        </Tabs>
      </div>
    </motion.section>
  );
};

export default TeacherProfile;
