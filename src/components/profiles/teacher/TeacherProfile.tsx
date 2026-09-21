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
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }} className="container mb-10">
      <div className="mt-10">
        <Tabs defaultValue={state?.myCourses ? "courses" : state?.myLessons ? "lessons" : state?.serviceAreas ? "service-areas" : state?.chat ? "chat" : "main-profile"} className="w-full">
          <TabsList className="!mx-auto h-auto w-full justify-center overflow-hidden rounded-lg bg-[#21374B] p-0 px-4">
            <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-4 sm:gap-x-10">
              <TabsTrigger value="main-profile" className="h-full rounded-none border-b-4 border-transparent px-0 py-3 text-lg font-semibold text-white data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none !bg-[#21374B]">{text.main}</TabsTrigger>
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
