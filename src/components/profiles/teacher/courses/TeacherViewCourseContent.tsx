import { containerVariants, itemVariants } from "@/animations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  useGetTeacherCourseContents,
  useGetTeacherCourseLectures,
} from "@/lib/react-query/teacher/courses";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { FileVideo, Loader, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import UpdateCourseContent from "./UpdateCourseContent";
import UpdateCourseLecture from "./UpdateCourseLecture";
import DeleteCourseContent from "./DeleteCourseContent";
import DeleteCourseLecture from "./DeleteCourseLecture";

interface IProps {
  courseId: number;
}

const TeacherViewCourseContent = ({ courseId }: IProps) => {
  const token = cookieService.getToken()!;
  const [contentId, setContentId] = useState<number>();
  const { data: contents, isLoading: isLoadingContents } =
    useGetTeacherCourseContents({ token, courseId: courseId.toString() });
  const { data: lectures, isLoading: isLoadingLectures } =
    useGetTeacherCourseLectures({
      token,
      contentId: contentId?.toString() || "",
      courseId: courseId.toString(),
    });

  return (
    <>
      {isLoadingContents ? (
        <div className="py-10">
          <Loader className="animate-spin mx-auto" size={40} />
        </div>
      ) : (
        <Accordion type="single" collapsible>
          <motion.div
            className="w-full space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {!contents?.data.length ? (
              <p className="font-medium fon-sora text-lg text-center text-[#4D5756] pt-5">
                No contents found
              </p>
            ) : (
              contents?.data.map((content, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <AccordionItem
                    value={`item-${index}`}
                    className="border border-[##2E1E1] rounded-[5px]"
                  >
                    <AccordionTrigger
                      className="font-bold text-black-blue text-xl data-[state=open]:bg-[#eaeaea] px-4 data-[state=open]:mb-2 rounded-t-[5px] hover:no-underline"
                      onClick={() => setContentId(content.id)}
                    >
                      <span className="flex items-center justify-between w-full px-2">
                        {content.title}
                        <div className="flex gap-2">
                          <UpdateCourseContent
                            courseContent={content}
                            courseId={courseId}
                          />
                          <DeleteCourseContent
                            id={content.id.toString()}
                            courseId={courseId.toString()}
                          />
                        </div>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0 pt-2 text-[#333931] font-sora">
                      <p className="text-sm px-4"> {content.description}</p>
                      {isLoadingLectures ? (
                        <div className="py-5">
                          <Loader2 className="animate-spin mx-auto" size={32} />
                        </div>
                      ) : (
                        <div className="space-y-1 mt-3">
                          {lectures?.data.map((lecture) => (
                            <div className="bg-[#f1f1f1] hover:bg-[#dcdcdc] flex justify-between gap-2 items-center px-2">
                              <Link
                                to={`/profile/my-courses/${courseId}/view`}
                                state={{
                                  lecture: lecture,
                                }}
                                key={lecture.id}
                                className="block space-y-0.5 px-4 py-2 transition-all duration-300"
                              >
                                <h3 className="flex items-center gap-2 text-base font-medium">
                                  <FileVideo className="shrink-0" size={18} />

                                  {lecture.title}
                                </h3>
                                <p className="pl-4 text-sm">
                                  {lecture.description}
                                </p>
                              </Link>
                              <div className="flex gap-2">
                                <UpdateCourseLecture
                                  lecture={lecture}
                                  contentId={content.id}
                                  courseLectureId={courseId}
                                />
                                <DeleteCourseLecture
                                  id={lecture.id.toString()}
                                  courseId={courseId.toString()}
                                  contentId={content.id.toString()}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))
            )}
          </motion.div>
        </Accordion>
      )}
    </>
  );
};

export default TeacherViewCourseContent;
