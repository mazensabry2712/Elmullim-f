import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  Home,
  MessageCircle,
  Star,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavLink, useLocation } from "react-router-dom";
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
        bookings: "حجزاتي",
        schedule: "مواعيدي",
        ratings: "تقييماتي",
        notifications: "الإشعارات",
        quickLinks: "روابط الطالب المهمة",
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
        bookings: "My Bookings",
        schedule: "My Schedule",
        ratings: "My Ratings",
        notifications: "Notifications",
        quickLinks: "Important student links",
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
    "flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-none border-b-4 border-transparent px-3 py-3 text-xs font-semibold text-white transition-colors data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none !bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FBDC0F] sm:px-3 sm:text-sm";

  const quickLinks = [
    { to: "/bookings", label: text.bookings, icon: CalendarDays },
    { to: "/schedule", label: text.schedule, icon: CalendarClock },
    { to: "/ratings", label: text.ratings, icon: Star },
    { to: "/notifications", label: text.notifications, icon: Bell },
  ];

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
          <div className="overflow-hidden rounded-lg bg-[#21374B] shadow-sm">
            <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max min-w-full items-stretch justify-start gap-1 px-2 sm:px-3 lg:justify-center">
                <TabsList
                  aria-label={text.sections}
                  className="flex h-auto shrink-0 items-stretch justify-start gap-1 rounded-none border-0 bg-transparent p-0 text-white"
                >
                  <TabsTrigger value="main-profile" className={triggerClassName}>
                    <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {text.main}
                  </TabsTrigger>
                  <TabsTrigger value="courses" className={triggerClassName}>
                    <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {text.courses}
                  </TabsTrigger>
                  <TabsTrigger value="chat" className={triggerClassName}>
                    <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {text.chat}
                  </TabsTrigger>
                  <TabsTrigger value="quiz" className={triggerClassName}>
                    <ClipboardList className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {text.quizzes}
                  </TabsTrigger>
                </TabsList>

                <div
                  aria-hidden="true"
                  className="my-2 w-px shrink-0 bg-white/25"
                />

                <nav
                  aria-label={text.quickLinks}
                  className="flex shrink-0 items-stretch gap-1"
                >
                  {quickLinks.map(({ to, label, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        [
                          "flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-none border-b-4 px-3 py-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FBDC0F] sm:text-sm",
                          isActive
                            ? "border-[#FBDC0F] text-[#FBDC0F]"
                            : "border-transparent text-white hover:bg-white/5 hover:text-[#FBDC0F]",
                        ].join(" ")
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {label}
                    </NavLink>
                  ))}
                </nav>
              </div>
            </div>
          </div>

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
