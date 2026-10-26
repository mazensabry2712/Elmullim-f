import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/i18n";

const StudentMainProfile = lazy(() => import("./StudentMainProfile"));
const StudentCourses = lazy(() => import("./StudentCourses"));
const Chat = lazy(() => import("@/components/chat/Chat"));
const QuizSchedules = lazy(() => import("./quizes/QuizSchedules"));

const StudentProfile = () => {
  const location = useLocation();
  const state = location.state as
    | { myCourses?: boolean; chat?: boolean; quiz?: boolean }
    | null;
  const { language } = useI18n();
  const isArabic = language === "ar";

  const text = isArabic
    ? {
        main: "الرئيسية",
        courses: "كورساتي",
        chat: "الدردشة",
        quizzes: "الاختبارات",
        loadingMain: "جاري تحميل بيانات الملف الشخصي...",
        loadingCourses: "جاري تحميل كورساتك...",
        loadingChat: "جاري تحميل الدردشة...",
        loadingQuizzes: "جاري تحميل الاختبارات...",
        sections: "أقسام حساب الطالب",
      }
    : {
        main: "Main",
        courses: "My Courses",
        chat: "Chat",
        quizzes: "Quizzes",
        loadingMain: "Loading profile information...",
        loadingCourses: "Loading your courses...",
        loadingChat: "Loading chat...",
        loadingQuizzes: "Loading quizzes...",
        sections: "Student account sections",
      };

  const defaultTab = state?.myCourses
    ? "courses"
    : state?.chat
      ? "chat"
      : state?.quiz
        ? "quiz"
        : "main-profile";

  const triggerClassName =
    "h-full shrink-0 whitespace-nowrap rounded-none border-b-4 border-transparent px-2 py-3 text-xs font-semibold text-white data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none !bg-[#21374B] sm:px-3 sm:text-sm md:px-4 md:text-base";

  const fallback = (label: string) => (
    <div
      className="flex min-h-56 items-center justify-center rounded-xl border border-gray-100 bg-white p-8 text-sm text-black-blue/55"
      role="status"
      aria-live="polite"
    >
      {label}
    </div>
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="container mb-10"
    >
      <div className="mt-8 sm:mt-10">
        <Tabs key={location.key} defaultValue={defaultTab} className="w-full">
          <TabsList
            aria-label={text.sections}
            className="flex h-auto w-full max-w-full justify-start overflow-x-auto overscroll-x-contain rounded-lg bg-[#21374B] p-0 px-2 sm:px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="mx-auto flex w-max min-w-full items-stretch justify-start gap-4 sm:justify-center sm:gap-6 lg:gap-8">
              <TabsTrigger value="main-profile" className={triggerClassName}>
                {text.main}
              </TabsTrigger>
              <TabsTrigger value="courses" className={triggerClassName}>
                {text.courses}
              </TabsTrigger>
              <TabsTrigger value="chat" className={triggerClassName}>
                {text.chat}
              </TabsTrigger>
              <TabsTrigger value="quiz" className={triggerClassName}>
                {text.quizzes}
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="main-profile" className="mt-0">
            <Suspense fallback={fallback(text.loadingMain)}>
              <StudentMainProfile />
            </Suspense>
          </TabsContent>
          <TabsContent value="courses" className="mt-0">
            <Suspense fallback={fallback(text.loadingCourses)}>
              <StudentCourses />
            </Suspense>
          </TabsContent>
          <TabsContent value="chat" className="mt-0">
            <Suspense fallback={fallback(text.loadingChat)}>
              <Chat />
            </Suspense>
          </TabsContent>
          <TabsContent value="quiz" className="mt-0">
            <Suspense fallback={fallback(text.loadingQuizzes)}>
              <QuizSchedules />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </motion.section>
  );
};

export default StudentProfile;
