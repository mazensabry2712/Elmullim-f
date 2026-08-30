import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import CreateLesson from "@/components/profiles/teacher/lessons/CreateLesson";
import CreateLessonContent from "@/components/profiles/teacher/lessons/CreateLessonContent";
import CreateLessonLecture from "@/components/profiles/teacher/lessons/CreateLessonLecture";
import UploadLessonVideo from "@/components/profiles/teacher/lessons/UploadLessonVideo";

const UploadLesson = () => {
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
          Upload lesson
        </h1>
        <p className="font-sora font-light leading-[30px]">
          Home <span className="text-main">//</span> Upload lesson
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
          <Tabs defaultValue="lesson" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-main/30 h-auto p-2 gap-4">
              <TabsTrigger
                value="lesson"
                className="bg-white hover:!bg-main data-[state=active]:bg-main text-primary data-[state=active]:text-white hover:!text-white py-3"
              >
                Lesson Details
              </TabsTrigger>
              <TabsTrigger
                value="lesson"
                className="bg-white hover:!bg-main data-[state=active]:bg-white text-primary hover:!text-white py-0 px-0"
              >
                <CreateLessonContent>Content</CreateLessonContent>
              </TabsTrigger>
              <TabsTrigger
                value="lesson"
                className="bg-white hover:!bg-main data-[state=active]:bg-white text-primary hover:!text-white py-0 px-0"
              >
                <CreateLessonLecture>Lecture</CreateLessonLecture>
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
            <TabsContent value="lesson">
              <CreateLesson />
            </TabsContent>
            <TabsContent value="upload">
              <UploadLessonVideo />
            </TabsContent>
          </Tabs>
        </div>
      </motion.section>
    </main>
  );
};

export default UploadLesson;
