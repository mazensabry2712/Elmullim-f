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
import ManageCourseQuiz from "./ManageCourseQuiz";
import UploadCourseVideo from "./UploadCourseVideo";
import { useI18n } from "@/i18n";

interface IProps {
  courseId: number;
  courseStatus: "draft" | "pending_approval" | "published" | "rejected";
}

const TeacherViewCourseContent = ({ courseId, courseStatus }: IProps) => {
  const { language } = useI18n();
  const token = cookieService.getToken()!;
  const [openContentId, setOpenContentId] = useState("");
  const { data: contents, isLoading: isLoadingContents } =
    useGetTeacherCourseContents({ token, courseId: courseId.toString() });
  const { data: lectures, isLoading: isLoadingLectures } =
    useGetTeacherCourseLectures({
      token,
      contentId: openContentId,
      courseId: courseId.toString(),
      enabled: !!openContentId,
    });

  const noContentsText =
    language === "ar" ? "لم يتم العثور على محتوى" : "No contents found";

  const canEdit = courseStatus === "draft" || courseStatus === "rejected";

  return (
    <>
      {isLoadingContents ? (
        <div className="py-10">
          <Loader className="mx-auto animate-spin" size={40} />
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
                {noContentsText}
              </p>
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
                        <span className="flex w-full items-center justify-between gap-3 px-2">
                          <span className="truncate text-start">{content.title}</span>
                          <div
                            className="flex shrink-0 gap-2"
                            onClick={(event) => event.stopPropagation()}
                          >
                            {canEdit ? (
                              <>
                                <UpdateCourseContent
                                  courseContent={content}
                                  courseId={courseId}
                                />
                                <DeleteCourseContent
                                  id={content.id.toString()}
                                  courseId={courseId.toString()}
                                />
                              </>
                            ) : null}
                          </div>
                        </span>
                      </AccordionTrigger>

                      <AccordionContent className="pb-3 pt-2 font-sora text-[#333931]">
                        <p className="px-4 text-sm">{content.description}</p>

                        {isOpen && isLoadingLectures ? (
                          <div className="py-5">
                            <Loader2 className="mx-auto animate-spin" size={32} />
                          </div>
                        ) : isOpen && !lectures?.data?.length ? (
                          <p className="py-4 text-center text-sm text-black-blue/60">
                            {language === "ar"
                              ? "لا توجد محاضرات داخل هذا المحتوى."
                              : "No lectures in this content yet."}
                          </p>
                        ) : isOpen ? (
                          <div className="mt-3 space-y-2 px-2">
                            {lectures?.data?.map((lecture) => (
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
                                      <span className="truncate">{lecture.title}</span>
                                    </h3>
                                    <p className="pl-6 text-sm">{lecture.description}</p>
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

                                  <div
                                    className="flex shrink-0 gap-2"
                                    onClick={(event) => event.stopPropagation()}
                                  >
                                    {canEdit ? (
                                      <>
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
                                      </>
                                    ) : null}
                                  </div>
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
                            ))}
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
