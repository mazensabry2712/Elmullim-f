import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeacherMainProfile from "./TeacherMainProfile";
import TeacherCourses from "./TeacherCourses";
import TeacherLessons from "./TeacherLessons";
import Chat from "@/components/chat/Chat";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/i18n";
import { useQueryClient } from "@tanstack/react-query";
import QueryKeys from "@/enums";
import { getTeacherLessons } from "@/services/teacher/lessons";
import cookieService from "@/utils/cookieService";

const TeacherAvailabilityBlocks = lazy(() => import("./TeacherAvailabilityBlocks"));
const Schedule = lazy(() => import("@/pages/bookings/Schedule"));
const TeacherBookings = lazy(() => import("@/pages/profile/teacher/TeacherBookings"));
const TeacherWallet = lazy(() => import("@/pages/profile/teacher/TeacherWallet"));

const TeacherProfile = () => {
  const location = useLocation();
  const { state } = location;
  const { language } = useI18n();
  const queryClient = useQueryClient();
  const token = cookieService.getToken() || "";

  const prefetchLessons = () => {
    if (!token) return;

    void queryClient.prefetchQuery({
      queryKey: [QueryKeys.TEACHER_LESSONS],
      queryFn: () => getTeacherLessons(token),
      staleTime: 2 * 60 * 1000,
    });
  };

  const text =
    language === "ar"
      ? {
          main: "الرئيسية",
          courses: "كورساتي",
          lessons: "دروسي",
          bookings: "حجوزات الطلاب",
          schedule: "جدول الحصص",
          chat: "الدردشة",
          wallet: "الأرباح",
          availability: "فترات عدم التوفر",
        }
      : {
          main: "Main",
          courses: "My Courses",
          lessons: "My Lessons",
          bookings: "Student Bookings",
          schedule: "Schedule",
          chat: "Chat",
          wallet: "Earnings",
          availability: "Unavailable Times",
        };

  const defaultTab = state?.myCourses
    ? "courses"
    : state?.myLessons
      ? "lessons"
      : state?.teacherBookings
        ? "bookings"
        : state?.teacherSchedule
          ? "schedule"
          : state?.teacherWallet
            ? "wallet"
            : state?.teacherAvailability
              ? "availability"
              : state?.chat
                ? "chat"
                : "main-profile";

  const triggerClassName =
    "h-full shrink-0 whitespace-nowrap rounded-none border-b-4 border-transparent px-1.5 py-3 text-xs font-semibold text-white data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none !bg-[#21374B] sm:px-2.5 sm:text-sm lg:text-base";

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mb-10"
    >
      <div className="mt-10">
        <Tabs key={location.key} defaultValue={defaultTab} className="w-full">
          <TabsList
            aria-label={language === "ar" ? "أقسام حساب المعلم" : "Teacher account sections"}
            className="!mx-auto flex h-auto w-full max-w-full justify-start overflow-x-auto overscroll-x-contain rounded-lg bg-[#21374B] p-0 px-2 sm:px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="mx-auto flex w-max min-w-full items-stretch justify-start gap-4 sm:justify-center sm:gap-6 lg:gap-8">
              <TabsTrigger value="main-profile" className={triggerClassName}>
                {text.main}
              </TabsTrigger>

              <TabsTrigger value="courses" className={triggerClassName}>
                {text.courses}
              </TabsTrigger>

              <TabsTrigger
                value="lessons"
                onPointerEnter={prefetchLessons}
                onPointerDown={prefetchLessons}
                onFocus={prefetchLessons}
                className={triggerClassName}
              >
                {text.lessons}
              </TabsTrigger>

              <TabsTrigger value="bookings" className={triggerClassName}>
                {text.bookings}
              </TabsTrigger>

              <TabsTrigger value="schedule" className={triggerClassName}>
                {text.schedule}
              </TabsTrigger>

              <TabsTrigger value="chat" className={triggerClassName}>
                {text.chat}
              </TabsTrigger>

              <TabsTrigger value="wallet" className={triggerClassName}>
                {text.wallet}
              </TabsTrigger>

              <TabsTrigger value="availability" className={triggerClassName}>
                {text.availability}
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="main-profile">
            <TeacherMainProfile />
          </TabsContent>

          <TabsContent value="courses">
            <TeacherCourses />
          </TabsContent>

          <TabsContent value="lessons">
            <TeacherLessons />
          </TabsContent>

          <TabsContent value="bookings">
            <Suspense fallback={<div className="py-16 text-center text-sm text-black-blue/50" role="status">{language === "ar" ? "جاري تحميل الحجوزات..." : "Loading bookings..."}</div>}>
              <TeacherBookings />
            </Suspense>
          </TabsContent>

          <TabsContent value="schedule">
            <Suspense fallback={<div className="py-16 text-center text-sm text-black-blue/50" role="status">{language === "ar" ? "جاري تحميل جدول الحصص..." : "Loading schedule..."}</div>}>
              <Schedule />
            </Suspense>
          </TabsContent>

          <TabsContent value="chat">
            <Chat />
          </TabsContent>

          <TabsContent value="wallet">
            <Suspense fallback={<div className="py-16 text-center text-sm text-black-blue/50" role="status">{language === "ar" ? "جاري تحميل الأرباح..." : "Loading earnings..."}</div>}>
              <TeacherWallet />
            </Suspense>
          </TabsContent>

          <TabsContent value="availability">
            <Suspense fallback={<div className="py-16 text-center text-sm text-black-blue/50" role="status">{language === "ar" ? "جاري تحميل أوقات عدم التوفر..." : "Loading unavailable times..."}</div>}>
              <TeacherAvailabilityBlocks />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </motion.section>
  );
};

export default TeacherProfile;
