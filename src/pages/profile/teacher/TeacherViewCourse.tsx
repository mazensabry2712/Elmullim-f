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
import { Loader, Loader2, Send } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n";

const TeacherViewCourse = () => {
  const token = cookieService.getToken()!;
  const { language } = useI18n();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const {
    data: course,
    isLoading,
    failureReason,
  } = useGetTeacherCourseById({ token, id: courseId! });
  const courseFailure = failureReason as AxiosResErr;
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
      const message =
        error instanceof Error ? error.message : undefined;
      toast.error(
        message ||
          (language === "ar"
            ? "تعذر إرسال الكورس للمراجعة"
            : "Unable to submit the course for review")
      );
    }
  };

  const { data: contents, isLoading: isLoadingContent } =
    useGetTeacherCourseContents({ token, courseId: courseId! });
  const { data: lectures, isLoading: isLoadingLectures } =
    useGetTeacherCourseLectures({
      token,
      courseId: courseId!,
      contentId: contents?.data[0]?.id.toString() || "",
    });
  const { lecture } = (useLocation().state as { lecture: ILecture }) || {
    lecture: lectures?.data?.[0] ?? null,
  };
  useEffect(() => {
    if (!Number(courseId)) navigate("/", { replace: true });
    if (courseFailure) {
      toast.error(courseFailure.response?.data.message);
      navigate(-1);
    }
  }, [courseId, navigate, course, token, isLoading, courseFailure, lecture]);

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
          View Course
        </h1>
        <p className="font-sora font-light capitalize leading-[30px]">
          home <span className="text-main">//</span> view Course
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
                    <Button type="button" className="w-full bg-main hover:bg-main/90 sm:w-auto">
                      {language === "ar" ? "إضافة محتوى" : "Add content"}
                    </Button>
                  </CreateCourseContent>
                  <CreateCourseLecture courseId={course.data.id}>
                    <Button type="button" className="w-full border border-main bg-white text-main hover:bg-main hover:text-white sm:w-auto">
                      {language === "ar" ? "إضافة محاضرة" : "Add lecture"}
                    </Button>
                  </CreateCourseLecture>
                </div>
              ) : null}

              <div className="flex flex-col lg:flex-row px-2 md:px-6 xl:px-12">
                <div className="flex-1">
                  <div className="flex flex-col gap-3 px-6 xl:px-16 mb-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h1 className="text-2xl font-bold text-black-blue">
                        {course?.data?.title}
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
                      No Contents
                    </p>
                  ) : (
                    <div className="flex flex-col xl:flex-row text-black-blue">
                      <div className="flex-1 px-6 lg:pl-16">
                        <div className="aspect-video w-full rounded overflow-hidden mb-6">
                          <VideoPlayer videoUrl={lecture?.videoUrl} />
                        </div>
                        <div className="my-4">
                          <h2 className="text-2xl font-bold">
                            {lecture?.title}
                          </h2>
                          <p>{lecture?.description}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <aside className="w-full lg:w-[30%] xl:w-1/4 p-4">
                  <h3 className="text-black-blue text-2xl capitalize font-bold mb-5">
                    Course Content
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
