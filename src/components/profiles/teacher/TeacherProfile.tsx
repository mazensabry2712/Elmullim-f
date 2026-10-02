import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeacherMainProfile from "./TeacherMainProfile";
import { useLocation } from "react-router-dom";
import TeacherCourses from "./TeacherCourses";
import TeacherLessons from "./TeacherLessons";
import Chat from "@/components/chat/Chat";
import { useI18n } from "@/i18n";

const TeacherProfile = () => {
  const { state } = useLocation();
  const { language } = useI18n();

  const text = language === "ar"
    ? { main: "الرئيسية", courses: "كورساتي", lessons: "دروسي", chat: "الدردشة" }
    : { main: "Main", courses: "My Courses", lessons: "My Lessons", chat: "Chat" };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="container mb-10"
    >
      <div className="mt-10">
        <Tabs
          defaultValue={
            state?.myCourses
              ? "courses"
              : state?.myLessons
                ? "lessons"
                : state?.chat
                  ? "chat"
                  : "main-profile"
          }
          className="w-full"
        >
          <TabsList className="!mx-auto w-full h-auto p-0 px-4 justify-center rounded-lg overflow-hidden bg-[#21374B]">
            <div className="max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 w-full">
              <TabsTrigger
                value="main-profile"
                className="h-full rounded-none border-b-4 border-transparent px-0 py-3 text-base font-semibold text-white data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none !bg-[#21374B] sm:text-lg"
              >
                {text.main}
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className="h-full rounded-none border-b-4 border-transparent px-0 py-3 text-base font-semibold text-white data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none !bg-[#21374B] sm:text-lg"
              >
                {text.courses}
              </TabsTrigger>
              <TabsTrigger
                value="lessons"
                className="h-full rounded-none border-b-4 border-transparent px-0 py-3 text-base font-semibold text-white data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none !bg-[#21374B] sm:text-lg"
              >
                {text.lessons}
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="h-full rounded-none border-b-4 border-transparent px-0 py-3 text-base font-semibold text-white data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none !bg-[#21374B] sm:text-lg"
              >
                {text.chat}
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="main-profile"><TeacherMainProfile /></TabsContent>
          <TabsContent value="courses"><TeacherCourses /></TabsContent>
          <TabsContent value="lessons"><TeacherLessons /></TabsContent>
          <TabsContent value="chat"><Chat /></TabsContent>
        </Tabs>
      </div>
    </motion.section>
  );
};

export default TeacherProfile;
