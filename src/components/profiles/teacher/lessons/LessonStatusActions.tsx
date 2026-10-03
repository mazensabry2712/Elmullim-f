import { useState } from "react";
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
  lesson: Pick<ITeacherLessonListItem, "id" | "publishing_status" | "publishing_note" | "active_bookings_count">;
  compact?: boolean;
}

const LessonStatusActions = ({ lesson, compact = false }: Props) => {
  const { language } = useI18n();
  const isArabic = language === "ar";
  const [isWorking, setIsWorking] = useState(false);
  const resubmitMutation = useResubmitTeacherLesson();
  const unpublishMutation = useUnpublishTeacherLesson();

  const text = isArabic
    ? {
        resubmit: lesson.publishing_status === "rejected" ? "إعادة الإرسال للمراجعة" : "إرسال للمراجعة",
        unpublish: "إلغاء نشر الدرس",
        unpublishTitle: "إلغاء نشر الدرس؟",
        unpublishDescription: "سيختفي الدرس من البحث العام ولن يمكن للطلاب حجزه. لا يمكن تنفيذ ذلك مع وجود حجوزات نشطة.",
        cancel: "إلغاء",
        confirm: "إلغاء النشر",
        successResubmit: "تم إرسال الدرس للمراجعة.",
        successUnpublish: "تم إلغاء نشر الدرس.",
      }
    : {
        resubmit: lesson.publishing_status === "rejected" ? "Resubmit for review" : "Submit for review",
        unpublish: "Unpublish lesson",
        unpublishTitle: "Unpublish this lesson?",
        unpublishDescription: "The lesson will disappear from public discovery and new students will not be able to book it. Active bookings prevent unpublishing.",
        cancel: "Cancel",
        confirm: "Unpublish",
        successResubmit: "Lesson submitted for review.",
        successUnpublish: "Lesson unpublished successfully.",
      };

  const resubmit = async () => {
    setIsWorking(true);
    try {
      const response = await resubmitMutation.mutateAsync({
        token: cookieService.getToken() || "",
        id: lesson.id,
      });
      if (!response.status) {
        toast.error(response.message || text.successResubmit);
        return;
      }
      toast.success(response.message || text.successResubmit);
    } catch (error) {
      handleResError(error);
    } finally {
      setIsWorking(false);
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

    setIsWorking(true);
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
    } finally {
      setIsWorking(false);
    }
  };

  const visible =
    lesson.publishing_status === "published" ||
    lesson.publishing_status === "rejected" ||
    lesson.publishing_status === "draft" ||
    lesson.publishing_status === "unpublished";

  if (!visible) return null;

  if (lesson.publishing_status === "published") {
    return (
      <button
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

  return (
    <button
      type="button"
      onClick={() => void resubmit()}
      disabled={isWorking}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-main/20 bg-main/[0.06] px-4 py-2.5 text-sm font-bold text-main transition hover:bg-main/[0.1] disabled:cursor-not-allowed disabled:opacity-60 ${compact ? "w-full" : ""}`}
    >
      {isWorking ? <Loader2 className="h-4 w-4 animate-spin" /> : lesson.publishing_status === "rejected" ? <RotateCcw className="h-4 w-4" /> : <UploadCloud className="h-4 w-4" />}
      {text.resubmit}
    </button>
  );
};

export default LessonStatusActions;
