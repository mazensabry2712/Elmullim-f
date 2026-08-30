import CreateCourseContent from "@/components/profiles/teacher/courses/CreateCourseContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import CreateCourseLecture from "@/components/profiles/teacher/courses/CreateCourseLecture";
import UploadCourseVideo from "@/components/profiles/teacher/courses/UploadCourseVideo";
import UpdateCourse from "@/components/profiles/teacher/courses/UpdateCourse";

const UploadCourse = () => {
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
          Update course
        </h1>
        <p className="font-sora font-light leading-[30px]">
          Home <span className="text-main">//</span> Update course
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
                Course Details
              </TabsTrigger>
              <TabsTrigger
                value="course"
                className="bg-white hover:!bg-main data-[state=active]:bg-white text-primary hover:!text-white py-0 px-0"
              >
                <CreateCourseContent>Content</CreateCourseContent>
              </TabsTrigger>
              <TabsTrigger
                value="course"
                className="bg-white hover:!bg-main data-[state=active]:bg-white text-primary hover:!text-white py-0 px-0"
              >
                <CreateCourseLecture>Lecture</CreateCourseLecture>
              </TabsTrigger>
              <TabsTrigger
                value="upload"
                className="bg-white hover:!bg-main data-[state=active]:bg-main text-primary data-[state=active]:text-white hover:!text-white py-3"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Upload Video
              </TabsTrigger>
            </TabsList>
            <TabsContent value="course">
              <UpdateCourse />
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
