import { containerVariants, itemVariants } from "@/animations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  useGetLessonContents,
  useGetLessonLectures,
} from "@/lib/react-query/lessons/lessons";
import { RootState } from "@/store/store";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { FileVideo, Loader, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getLessonsCopy } from "@/pages/lessons/lessonCopy";
import { useI18n } from "@/i18n";

interface IProps {
  lessonId: number;
  hasEnrolled: boolean;
}

const LessonContent = ({ lessonId, hasEnrolled }: IProps) => {
  const { language } = useI18n();
  const copy = getLessonsCopy(language);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const token = cookieService.getToken()!;
  const [contentId, setContentId] = useState<number>();
  const { data: contents, isLoading: isLoadingContents } =
    useGetLessonContents(lessonId);
  const { data: lectures, isLoading: isLoadingLectures } = useGetLessonLectures({
    token,
    lessonId,
    contentId: contentId!,
  });

  return (
    <>
      <h3 className="text-black-blue text-4xl capitalize font-bold mb-5">
        {copy.content}
      </h3>
      {isLoadingContents ? (
        <div className="py-10" role="status" aria-live="polite">
          <Loader className="animate-spin mx-auto" size={40} aria-hidden="true" />
          <span className="sr-only">{copy.loadingLesson}</span>
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
              <div className="text-center text-xl" role="status">
                <p className="text-muted">{copy.noContent}</p>
              </div>
            ) : (
              contents?.data.map(({ title, description, id }, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <AccordionItem
                    value={`item-${index}`}
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
                        <>
                          {isLoadingLectures ? (
                            <div className="py-2" role="status" aria-live="polite">
                              <Loader2 className="animate-spin mx-auto" size={32} aria-hidden="true" />
                            </div>
                          ) : !lectures?.data?.length ? (
                            <p className="text-center text-black-blue py-3" role="status">
                              {copy.noLectures}
                            </p>
                          ) : (
                            <div className="space-y-1 mt-3">
                              {lectures.data.map((lecture) => (
                                <div
                                  key={lecture.id}
                                  className="bg-[#f1f1f1] space-y-0.5 px-4 py-2 flex justify-between items-center"
                                >
                                  <div>
                                    <h4 className="flex items-center gap-2 text-base font-medium">
                                      <FileVideo size={18} aria-hidden="true" />
                                      {lecture.title}
                                    </h4>
                                    <p className="pl-4 text-sm">{lecture.description}</p>
                                  </div>
                                  {hasEnrolled ? (
                                    <Link
                                      to={""}
                                      className="bg-main hover:bg-main/90 font-sora flex items-center justify-center gap-2 rounded-md px-4 py-2 text-white font-medium"
                                    >
                                      <FileVideo size={16} aria-hidden="true" />
                                      {copy.watch}
                                    </Link>
                                  ) : (
                                    <Lock size={18} aria-label={copy.enroll} />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
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

export default LessonContent;
