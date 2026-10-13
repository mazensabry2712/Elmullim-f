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
import ManageCourseQuiz from "./ManageCourseQuiz";
import UploadCourseVideo from "./UploadCourseVideo";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { isDisplayableProfileText } from "@/utils/textQuality";

interface IProps {
  courseId: number;
  courseStatus: "draft" | "pending_approval" | "published" | "rejected";
}

const TeacherViewCourseContent = ({ courseId, courseStatus }: IProps) => {
  const { language } = useI18n();
  const token = cookieService.getToken()!;
  const [openContentId, setOpenContentId] = useState("");
  const { data: contents, isLoading: isLoadingContents, isError: contentsError, refetch: refetchContents } =
    useGetTeacherCourseContents({ token, courseId: courseId.toString() });
  const { data: lectures, isLoading: isLoadingLectures, isError: lecturesError, refetch: refetchLectures } =
    useGetTeacherCourseLectures({
      token,
      contentId: openContentId,
      courseId: courseId.toString(),
      enabled: !!openContentId,
    });

  const text = language === "ar"
    ? {
        noContents: "لا يوجد محتوى بعد",
        invalidContentTitle: "عنوان المحتوى يحتاج إلى تصحيح",
        invalidContentDescription: "وصف المحتوى يحتاج إلى تصحيح",
        invalidLectureTitle: "عنوان المحاضرة يحتاج إلى تصحيح",
        invalidLectureDescription: "وصف المحاضرة يحتاج إلى تصحيح",
      }
    : {
        noContents: "No course content yet",
        invalidContentTitle: "Content title needs correction",
        invalidContentDescription: "Content description needs correction",
        invalidLectureTitle: "Lecture title needs correction",
        invalidLectureDescription: "Lecture description needs correction",
      };

  const canEdit = courseStatus === "draft" || courseStatus === "rejected";

  return (
    <>
      {isLoadingContents ? (
        <div className="py-10" role="status" aria-live="polite">
          <Loader className="mx-auto animate-spin" size={40} />
        </div>
      ) : contentsError ? (
        <div className="py-6 text-center" role="alert">
          <p className="text-sm text-red-700">
            {language === "ar" ? "تعذر تحميل محتوى الكورس." : "Unable to load course content."}
          </p>
          <Button type="button" variant="outline" onClick={() => void refetchContents()} className="mt-3 border-main text-main">
            {language === "ar" ? "حاول مرة أخرى" : "Try again"}
          </Button>
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
            {!contents?.data.length ? (
              <p className="pt-5 text-center text-lg font-medium text-[#4D5756]">
                {text.noContents}
              </p>
            ) : (
              contents.data.map((content) => {
                const isOpen = openContentId === content.id.toString();
                const contentTitleIsValid = isDisplayableProfileText(content.title);
                const contentDescriptionIsValid = isDisplayableProfileText(content.description, 3);

                return (
                  <motion.div key={content.id} variants={itemVariants}>
                    <AccordionItem
                      value={content.id.toString()}
                      className="rounded-[5px] border border-[#2E1E1]"
                    >
                      <AccordionTrigger className="rounded-t-[5px] px-4 text-xl font-bold text-black-blue hover:no-underline data-[state=open]:mb-2 data-[state=open]:bg-[#eaeaea]">
                        <span className="flex w-full items-center gap-3 px-2">
                          <span className="truncate text-start">{contentTitleIsValid ? content.title : text.invalidContentTitle}</span>
                        </span>
                      </AccordionTrigger>

                      <AccordionContent className="pb-3 pt-2 font-sora text-[#333931]">
                        {content.description ? <p className="px-4 text-sm" role={!contentDescriptionIsValid ? "status" : undefined}>{contentDescriptionIsValid ? content.description : text.invalidContentDescription}</p> : null}

                        {isOpen && isLoadingLectures ? (
                          <div className="py-5">
                            <Loader2 className="mx-auto animate-spin" size={32} />
                          </div>
                        ) : isOpen && !lectures?.data?.length ? (
                          <div className="py-4 text-center text-sm text-black-blue/60" role={lecturesError ? "alert" : "status"}>
                            <p>{lecturesError
                              ? language === "ar" ? "تعذر تحميل المحاضرات." : "Unable to load lectures."
                              : language === "ar" ? "لا توجد محاضرات داخل هذا المحتوى." : "No lectures in this content yet."}</p>
                            {lecturesError ? (
                              <Button type="button" variant="outline" size="sm" onClick={() => void refetchLectures()} className="mt-2 border-main text-main">
                                {language === "ar" ? "حاول مرة أخرى" : "Try again"}
                              </Button>
                            ) : null}
                          </div>
                        ) : isOpen ? (
                          <div className="mt-3 space-y-2 px-2">
                            {lectures?.data?.map((lecture) => {
                              const lectureTitleIsValid = isDisplayableProfileText(lecture.title);
                              const lectureDescriptionIsValid = isDisplayableProfileText(lecture.description, 3);
                              return (
                              <div
                                key={lecture.id}
                                className="rounded-md bg-[#f1f1f1] px-2 py-2 transition-colors hover:bg-[#dcdcdc]"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <Link
                                    to={"/profile/my-courses/" + courseId + "/view"}
                                    state={{ lecture }}
                                    className="min-w-0 flex-1 space-y-0.5 px-2 py-1"
                                  >
                                    <h3 className="flex items-center gap-2 text-base font-medium">
                                      <FileVideo className="shrink-0" size={18} />
                                      <span className="truncate">{lectureTitleIsValid ? lecture.title : text.invalidLectureTitle}</span>
                                    </h3>
                                    {lecture.description ? <p className="pl-6 text-sm" role={!lectureDescriptionIsValid ? "status" : undefined}>{lectureDescriptionIsValid ? lecture.description : text.invalidLectureDescription}</p> : null}
                                    <p className="pl-6 text-xs text-black-blue/60">
                                      {lecture.hasVideo
                                        ? language === "ar"
                                          ? "فيديو مرفوع"
                                          : "Video uploaded"
                                        : language === "ar"
                                          ? "بانتظار رفع الفيديو"
                                          : "Video not uploaded"}
                                    </p>
                                  </Link>

                                </div>

                                {canEdit ? (
                                  <UploadCourseVideo
                                    courseId={courseId}
                                    contentId={content.id}
                                    lectureId={lecture.id}
                                  />
                                ) : null}

                                <ManageCourseQuiz
                                  courseId={courseId}
                                  contentId={content.id}
                                  lecture={lecture}
                                  courseStatus={courseStatus}
                                />
                              </div>
                              );
                            })}
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
    </>
  );
};

export default TeacherViewCourseContent;
