import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/i18n";

const ParentMainProfile = lazy(() => import("./ParentMainProfile"));
const Bookings = lazy(() => import("@/pages/bookings/Bookings"));
const Schedule = lazy(() => import("@/pages/bookings/Schedule"));
const Chat = lazy(() => import("@/components/chat/Chat"));

const ParentProfile = () => {
  const location = useLocation();
  const state = location.state as
    | { chat?: boolean; bookings?: boolean; schedule?: boolean }
    | null;
  const { language } = useI18n();
  const isArabic = language === "ar";

  const text = isArabic
    ? {
        main: "الرئيسية",
        bookings: "الحجوزات",
        schedule: "جدول الحصص",
        chat: "الدردشة",
        loading: "جاري تحميل القسم...",
        sections: "أقسام حساب ولي الأمر",
      }
    : {
        main: "Main",
        bookings: "Bookings",
        schedule: "Schedule",
        chat: "Chat",
        loading: "Loading section...",
        sections: "Parent account sections",
      };

  const defaultTab = state?.bookings
    ? "bookings"
    : state?.schedule
      ? "schedule"
      : state?.chat
        ? "chat"
        : "main-profile";

  const triggerClassName =
    "h-full shrink-0 whitespace-nowrap rounded-none border-b-4 border-transparent px-2 py-3 text-xs font-semibold text-white data-[state=active]:border-[#FBDC0F] data-[state=active]:text-[#FBDC0F] data-[state=active]:shadow-none !bg-[#21374B] sm:px-3 sm:text-sm md:px-4 md:text-base";

  const fallback = (
    <div className="flex min-h-56 items-center justify-center rounded-xl border border-gray-100 bg-white p-8 text-sm text-black-blue/55" role="status">
      {text.loading}
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
              <TabsTrigger value="bookings" className={triggerClassName}>
                {text.bookings}
              </TabsTrigger>
              <TabsTrigger value="schedule" className={triggerClassName}>
                {text.schedule}
              </TabsTrigger>
              <TabsTrigger value="chat" className={triggerClassName}>
                {text.chat}
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="main-profile" className="mt-0">
            <Suspense fallback={fallback}><ParentMainProfile /></Suspense>
          </TabsContent>
          <TabsContent value="bookings" className="mt-0">
            <Suspense fallback={fallback}><Bookings /></Suspense>
          </TabsContent>
          <TabsContent value="schedule" className="mt-0">
            <Suspense fallback={fallback}><Schedule /></Suspense>
          </TabsContent>
          <TabsContent value="chat" className="mt-0">
            <Suspense fallback={fallback}><Chat /></Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </motion.section>
  );
};

export default ParentProfile;
