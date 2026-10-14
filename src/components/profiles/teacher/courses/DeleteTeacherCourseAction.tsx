import axios from "axios";
import { useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteTeacherCourse } from "@/lib/react-query/teacher/courses";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";

interface DeleteTeacherCourseActionProps {
  id: string;
  courseTitle: string;
}

interface ApiErrorResponse {
  message?: string | null;
  errors?: Record<string, string | string[]>;
}

const DeleteTeacherCourseAction = ({
  id,
  courseTitle,
}: DeleteTeacherCourseActionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useI18n();
  const isArabic = language === "ar";
  const { mutateAsync: deleteCourse, isPending } = useDeleteTeacherCourse();

  const copy = isArabic
    ? {
        trigger: "حذف الكورس",
        title: "تأكيد حذف الكورس",
        cancel: "إلغاء",
        confirm: "حذف",
        success: "تم حذف الكورس بنجاح",
        error: "تعذر حذف الكورس. حاول مرة أخرى.",
        authError: "انتهت الجلسة أو لم يتم تسجيل الدخول. سجّل الدخول ثم حاول مرة أخرى.",
        description: "هل أنت متأكد أنك تريد حذف الكورس؟ لا يمكن التراجع عن هذا الإجراء.",
      }
    : {
        trigger: "Delete course",
        title: "Confirm course deletion",
        cancel: "Cancel",
        confirm: "Delete",
        success: "Course deleted successfully",
        error: "Unable to delete this course. Please try again.",
        authError: "Your session is missing or expired. Sign in and try again.",
        description: "Are you sure you want to delete this course? This action cannot be undone.",
      };

  const handleDelete = async () => {
    const token = cookieService.getToken();
    if (!token) {
      toast.error(copy.authError);
      return;
    }

    try {
      const result = await deleteCourse({ id, token });

      if (!result.status) {
        toast.error(result.message || copy.error);
        return;
      }

      toast.success(result.message || copy.success);
      setIsOpen(false);
    } catch (error) {
      const response = axios.isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data
        : undefined;

      if (response?.message || response?.errors) {
        handleResError(error);
      } else {
        toast.error(copy.error);
      }
    }
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!isPending) setIsOpen(nextOpen);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          disabled={isPending}
          aria-label={copy.trigger}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-extrabold sm:w-auto"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {copy.trigger}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent
        dir={isArabic ? "rtl" : "ltr"}
        className="w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-black-blue shadow-2xl"
      >
        <AlertDialogHeader className="items-center space-y-3 text-center sm:text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </span>
          <AlertDialogTitle className="text-lg font-black text-black-blue">
            {copy.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="max-w-sm text-sm leading-6 text-slate-600">
            {isArabic ? (
              <>
                {copy.description} <strong>«{courseTitle}»</strong>
              </>
            ) : (
              <>
                {copy.description} <strong>“{courseTitle}”</strong>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2 sm:space-x-0">
          <AlertDialogCancel
            disabled={isPending}
            className="mt-0 min-h-11 rounded-xl px-5 font-bold"
          >
            {copy.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
            className="min-h-11 rounded-xl bg-destructive px-5 font-bold text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            )}
            {copy.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTeacherCourseAction;
