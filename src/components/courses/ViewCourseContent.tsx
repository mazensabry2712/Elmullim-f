import { containerVariants, itemVariants } from "@/animations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  useGetCourseContents,
  useGetCourseLectures,
} from "@/lib/react-query/courses/courses";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { FileVideo, Loader, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { CoursesCopy } from "@/pages/courses/courseCopy";
import { getCoursesCopy } from "@/pages/courses/courseCopy";
import { useI18n } from "@/i18n";

interface IProps {
  courseId: number;
  copy?: CoursesCopy;
}

const ViewCourseContent = ({ courseId, copy: providedCopy }: IProps) => {
  const { language } = useI18n();
  const copy = providedCopy ?? getCoursesCopy(language);
  const token = cookieService.getToken() || "";
  const [searchParams] = useSearchParams();
  const contentParam = searchParams.get("content");
  const [contentId, setContentId] = useState<number>();
  const { data: contents, isLoading: isLoadingContents } = useGetCourseContents(courseId);

  // Restore the unit from the URL, so returning from a lecture or quiz opens
  // the same place in the course outline after navigation or a page refresh.
  useEffect(() => {
    if (!contents?.data) return;

    const requestedContentId = Number(contentParam);
    const requestedContentExists =
      contentParam !== null &&
      Number.isSafeInteger(requestedContentId) &&
      requestedContentId > 0 &&
      contents.data.some((content) => content.id === requestedContentId);

    setContentId(requestedContentExists ? requestedContentId : undefined);
  }, [contentParam, contents?.data]);

  const { data: lectures, isLoading: isLoadingLectures } = useGetCourseLectures({
    token,
    courseId,
    contentId: contentId as number,
  });

  if (isLoadingContents) {
    return (
      <div className="py-10" role="status" aria-live="polite">
        <Loader className="animate-spin mx-auto" size={40} aria-hidden="true" />
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
      value={contentId ? `item-${contentId}` : undefined}
      onValueChange={(value) => {
        const nextId = Number(value.replace(/^item-/, ""));
        setContentId(Number.isSafeInteger(nextId) && nextId > 0 ? nextId : undefined);
      }}
    >
      <motion.div
        className="w-full space-y-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {contents.data.map(({ title, description, id }) => (
          <motion.div key={id} variants={itemVariants}>
            <AccordionItem
              value={`item-${id}`}
              className="border border-[#2E1E1] rounded-[5px]"
            >
              <AccordionTrigger
                className="font-bold text-black-blue text-xl data-[state=open]:bg-[#eaeaea] px-4 data-[state=open]:mb-2 rounded-t-[5px] hover:no-underline"
              >
                {title}
              </AccordionTrigger>
              <AccordionContent className="pb-0 pt-2 text-[#333931] font-sora">
                <p className="text-sm px-4">{description}</p>

                {isLoadingLectures ? (
                  <div className="py-5" role="status" aria-live="polite">
                    <Loader2 className="animate-spin mx-auto" size={32} aria-hidden="true" />
                  </div>
                ) : !lectures?.data?.length ? (
                  <p className="text-center text-black-blue py-3" role="status">
                    {copy.noLectures}
                  </p>
                ) : (
                  <div className="space-y-1 mt-3">
                    {lectures.data.map((lecture) => (
                      <div key={lecture.id} className="space-y-1">
                        <Link
                          to={`/courses/${courseId}/view?content=${id}&lecture=${lecture.id}`}
                          state={{ lecture }}
                          className="block bg-[#f1f1f1] space-y-0.5 px-4 py-2 hover:bg-[#dcdcdc] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-inset"
                        >
                          <h4 className="flex items-center gap-2 text-base font-medium">
                            <FileVideo className="shrink-0" size={18} aria-hidden="true" />
                            {lecture.title}
                          </h4>
                          <p className="pl-4 text-sm">{lecture.description}</p>
                          <span className="sr-only">{copy.watchLecture}</span>
                        </Link>
                        {lecture.quiz ? (
                          <Link
                            to={`/view-quiz?quiz=${lecture.quiz.id}&course=${courseId}&content=${id}&lecture=${lecture.id}`}
                            className="flex items-center justify-between gap-3 rounded-md border border-main/20 bg-main/5 px-4 py-2 text-sm text-main transition hover:bg-main/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
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
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </motion.div>
    </Accordion>
  );
};

export default ViewCourseContent;
