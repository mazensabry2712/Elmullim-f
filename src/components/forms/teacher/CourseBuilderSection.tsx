import { Button } from "@/components/ui/button";
import CreateCourseContent from "@/components/profiles/teacher/courses/CreateCourseContent";
import CreateCourseLecture from "@/components/profiles/teacher/courses/CreateCourseLecture";
import TeacherViewCourseContent from "@/components/profiles/teacher/courses/TeacherViewCourseContent";
import {
  useSubmitTeacherCourseForReview,
} from "@/lib/react-query/teacher/courses";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n";

export type CoursePublishingStatus =
  | "draft"
  | "pending_approval"
  | "published"
  | "rejected";

interface IProps {
  courseId: number;
  status: CoursePublishingStatus;
  publishingNote?: string | null;
  onStatusChange?: (status: CoursePublishingStatus) => void;
}

const CourseBuilderSection = ({
  courseId,
  status,
  publishingNote,
  onStatusChange,
}: IProps) => {
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const isArabic = language === "ar";
  const [submitError, setSubmitError] = useState("");
  const { mutateAsync: submitForReview, isPending: isSubmitting } =
    useSubmitTeacherCourseForReview();

  const canEdit = status === "draft" || status === "rejected";

  const handleSubmitForReview = async () => {
    if (!canEdit || isSubmitting) return;

    setSubmitError("");

    try {
      const response = await submitForReview({
        token,
        id: courseId.toString(),
      });

      if (!response.status) {
        const message =
          response.message ||
          (isArabic
            ? "تعذر إرسال الكورس للمراجعة"
            : "Unable to submit the course for review");
        setSubmitError(message);
        toast.error(message);
        return;
      }

      onStatusChange?.("pending_approval");
      toast.success(
        isArabic
          ? "تم إرسال الكورس للمراجعة"
          : "Course submitted for review"
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : isArabic
            ? "تعذر إرسال الكورس للمراجعة"
            : "Unable to submit the course for review";
      setSubmitError(message);
      handleResError(error);
    }
  };

  const statusLabel =
    status === "pending_approval"
      ? isArabic
        ? "قيد المراجعة"
        : "Pending review"
      : status === "published"
        ? isArabic
          ? "منشور"
          : "Published"
        : status === "rejected"
          ? isArabic
            ? "مرفوض"
            : "Rejected"
          : isArabic
            ? "مسودة"
            : "Draft";

  return (
    <div className="mt-10 space-y-6 rounded-3xl border border-black-blue/10 bg-slate-50 p-5 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black-blue">
            {isArabic ? "محتوى الكورس" : "Course Content"}
          </h2>
          <p className="mt-1 text-sm text-black-blue/60">
            {isArabic
              ? "أضف المحتوى والمحاضرات والفيديو والاختبارات من نفس الصفحة."
              : "Add content, lectures, videos and quizzes from this page."}
          </p>
        </div>

        <span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-bold text-black-blue shadow-sm">
          {statusLabel}
        </span>
      </div>

      {status === "rejected" && publishingNote ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong>{isArabic ? "ملاحظة الإدارة: " : "Admin note: "}</strong>
          {publishingNote}
        </div>
      ) : null}

      {canEdit ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <CreateCourseContent courseId={courseId}>
            <Button
              type="button"
              className="w-full bg-main hover:bg-main/90 sm:w-auto"
            >
              {isArabic ? "إضافة محتوى" : "Add Content"}
            </Button>
          </CreateCourseContent>

          <CreateCourseLecture courseId={courseId}>
            <Button
              type="button"
              className="w-full border border-main bg-white text-main hover:bg-main hover:text-white sm:w-auto"
            >
              {isArabic ? "إضافة محاضرة" : "Add Lecture"}
            </Button>
          </CreateCourseLecture>
        </div>
      ) : null}

      <div className="rounded-2xl bg-white p-4 md:p-6">
        <TeacherViewCourseContent
          courseId={courseId}
          courseStatus={status}
        />
      </div>

      {canEdit ? (
        <div className="border-t border-black-blue/10 pt-6">
          {submitError ? (
            <p className="mb-3 text-sm font-medium text-red-600">
              {submitError}
            </p>
          ) : null}

          <Button
            type="button"
            onClick={() => void handleSubmitForReview()}
            disabled={isSubmitting}
            className="w-full bg-main hover:bg-main/90 sm:w-fit"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isArabic ? "جاري الإرسال..." : "Submitting..."}
              </>
            ) : status === "rejected" ? (
              isArabic
                ? "إعادة الإرسال للمراجعة"
                : "Resubmit for Review"
            ) : (
              isArabic ? "إرسال للمراجعة" : "Submit for Review"
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default CourseBuilderSection;
