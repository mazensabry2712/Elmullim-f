import { containerVariants, itemVariants } from "@/animations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useGetCourseContents, useGetCourseLectures } from "@/lib/react-query/courses/courses";
import { RootState } from "@/store/store";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { FileVideo, Loader, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";
import type { CoursesCopy } from "@/pages/courses/courseCopy";

interface IProps {
  courseId: number;
  hasEnrolled: boolean;
  copy: CoursesCopy;
}

const CourseContent = ({ courseId, hasEnrolled, copy }: IProps) => {
  const { language } = useI18n();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const token = cookieService.getToken() || "";
  const [openContentId, setOpenContentId] = useState("");
  const { data: contents, isLoading: isLoadingContents } = useGetCourseContents(courseId);
  const { data: lectures, isLoading: isLoadingLectures } = useGetCourseLectures({
    token,
    courseId,
    contentId: Number(openContentId),
    enabled: isAuthenticated && hasEnrolled && !!openContentId,
  });

  return (
    <section aria-labelledby="course-content-title">
      <h3 id="course-content-title" className="mb-5 text-3xl font-bold capitalize text-black-blue">
        {copy.content}
      </h3>
      {isLoadingContents ? (
        <div className="py-10" role="status" aria-live="polite">
          <Loader className="mx-auto animate-spin" size={40} aria-hidden="true" />
        </div>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={openContentId}
          onValueChange={setOpenContentId}
        >
          <motion.div
            className="w-full space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {!contents?.data?.length ? (
              <div className="text-center text-xl" role="status">
                <p className="text-muted">{copy.noContent}</p>
              </div>
            ) : (
              contents.data.map((content) => {
                const isOpen = openContentId === content.id.toString();

                return (
                  <motion.div key={content.id} variants={itemVariants}>
                    <AccordionItem
                      value={content.id.toString()}
                      className="rounded-[5px] border border-[#2E1E1]"
                    >
                      <AccordionTrigger className="rounded-t-[5px] px-4 text-xl font-bold text-black-blue hover:no-underline data-[state=open]:mb-2 data-[state=open]:bg-[#eaeaea]">
                        {content.title}
                      </AccordionTrigger>
                      <AccordionContent className="pb-0 pt-2 font-sora text-[#333931]">
                        <p className="px-4 text-sm">{content.description}</p>

                        {isAuthenticated && hasEnrolled && isOpen ? (
                          <div className="mt-3 space-y-2">
                            {isLoadingLectures ? (
                              <div className="py-5" role="status" aria-live="polite">
                                <Loader2 className="mx-auto animate-spin" size={32} aria-hidden="true" />
                              </div>
                            ) : !lectures?.data?.length ? (
                              <p className="py-3 text-center text-black-blue" role="status">
                                {copy.noLectures}
                              </p>
                            ) : (
                              lectures.data.map((lecture) => (
                                <div
                                  key={lecture.id}
                                  className="rounded-md bg-[#f1f1f1] px-4 py-2"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                      <h4 className="flex items-center gap-2 text-base font-medium">
                                        <FileVideo className="shrink-0" size={18} aria-hidden="true" />
                                        <span className="truncate">{lecture.title}</span>
                                      </h4>
                                      <p className="pl-6 text-sm">{lecture.description}</p>
                                    </div>
                                    <Link
                                      to={"/courses/" + courseId + "/view"}
                                      state={{ lecture }}
                                      className="shrink-0 rounded-md bg-main px-4 py-2 font-sora text-sm font-medium text-white hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
                                    >
                                      <span className="flex items-center gap-2">
                                        <FileVideo className="shrink-0" size={16} aria-hidden="true" />
                                        {copy.watchLecture}
                                      </span>
                                    </Link>
                                  </div>

                                  {lecture.quiz ? (
                                    <Link
                                      to={"/view-quiz?quiz=" + lecture.quiz.id}
                                      className="mt-2 flex items-center justify-between gap-3 rounded-md border border-main/20 bg-main/5 px-3 py-2 text-sm text-main hover:bg-main/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
                                    >
                                      <span className="min-w-0 truncate font-semibold">
                                        {language === "ar" ? "اختبار: " : "Quiz: "}
                                        {lecture.quiz.title}
                                      </span>
                                      <span className="shrink-0 text-xs font-bold">
                                        {language === "ar" ? "بدء الاختبار" : "Take quiz"}
                                      </span>
                                    </Link>
                                  ) : null}
                                </div>
                              ))
                            )}
                          </div>
                        ) : !isAuthenticated || !hasEnrolled ? (
                          <div className="px-4 pt-3 text-sm text-black-blue/55">
                            <Lock className="me-1 inline-block" size={15} aria-hidden="true" />
                            {copy.enroll}
                          </div>
                        ) : null}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </Accordion>
      )}
    </section>
  );
};

export default CourseContent;
