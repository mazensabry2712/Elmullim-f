import { Link } from "react-router-dom";
import { EyeOff, Loader2, RotateCcw, UploadCloud } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { ITeacherLessonListItem } from "@/interfaces/lessons/lesson";
import {
  useResubmitTeacherLesson,
  useUnpublishTeacherLesson,
} from "@/lib/react-query/teacher/lessons";
import handleResError from "@/utils/handleResponseError";
import { useI18n } from "@/i18n";
import cookieService from "@/utils/cookieService";

interface Props {
  lesson: Pick<ITeacherLessonListItem, "id" | "publishing_status" | "publishing_note" | "active_bookings_count" | "operational_status" | "seats_remaining">;
  compact?: boolean;
}

const LessonStatusActions = ({ lesson, compact = false }: Props) => {
  const { language } = useI18n();
  const isArabic = language === "ar";
  const resubmitMutation = useResubmitTeacherLesson();
  const unpublishMutation = useUnpublishTeacherLesson();
  const isWorking =
    resubmitMutation.isPending ||
    unpublishMutation.isPending;

  const text = isArabic
    ? {
        submitForReview: "إرسال للمراجعة",
        resubmit: "إعادة الإرسال للمراجعة",
        pending: "قيد المراجعة",
        pendingDescription: "تم إرسال الدرس للمراجعة. سيظهر للطلاب بعد اعتماد الإدارة.",
        unpublish: "إلغاء نشر الدرس",
        unpublishTitle: "إلغاء نشر الدرس؟",
        unpublishDescription: "سيختفي الدرس من البحث العام ولن يمكن للطلاب حجزه. لا يمكن تنفيذ ذلك مع وجود حجوزات نشطة.",
        cancel: "إلغاء",
        confirm: "إلغاء النشر",
        successResubmit: "تم إرسال الدرس للمراجعة.",
        manage: "إدارة الدرس",
        closedFull: "مكتمل السعة",
        closedExpired: "انتهت فترة الحجز",
        closedEnded: "انتهى الدرس",
        successUnpublish: "تم إلغاء نشر الدرس.",
      }
    : {
        submitForReview: "Submit for review",
        resubmit: "Resubmit for review",
        pending: "Pending review",
        pendingDescription: "This lesson is under review and will appear to students after approval.",
        unpublish: "Unpublish lesson",
        unpublishTitle: "Unpublish this lesson?",
        unpublishDescription: "The lesson will disappear from public discovery and new students will not be able to book it. Active bookings prevent unpublishing.",
        cancel: "Cancel",
        confirm: "Unpublish",
        successResubmit: "Lesson submitted for review.",
        manage: "Manage lesson",
        closedFull: "Full capacity",
        closedExpired: "Booking period ended",
        closedEnded: "Lesson ended",
        successUnpublish: "Lesson unpublished successfully.",
      };

  const resubmit = async () => {
    try {
      const response = await resubmitMutation.mutateAsync({
        token: cookieService.getToken() || "",
        id: lesson.id,
      });

      if (!response.status) {
        toast.error(response.message || text.resubmit);
        return;
      }

      toast.success(response.message || text.resubmit);
    } catch (error) {
      handleResError(error);
    }
  };

  const unpublish = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: text.unpublishTitle,
      text: text.unpublishDescription,
      showCancelButton: true,
      confirmButtonText: text.confirm,
      cancelButtonText: text.cancel,
      reverseButtons: isArabic,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await unpublishMutation.mutateAsync({
        token: cookieService.getToken() || "",
        id: lesson.id,
      });
      if (!response.status) {
        toast.error(response.message || text.successUnpublish);
        return;
      }
      toast.success(response.message || text.successUnpublish);
    } catch (error) {
      handleResError(error);
    }
  };

  const visible =
    lesson.publishing_status === "published" ||
    lesson.publishing_status === "pending_approval" ||
    lesson.publishing_status === "rejected" ||
    lesson.publishing_status === "draft" ||
    lesson.publishing_status === "unpublished";

  if (!visible) return null;

  if (lesson.publishing_status === "pending_approval") {
    return (
      <div
        className={
          compact
            ? "w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-center"
            : "rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-center"
        }
      >
        <p className="text-sm font-extrabold text-amber-700">{text.pending}</p>
        <p className="mt-1 text-[11px] font-semibold leading-5 text-amber-700/70">
          {text.pendingDescription}
        </p>
      </div>
    );
  }

  if (lesson.publishing_status === "published") {
    const closedOperational =
      lesson.operational_status === "full" ||
      lesson.operational_status === "booking_expired" ||
      lesson.operational_status === "ended";

    if (closedOperational) {
      const closedLabel =
        lesson.operational_status === "full"
          ? text.closedFull
          : lesson.operational_status === "booking_expired"
            ? text.closedExpired
            : text.closedEnded;

      return (
        <div className={compact ? "w-full space-y-2" : "space-y-2"}>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-extrabold text-amber-700">
            {closedLabel}
            {lesson.operational_status === "full" && lesson.seats_remaining === 0
              ? ` — ${isArabic ? "لا توجد مقاعد متاحة" : "No seats available"}`
              : ""}
          </div>
          <Link
            to={`/profile/my-lessons/${lesson.id}/update`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-main/20 bg-main/[0.06] px-4 py-2.5 text-sm font-bold text-main transition hover:bg-main/[0.1]"
          >
            {text.manage}
          </Link>
        </div>
      );
    }

    return (      <button
        type="button"
        onClick={() => void unpublish()}
        disabled={isWorking || (lesson.active_bookings_count ?? 0) > 0}
        title={(lesson.active_bookings_count ?? 0) > 0
          ? (isArabic ? "لا يمكن إلغاء النشر مع وجود حجوزات نشطة" : "Active bookings prevent unpublishing")
          : undefined}
        className={`inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60 ${compact ? "w-full" : ""}`}
      >
        {isWorking ? <Loader2 className="h-4 w-4 animate-spin" /> : <EyeOff className="h-4 w-4" />}
        {text.unpublish}
      </button>
    
    );
  }

  if (lesson.publishing_status === "rejected") {
    return (
      <button
        type="button"
        onClick={() => void resubmit()}
        disabled={isWorking}
        className={`inline-flex items-center justify-center gap-2 rounded-xl border border-main/20 bg-main/[0.06] px-4 py-2.5 text-sm font-bold text-main transition hover:bg-main/[0.1] disabled:cursor-not-allowed disabled:opacity-60 ${compact ? "w-full" : ""}`}
      >
        {isWorking ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
        {text.resubmit}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void resubmit()}
      disabled={isWorking}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-main px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-60 ${compact ? "w-full" : ""}`}
    >
      {isWorking ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
      {text.submitForReview}
    </button>
  );
};

export default LessonStatusActions;
