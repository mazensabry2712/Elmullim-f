import { containerVariants, itemVariants } from "@/animations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import DeleteCourseContent from "./DeleteCourseContent";
import DeleteCourseLecture from "./DeleteCourseLecture";
import UpdateCourseContent from "./UpdateCourseContent";
import UpdateCourseLecture from "./UpdateCourseLecture";
import {
  useGetTeacherCourseContents,
  useGetTeacherCourseLectures,
} from "@/lib/react-query/teacher/courses";
import type { IContent } from "@/interfaces/courses/contents";
import type { ILecture } from "@/interfaces/courses/lectures";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  CircleAlert,
  FileVideo,
  Loader,
  Loader2,
  Upload,
  Video,
  VideoOff,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ManageCourseQuiz from "./ManageCourseQuiz";
import UploadCourseVideo from "./UploadCourseVideo";
import { useI18n } from "@/i18n";
import { isDisplayableProfileText } from "@/utils/textQuality";

interface IProps {
  courseId: number;
  courseStatus: "draft" | "pending_approval" | "published" | "rejected";
}

const TeacherViewCourseContent = ({ courseId, courseStatus }: IProps) => {
  const { language } = useI18n();
  const isArabic = language === "ar";
  const token = cookieService.getToken() || "";
  const [openContentId, setOpenContentId] = useState("");
  const {
    data: contents,
    isLoading: isLoadingContents,
    isError: contentsError,
    refetch: refetchContents,
  } = useGetTeacherCourseContents({ token, courseId: courseId.toString() });
  const {
    data: lectures,
    isLoading: isLoadingLectures,
    isError: lecturesError,
    refetch: refetchLectures,
  } = useGetTeacherCourseLectures({
    token,
    contentId: openContentId,
    courseId: courseId.toString(),
    enabled: !!openContentId,
  });

  const text = isArabic
    ? {
        noContents: "لا يوجد محتوى بعد",
        noContentsHint: "أضف وحدة من الأزرار الموجودة أعلى الصفحة.",
        untitledContent: "محتوى بدون عنوان",
        untitledLecture: "محاضرة بدون عنوان",
        contentReview: "العنوان يحتاج مراجعة",
        descriptionReview: "الوصف يحتاج مراجعة",
        descriptionMissing: "أضف وصفًا واضحًا من 20 حرفًا و3 كلمات على الأقل.",
        lectureTitleReview: "راجع عنوان المحاضرة ليكون واضحًا وغير تجريبي.",
        lectureDescriptionReview: "أضف وصفًا واضحًا من 20 حرفًا و3 كلمات على الأقل.",
        noLectures: "لا توجد محاضرات داخل هذا المحتوى.",
        loadingLectures: "جارٍ تحميل المحاضرات...",
        contentsError: "تعذر تحميل محتوى الكورس.",
        lecturesError: "تعذر تحميل المحاضرات.",
        tryAgain: "حاول مرة أخرى",
        videoReady: "فيديو مرفوع",
        videoMissing: "لم يُرفع فيديو",
        uploadVideo: "رفع فيديو للمحاضرة",
        replaceVideo: "استبدال الفيديو",
      }
    : {
        noContents: "No course content yet",
        noContentsHint: "Use the buttons above to add the first unit.",
        untitledContent: "Untitled content",
        untitledLecture: "Untitled lecture",
        contentReview: "Title needs review",
        descriptionReview: "Description needs review",
        descriptionMissing: "Add a clear description with at least 20 characters and 3 words.",
        lectureTitleReview: "Use a clear, non-placeholder lecture title.",
        lectureDescriptionReview: "Add a clear description with at least 20 characters and 3 words.",
        noLectures: "No lectures in this content yet.",
        loadingLectures: "Loading lectures...",
        contentsError: "Unable to load course content.",
        lecturesError: "Unable to load lectures.",
        tryAgain: "Try again",
        videoReady: "Video uploaded",
        videoMissing: "Video not uploaded",
        uploadVideo: "Upload lecture video",
        replaceVideo: "Replace video",
      };

  const canEdit = courseStatus === "draft" || courseStatus === "rejected";
  const hasContents = Boolean(contents?.data?.length);

  return (
    <div dir={isArabic ? "rtl" : "ltr"}>
      {isLoadingContents ? (
        <div className="flex flex-col items-center gap-3 py-10 text-slate-500" role="status" aria-live="polite">
          <Loader className="h-8 w-8 animate-spin text-emerald-700" />
          <span className="text-sm">{isArabic ? "جارٍ تحميل المحتوى..." : "Loading content..."}</span>
        </div>
      ) : contentsError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-center" role="alert">
          <p className="text-sm font-semibold text-rose-800">{text.contentsError}</p>
          <Button type="button" variant="outline" onClick={() => void refetchContents()} className="mt-3 min-h-10 border-rose-200 bg-white text-rose-700 hover:bg-rose-100">
            {text.tryAgain}
          </Button>
        </div>
      ) : !hasContents ? (
        <div className="flex flex-col items-center px-4 py-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <BookOpen className="h-6 w-6" />
          </span>
          <p className="mt-3 text-sm font-extrabold text-slate-800">{text.noContents}</p>
          <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">{text.noContentsHint}</p>
        </div>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={openContentId}
          onValueChange={setOpenContentId}
        >
          <motion.div
            className="w-full space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {contents?.data.map((content: IContent, index: number) => {
              const isOpen = openContentId === content.id.toString();
              const contentTitleIsValid = isDisplayableProfileText(content.title);
              const contentDescription = content.description?.trim() || "";
              const contentDescriptionIsValid =
                contentDescription.length >= 20 && isDisplayableProfileText(contentDescription, 3);

              return (
                <motion.div key={content.id} variants={itemVariants}>
                  <AccordionItem
                    value={content.id.toString()}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow data-[state=open]:border-emerald-200 data-[state=open]:shadow-md"
                  >
                    <div className="flex items-center gap-1.5 px-2 sm:px-3">
                    <AccordionTrigger className="min-w-0 flex-1 px-2 py-4 text-start text-base font-extrabold text-slate-900 hover:bg-slate-50 hover:no-underline data-[state=open]:bg-emerald-50/60">
                      <span className="flex min-w-0 flex-1 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                          <BookOpen className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block break-words text-start">
                            {content.title?.trim() || text.untitledContent}
                          </span>
                          {!contentTitleIsValid ? (
                            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                              <CircleAlert className="h-3 w-3" />
                              {text.contentReview}
                            </span>
                          ) : null}
                        </span>
                        <span className="me-2 shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-extrabold text-slate-500">
                          {isArabic ? "وحدة " : "Unit "}{index + 1}
                        </span>
                      </span>
                    </AccordionTrigger>
                    {canEdit ? (
                      <div className="flex shrink-0 items-center gap-1.5 pb-1">
                        <UpdateCourseContent courseContent={content} courseId={courseId} />
                        <DeleteCourseContent id={content.id.toString()} courseId={courseId.toString()} />
                      </div>
                    ) : null}
                    </div>

                    <AccordionContent className="border-t border-slate-100 bg-white px-3 pb-4 pt-3 sm:px-4">
                      {!contentDescriptionIsValid ? (
                        <div className="mb-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3" role="status">
                          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                          <div className="min-w-0">
                            {contentDescription ? (
                              <p className="whitespace-pre-line break-words text-sm leading-6 text-slate-700">{contentDescription}</p>
                            ) : null}
                            <p className="mt-1 text-xs font-semibold leading-5 text-amber-800">
                              {contentDescription ? text.descriptionReview : text.descriptionMissing}
                            </p>
                          </div>
                        </div>
                      ) : contentDescription ? (
                        <p className="mb-3 rounded-xl bg-slate-50 px-3 py-3 text-sm leading-6 text-slate-600 whitespace-pre-line break-words">{contentDescription}</p>
                      ) : null}

                      {isOpen && isLoadingLectures ? (
                        <div className="flex flex-col items-center gap-2 py-6 text-slate-500" role="status" aria-live="polite">
                          <Loader2 className="h-6 w-6 animate-spin text-emerald-700" />
                          <p className="text-xs">{text.loadingLectures}</p>
                        </div>
                      ) : isOpen && lecturesError ? (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-center" role="alert">
                          <p className="text-sm text-rose-800">{text.lecturesError}</p>
                          <Button type="button" variant="outline" size="sm" onClick={() => void refetchLectures()} className="mt-2 border-rose-200 bg-white text-rose-700 hover:bg-rose-100">
                            {text.tryAgain}
                          </Button>
                        </div>
                      ) : isOpen && !lectures?.data?.length ? (
                        <div className="rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center text-sm text-slate-500" role="status">
                          <Video className="mx-auto h-6 w-6 text-slate-400" />
                          <p className="mt-2">{text.noLectures}</p>
                        </div>
                      ) : isOpen ? (
                        <div className="space-y-3">
                          {lectures?.data?.map((lecture: ILecture, lectureIndex: number) => {
                            const lectureTitleIsValid = isDisplayableProfileText(lecture.title);
                            const lectureDescription = lecture.description?.trim() || "";
                            const lectureDescriptionIsValid =
                              lectureDescription.length >= 20 &&
                              isDisplayableProfileText(lectureDescription, 3);

                            return (
                              <article
                                key={lecture.id}
                                className="rounded-2xl border border-slate-100 bg-white p-3 transition-colors hover:border-emerald-200"
                              >
                                <Link
                                  to={"/profile/my-courses/" + courseId + "/view"}
                                  state={{ lecture, contentId: content.id }}
                                  className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                >
                                  <div className="flex min-w-0 items-start gap-3">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                      <FileVideo className="h-4 w-4" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                      <span className="flex flex-wrap items-center gap-2">
                                        <span className="break-words text-sm font-extrabold leading-6 text-slate-900">
                                          {lecture.title?.trim() || text.untitledLecture}
                                        </span>
                                        <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                                          {isArabic ? "محاضرة " : "Lecture "}{lectureIndex + 1}
                                        </span>
                                      </span>
                                      {lectureDescription ? (
                                        <span className="mt-1 block whitespace-pre-line break-words text-xs leading-5 text-slate-500">
                                          {lectureDescription}
                                        </span>
                                      ) : null}
                                      {!lectureTitleIsValid ? (
                                        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                                          <CircleAlert className="h-3 w-3" />
                                          {text.lectureTitleReview}
                                        </span>
                                      ) : null}
                                      {!lectureDescriptionIsValid ? (
                                        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                                          <CircleAlert className="h-3 w-3" />
                                          {lectureDescription ? text.lectureDescriptionReview : text.descriptionMissing}
                                        </span>
                                      ) : null}
                                    </span>
                                  </div>
                                </Link>

                                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                  <span className={"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold " + (lecture.hasVideo ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800")}>
                                    {lecture.hasVideo ? <CheckCircle2 className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
                                    {lecture.hasVideo ? text.videoReady : text.videoMissing}
                                  </span>
                                  {canEdit ? (
                                    <div className="flex shrink-0 items-center gap-1.5">
                                      <UpdateCourseLecture lecture={lecture} courseLectureId={courseId} contentId={content.id} />
                                      <DeleteCourseLecture id={lecture.id.toString()} courseId={courseId.toString()} contentId={content.id.toString()} />
                                    </div>
                                  ) : null}
                                </div>

                                {canEdit ? (
                                  <details className="group mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 text-xs font-extrabold text-slate-700 outline-none hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-500">
                                      <span className="inline-flex items-center gap-2">
                                        <Upload className="h-4 w-4 text-emerald-700" />
                                        {lecture.hasVideo ? text.replaceVideo : text.uploadVideo}
                                      </span>
                                      <span className="text-slate-400 transition-transform group-open:rotate-180">⌄</span>
                                    </summary>
                                    <div className="border-t border-slate-200 bg-white p-3">
                                      <UploadCourseVideo
                                        courseId={courseId}
                                        contentId={content.id}
                                        lectureId={lecture.id}
                                        compact
                                      />
                                    </div>
                                  </details>
                                ) : null}

                                <ManageCourseQuiz
                                  courseId={courseId}
                                  contentId={content.id}
                                  lecture={lecture}
                                  courseStatus={courseStatus}
                                />
                              </article>
                            );
                          })}
                        </div>
                      ) : null}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </motion.div>
        </Accordion>
      )}
    </div>
  );
};

export default TeacherViewCourseContent;
