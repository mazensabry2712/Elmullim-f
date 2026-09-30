import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentMainProfile from "./StudentMainProfile";
import { useLocation } from "react-router-dom";
import StudentCourses from "./StudentCourses";
import Chat from "@/components/chat/Chat";
import QuizSchedules from "./quizes/QuizSchedules";
import { useI18n } from "@/i18n";

const StudentProfile = () => {
  const { state } = useLocation();
  const { language } = useI18n();

  const text = language === "ar"
    ? { main: "الرئيسية", courses: "كورساتي", chat: "الدردشة", quizzes: "الاختبارات" }
    : { main: "Main", courses: "My Courses", chat: "Chat", quizzes: "Quizzes" };

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
              : state?.chat
                ? "chat"
                : state?.quiz
                  ? "quiz"
                  : "main-profile"
          }
          className="w-full"
        >
          <TabsList className="!mx-auto w-full h-auto p-0 px-4 justify-center rounded-lg overflow-hidden bg-[#21374B]">
            <div className="max-w-2xl mx-auto space-x-4 sm:space-x-16">
              <TabsTrigger
                value="main-profile"
                className="h-full rounded-none border-b-4 border-transparent px-0 py-3 text-lg font-semibold text-white data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none !bg-[#21374B]"
              >
                {text.main}
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className="h-full rounded-none border-b-4 border-transparent px-0 py-3 text-lg font-semibold text-white data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none !bg-[#21374B]"
              >
                {text.courses}
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="h-full rounded-none border-b-4 border-transparent px-0 py-3 text-lg font-semibold text-white data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none !bg-[#21374B]"
              >
                {text.chat}
              </TabsTrigger>
              <TabsTrigger
                value="quiz"
                className="h-full rounded-none border-b-4 border-transparent px-0 py-3 text-lg font-semibold text-white data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none !bg-[#21374B]"
              >
                {text.quizzes}
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="main-profile"><StudentMainProfile /></TabsContent>
          <TabsContent value="courses"><StudentCourses /></TabsContent>
          <TabsContent value="chat"><Chat /></TabsContent>
          <TabsContent value="quiz"><QuizSchedules /></TabsContent>
        </Tabs>
      </div>
    </motion.section>
  );
};

export default StudentProfile;
