import CreateCourseContent from "@/components/profiles/teacher/courses/CreateCourseContent";
import CreateCourse from "@/components/profiles/teacher/courses/CreateCourse";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import CreateCourseLecture from "@/components/profiles/teacher/courses/CreateCourseLecture";
import UploadCourseVideo from "@/components/profiles/teacher/courses/UploadCourseVideo";
import { useI18n } from "@/i18n";

const UploadCourse = () => {
  const { language } = useI18n();
  const copy = language === "ar"
    ? {
        title: "رفع كورس",
        home: "الرئيسية",
        details: "تفاصيل الكورس",
        content: "المحتوى",
        lecture: "المحاضرة",
        uploadVideo: "رفع الفيديو",
      }
    : {
        title: "Upload course",
        home: "Home",
        details: "Course Details",
        content: "Content",
        lecture: "Lecture",
        uploadVideo: "Upload Video",
      };

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container text-center text-white space-y-4 md:space-y-6 pt-20 md:pt-32 pb-16 md:pb-24"
      >
        <h1 className="uppercase text-4xl md:text-6xl font-bold leading-[74px]">
          {copy.title}
        </h1>
        <p className="font-sora font-light leading-[30px]">
          {copy.home} <span className="text-main">//</span> {copy.title}
        </p>
      </motion.div>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
      >
        <div className="container py-12 md:py-24 overflow-hidden">
          <Tabs defaultValue="course" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-main/30 h-auto p-2 gap-4">
              <TabsTrigger
                value="course"
                className="bg-white hover:!bg-main data-[state=active]:bg-main text-primary data-[state=active]:text-white hover:!text-white py-3"
              >
                {copy.details}
              </TabsTrigger>
              <TabsTrigger
                value="course"
                className="bg-white hover:!bg-main data-[state=active]:bg-white text-primary hover:!text-white py-0 px-0"
              >
                <CreateCourseContent>{copy.content}</CreateCourseContent>
              </TabsTrigger>
              <TabsTrigger
                value="course"
                className="bg-white hover:!bg-main data-[state=active]:bg-white text-primary hover:!text-white py-0 px-0"
              >
                <CreateCourseLecture>{copy.lecture}</CreateCourseLecture>
              </TabsTrigger>
              <TabsTrigger
                value="upload"
                className="bg-white hover:!bg-main data-[state=active]:bg-main text-primary data-[state=active]:text-white hover:!text-white py-3"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                {copy.uploadVideo}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="course">
              <CreateCourse />
            </TabsContent>
            <TabsContent value="upload">
              <UploadCourseVideo />
            </TabsContent>
          </Tabs>
        </div>
      </motion.section>
    </main>
  );
};

export default UploadCourse;
