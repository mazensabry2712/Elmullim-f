import { containerVariants, itemVariants } from "@/animations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useGetCourseContents, useGetCourseLectures } from "@/lib/react-query/courses/courses";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { FileVideo, Loader, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { CoursesCopy } from "@/pages/courses/courseCopy";
import { getCoursesCopy } from "@/pages/courses/courseCopy";
import { useI18n } from "@/i18n";

interface IProps {
  courseId: number;
  hasEnrolled: boolean;
  copy?: CoursesCopy;
}

const ViewCourseContent = ({ courseId, hasEnrolled, copy: providedCopy }: IProps) => {
  const { language } = useI18n();
  const copy = providedCopy ?? getCoursesCopy(language);
  const token = cookieService.getToken() || "";
  const [openContentId, setOpenContentId] = useState("");
  const { data: contents, isLoading: isLoadingContents } = useGetCourseContents(courseId);
  const { data: lectures, isLoading: isLoadingLectures } = useGetCourseLectures({
    token,
    courseId,
    contentId: Number(openContentId),
    enabled: hasEnrolled && !!openContentId && !!token,
  });

  if (isLoadingContents) {
    return (
      <div className="py-10" role="status" aria-live="polite">
        <Loader className="mx-auto animate-spin" size={40} aria-hidden="true" />
        <span className="sr-only">{copy.loadingCourse}</span>
      </div>
    );
  }

  if (!contents?.data?.length) {
    return (
      <p className="py-5 text-center text-muted" role="status">
        {copy.noContent}
      </p>
    );
  }

  return (
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
        {contents.data.map((content) => {
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
                <AccordionContent className="pb-3 pt-2 font-sora text-[#333931]">
                  <p className="px-4 text-sm">{content.description}</p>

                  {!hasEnrolled ? (
                    <p className="px-4 pt-3 text-sm text-black-blue/55">
                      {language === "ar"
                        ? "سجّل في الكورس لفتح المحاضرات والاختبارات."
                        : "Enroll in the course to unlock lectures and quizzes."}
                    </p>
                  ) : isOpen && isLoadingLectures ? (
                    <div className="py-5" role="status" aria-live="polite">
                      <Loader2 className="mx-auto animate-spin" size={32} aria-hidden="true" />
                    </div>
                  ) : isOpen && !lectures?.data?.length ? (
                    <p className="py-4 text-center text-black-blue/60" role="status">
                      {copy.noLectures}
                    </p>
                  ) : isOpen ? (
                    <div className="mt-3 space-y-2 px-2">
                      {lectures?.data?.map((lecture) => (
                        <div key={lecture.id} className="rounded-md bg-[#f1f1f1] px-2 py-2">
                          <Link
                            to={"/courses/" + courseId + "/view"}
                            state={{ lecture }}
                            className="block space-y-0.5 px-2 py-1 transition-all duration-300 hover:bg-[#e2e2e2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-inset"
                          >
                            <h4 className="flex items-center gap-2 text-base font-medium">
                              <FileVideo className="shrink-0" size={18} aria-hidden="true" />
                              {lecture.title}
                            </h4>
                            <p className="pl-6 text-sm">{lecture.description}</p>
                            <span className="pl-6 text-xs text-black-blue/55">
                              {lecture.duration
                                ? `${language === "ar" ? "المدة: " : "Duration: "}${lecture.duration}`
                                : ""}
                            </span>
                            <span className="sr-only">{copy.watchLecture}</span>
                          </Link>

                          {lecture.quiz ? (
                            <Link
                              to={"/view-quiz?quiz=" + lecture.quiz.id}
                              className="mt-2 flex items-center justify-between gap-3 rounded-md border border-main/20 bg-main/5 px-3 py-2 text-sm text-main hover:bg-main/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
                            >
                              <span className="min-w-0 truncate font-semibold">
                                {language === "ar" ? "اختبار: " : "Quiz: "}{lecture.quiz.title}
                              </span>
                              <span className="shrink-0 text-xs font-bold">
                                {language === "ar" ? "بدء الاختبار" : "Take quiz"}
                              </span>
                            </Link>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          );
        })}
      </motion.div>
    </Accordion>
  );
};

export default ViewCourseContent;
