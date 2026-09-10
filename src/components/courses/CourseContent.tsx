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
import { RootState } from "@/store/store";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { FileVideo, Loader, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { CoursesCopy } from "@/pages/courses/courseCopy";

interface IProps {
  courseId: number;
  hasEnrolled: boolean;
  copy: CoursesCopy;
}

const CourseContent = ({ courseId, hasEnrolled, copy }: IProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const token = cookieService.getToken() || "";
  const [contentId, setContentId] = useState<number>();
  const { data: contents, isLoading: isLoadingContents } =
    useGetCourseContents(courseId);
  const { data: lectures, isLoading: isLoadingLectures } = useGetCourseLectures({
    token,
    courseId,
    contentId: contentId!,
  });

  return (
    <section aria-labelledby="course-content-title">
      <h3 id="course-content-title" className="text-black-blue text-3xl capitalize font-bold mb-5">
        {copy.content}
      </h3>
      {isLoadingContents ? (
        <div className="py-10" role="status" aria-live="polite">
          <Loader className="animate-spin mx-auto" size={40} aria-hidden="true" />
        </div>
      ) : (
        <Accordion type="single" collapsible>
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
              contents.data.map(({ title, description, id }) => (
                <motion.div key={id} variants={itemVariants}>
                  <AccordionItem
                    value={`item-${id}`}
                    className="border border-[##2E1E1] rounded-[5px]"
                  >
                    <AccordionTrigger
                      className="font-bold text-black-blue text-xl data-[state=open]:bg-[#eaeaea] px-4 data-[state=open]:mb-2 rounded-t-[5px] hover:no-underline"
                      onClick={() => isAuthenticated && setContentId(id)}
                    >
                      {title}
                    </AccordionTrigger>
                    <AccordionContent className="pb-0 pt-2 text-[#333931] font-sora">
                      <p className="text-sm px-4">{description}</p>
                      {isAuthenticated && (
                        <div className="space-y-1 mt-3">
                          {isLoadingLectures ? (
                            <div className="py-5" role="status" aria-live="polite">
                              <Loader2 className="animate-spin mx-auto" size={32} aria-hidden="true" />
                            </div>
                          ) : !lectures?.data?.length ? (
                            <p className="text-center text-black-blue py-3" role="status">
                              {copy.noLectures}
                            </p>
                          ) : (
                            lectures.data.map((lecture) => (
                              <div
                                key={lecture.id}
                                className="bg-[#f1f1f1] space-y-0.5 px-4 py-2 flex justify-between items-center"
                              >
                                <div>
                                  <h4 className="flex items-center gap-2 text-base font-medium">
                                    <FileVideo className="shrink-0" size={18} aria-hidden="true" />
                                    {lecture.title}
                                  </h4>
                                  <p className="pl-4 text-sm">{lecture.description}</p>
                                </div>
                                {hasEnrolled ? (
                                  <Link
                                    to={`/courses/${courseId}/view`}
                                    state={{ lecture }}
                                    className="bg-main hover:bg-main/90 font-sora flex items-center justify-center gap-2 rounded-md px-4 py-2 text-white font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
                                  >
                                    <FileVideo className="shrink-0" size={16} aria-hidden="true" />
                                    {copy.watchLecture}
                                  </Link>
                                ) : (
                                  <Lock size={18} className="shrink-0" aria-label={copy.enroll} />
                                )}
                              </div>
                            ))
                          )}
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
    </section>
  );
};

export default CourseContent;
