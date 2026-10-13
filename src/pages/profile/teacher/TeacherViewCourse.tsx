import CreateCourseContent from "@/components/profiles/teacher/courses/CreateCourseContent";
import CreateCourseLecture from "@/components/profiles/teacher/courses/CreateCourseLecture";
import { Button } from "@/components/ui/button";
import TeacherViewCourseContent from "@/components/profiles/teacher/courses/TeacherViewCourseContent";
import InstructorDetails from "@/components/shared/InstructorDetails";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { ILecture } from "@/interfaces/courses/lectures";
import { ITeacher } from "@/interfaces/teachers/teacherProfile";
import {
  useGetTeacherCourseById,
  useGetTeacherCourseContents,
  useGetTeacherCourseLectures,
  useSubmitTeacherCourseForReview,
} from "@/lib/react-query/teacher/courses";
import { AxiosResErr } from "@/types";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { BookPlus, FolderPlus, Loader, Loader2, Send } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n";
import { isDisplayableProfileText } from "@/utils/textQuality";

const TeacherViewCourse = () => {
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const isArabic = language === "ar";
  const text = isArabic
    ? { title: "عرض الكورس", home: "الرئيسية", content: "محتوى الكورس", noContents: "لا يوجد محتوى لهذا الكورس بعد.", noLectureVideo: "لا يوجد فيديو لهذه المحاضرة حتى الآن.", loadError: "تعذر تحميل بيانات الكورس.", invalidTitle: "بيانات الكورس تحتاج إلى تصحيح.", invalidDescription: "وصف الكورس يحتاج إلى تصحيح قبل عرضه." }
    : { title: "View Course", home: "Home", content: "Course Content", noContents: "No content has been added to this course yet.", noLectureVideo: "No video is available for this lecture yet.", loadError: "Unable to load course details.", invalidTitle: "Course title needs correction.", invalidDescription: "The course description needs correction before it can be shown." };
  const { courseId } = useParams();
  const isValidCourseId = !!courseId && Number.isSafeInteger(Number(courseId)) && Number(courseId) > 0;
  const queryCourseId = isValidCourseId ? String(Number(courseId)) : "";
  const navigate = useNavigate();
  const {
    data: course,
    isLoading,
    failureReason,
  } = useGetTeacherCourseById({ token, id: queryCourseId, enabled: isValidCourseId });
  const courseFailure = failureReason as AxiosResErr | undefined;
  const { mutateAsync: submitForReview, isPending: isSubmittingForReview } =
    useSubmitTeacherCourseForReview();

  const handleSubmitForReview = async () => {
    if (!course?.data || isSubmittingForReview) return;

    try {
      const response = await submitForReview({
        token,
        id: course.data.id.toString(),
      });

      if (!response.status) {
        toast.error(
          response.message ||
            (language === "ar"
              ? "تعذر إرسال الكورس للمراجعة"
              : "Unable to submit the course for review")
        );
        return;
      }

      toast.success(
        language === "ar"
          ? "تم إرسال الكورس للمراجعة"
          : "Course submitted for review"
      );
    } catch (error: unknown) {
      const apiMessage = (error as AxiosResErr | undefined)?.response?.data?.message;
      const message = typeof apiMessage === "string"
        ? apiMessage
        : error instanceof Error ? error.message : undefined;
      toast.error(
        message ||
          (language === "ar"
            ? "تعذر إرسال الكورس للمراجعة"
            : "Unable to submit the course for review")
      );
    }
  };

  const { data: contents, isLoading: isLoadingContent } =
    useGetTeacherCourseContents({ token, courseId: queryCourseId });
  const { data: lectures, isLoading: isLoadingLectures } =
    useGetTeacherCourseLectures({
      token,
      courseId: queryCourseId,
      contentId: contents?.data?.[0]?.id.toString() || "",
    });
  const location = useLocation();
  const selectedLecture = (location.state as { lecture?: ILecture } | null)?.lecture;
  const lecture = selectedLecture ?? lectures?.data?.[0] ?? null;
  const rawCourseTitle = course?.data?.title;
  const courseTitle = rawCourseTitle && isDisplayableProfileText(rawCourseTitle)
    ? rawCourseTitle
    : text.invalidTitle;
  const courseDescriptionIsValid = isDisplayableProfileText(course?.data?.description, 3);
  const rawLectureTitle = lecture?.title;
  const lectureTitle = rawLectureTitle && isDisplayableProfileText(rawLectureTitle)
    ? rawLectureTitle
    : text.invalidTitle;
  const lectureDescriptionIsValid = isDisplayableProfileText(lecture?.description, 3);

  useEffect(() => {
    if (!isValidCourseId) {
      navigate("/profile", { replace: true, state: { myCourses: true } });
      return;
    }
    if (!isLoading && courseFailure) {
      const message = courseFailure.response?.data?.message;
      toast.error(typeof message === "string" ? message : text.loadError);
      navigate("/profile", { replace: true, state: { myCourses: true } });
    }
  }, [courseId, isValidCourseId, navigate, isLoading, courseFailure, text.loadError]);

  if (!isValidCourseId) return null;

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container text-center text-white space-y-4 md:space-y-6 pt-16 md:pt-24 pb-12 md:pb-20"
      >
        <h1 className="uppercase text-4xl md:text-6xl font-bold leading-[74px]">
          {text.title}
        </h1>
        <p className="font-sora font-light capitalize leading-[30px]">
          {text.home} <span className="text-main">//</span> {text.title}
        </p>
      </motion.div>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
      >
        <div className="py-12 md:py-24">
          {isLoading || isLoadingContent || isLoadingLectures ? (
            <Loader size={40} className="mx-auto animate-spin" />
          ) : (
            <>
              {course?.data &&
              (course.data.publishing_status === "draft" ||
                course.data.publishing_status === "rejected") ? (
                <div className="mb-6 flex flex-col gap-3 px-6 xl:px-16 sm:flex-row">
                  <CreateCourseContent courseId={course.data.id}>
                    <Button type="button" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:w-auto">
                      <FolderPlus className="h-5 w-5" aria-hidden="true" />
                      {language === "ar" ? "إضافة محتوى" : "Add content"}
                    </Button>
                  </CreateCourseContent>
                  <CreateCourseLecture courseId={course.data.id}>
                    <Button type="button" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-600 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:w-auto">
                      <BookPlus className="h-5 w-5" aria-hidden="true" />
                      {language === "ar" ? "إضافة محاضرة" : "Add lecture"}
                    </Button>
                  </CreateCourseLecture>
                </div>
              ) : null}

              <div className="flex flex-col lg:flex-row px-2 md:px-6 xl:px-12">
                <div className="flex-1">
                  {course?.data?.description ? (
                    <p className="mb-5 px-6 text-sm leading-7 text-[#4D5756] xl:px-16" role={!courseDescriptionIsValid ? "status" : undefined}>
                      {courseDescriptionIsValid ? course.data.description : text.invalidDescription}
                    </p>
                  ) : null}
                  <div className="flex flex-col gap-3 px-6 xl:px-16 mb-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h1 className="text-2xl font-bold text-black-blue">
                        {courseTitle}
                      </h1>
                      {course?.data?.publishing_status === "pending_approval" ? (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                          {language === "ar" ? "قيد المراجعة" : "Pending review"}
                        </span>
                      ) : course?.data?.publishing_status === "published" ? (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                          {language === "ar" ? "منشور" : "Published"}
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                          {course?.data?.publishing_status === "rejected"
                            ? language === "ar"
                              ? "مرفوض"
                              : "Rejected"
                            : language === "ar"
                              ? "مسودة"
                              : "Draft"}
                        </span>
                      )}
                    </div>

                    {course?.data?.publishing_status === "rejected" &&
                    course.data.publishing_note ? (
                      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <strong>
                          {language === "ar" ? "ملاحظة الإدارة: " : "Admin note: "}
                        </strong>
                        {course.data.publishing_note}
                      </div>
                    ) : null}

                    {(course?.data?.publishing_status === "draft" ||
                      course?.data?.publishing_status === "rejected") && (
                      <Button
                        type="button"
                        onClick={() => void handleSubmitForReview()}
                        disabled={isSubmittingForReview}
                        className="w-full bg-main hover:bg-main/90 sm:w-fit"
                      >
                        {isSubmittingForReview ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        {course?.data?.publishing_status === "rejected"
                          ? language === "ar"
                            ? "إعادة الإرسال للمراجعة"
                            : "Resubmit for review"
                          : language === "ar"
                            ? "إرسال للمراجعة"
                            : "Submit for review"}
                      </Button>
                    )}
                  </div>

                  {!contents?.data.length ? (
                    <p className="text-lg text-muted text-center">
                      {text.noContents}
                    </p>
                  ) : (
                    <div className="flex flex-col xl:flex-row text-black-blue">
                      <div className="flex-1 px-6 lg:pl-16">
                        <div className="aspect-video w-full rounded overflow-hidden mb-6">
                          {lecture?.videoUrl ? (
                            <VideoPlayer videoUrl={lecture.videoUrl} />
                          ) : (
                            <div className="flex aspect-video items-center justify-center rounded bg-slate-50 px-4 text-center text-sm text-slate-500" role="status">
                              {text.noLectureVideo}
                            </div>
                          )}
                        </div>
                        <div className="my-4">
                          <h2 className="text-2xl font-bold">
                            {lectureTitle}
                          </h2>
                          {lecture?.description ? (
                            <p role={!lectureDescriptionIsValid ? "status" : undefined}>
                              {lectureDescriptionIsValid ? lecture.description : text.invalidDescription}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <aside className="w-full lg:w-[30%] xl:w-1/4 p-4">
                  <h3 className="text-black-blue text-2xl capitalize font-bold mb-5">
                    {text.content}
                  </h3>
                  <div className="max-h-screen overflow-y-auto">
                    <TeacherViewCourseContent
                      courseId={Number(courseId)}
                      courseStatus={course?.data?.publishing_status || "draft"}
                    />
                  </div>
                </aside>
              </div>
              <div className="container">
                <InstructorDetails
                  instructor={course?.data.teacher as ITeacher}
                />
              </div>
            </>
          )}
        </div>
      </motion.section>
    </main>
  );
};

export default TeacherViewCourse;
