import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentMainProfile from "./StudentMainProfile";
import { useLocation } from "react-router-dom";
import StudentCourses from "./StudentCourses";
import StudentLessons from "./StudentLessons";
import Chat from "@/components/chat/Chat";
import QuizSchedules from "./quizes/QuizSchedules";

const StudentProfile = () => {
  const { state } = useLocation();

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
          <TabsList className="!mx-auto w-full h-auto p-0 px-4 justify-center  rounded-lg overflow-hidden bg-[#21374B]">
            <div className="max-w-2xl mx-auto space-x-4 sm:space-x-16">
              <TabsTrigger
                value="main-profile"
                className="rounded-none px-0 text-white font-semibold text-lg py-3 h-full data-[state=active]:shadow-none border-b-4 border-transparent data-[state=active]:text-[#FBDC0F] !bg-[#21374B] data-[state=active]:border-[#FBDC0F]"
              >
                Main
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className="rounded-none px-0 text-white font-semibold text-lg py-3 h-full data-[state=active]:shadow-none border-b-4 border-transparent data-[state=active]:text-[#FBDC0F] !bg-[#21374B] data-[state=active]:border-[#FBDC0F]"
              >
                My Courses
              </TabsTrigger>
              <TabsTrigger
                value="lessons"
                className="rounded-none px-0 text-white font-semibold text-lg py-3 h-full data-[state=active]:shadow-none border-b-4 border-transparent data-[state=active]:text-[#FBDC0F] !bg-[#21374B] data-[state=active]:border-[#FBDC0F]"
              >
                My Lessons
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="rounded-none px-0 text-white font-semibold text-lg py-3 h-full data-[state=active]:shadow-none border-b-4 border-transparent data-[state=active]:text-[#FBDC0F] !bg-[#21374B] data-[state=active]:border-[#FBDC0F]"
              >
                Chat
              </TabsTrigger>
              <TabsTrigger value="quiz" className="rounded-none px-0 text-white font-semibold text-lg py-3 h-full data-[state=active]:shadow-none border-b-4 border-transparent data-[state=active]:text-[#FBDC0F] !bg-[#21374B] data-[state=active]:border-[#FBDC0F]">Quizzes</TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value={"main-profile"}>
            <StudentMainProfile />
          </TabsContent>
          <TabsContent value={"courses"}>
            <StudentCourses />
          </TabsContent>
          <TabsContent value={"lessons"}>
            <StudentLessons />
          </TabsContent>
          <TabsContent value={"chat"}>
            <Chat />
          </TabsContent>
          <TabsContent value={"quiz"}>
            <QuizSchedules />
          </TabsContent>
        </Tabs>
      </div>
    </motion.section>
  );
};

export default StudentProfile;
