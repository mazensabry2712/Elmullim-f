import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import Modal from "@/components/shared/Modal";
import { useDeleteTeacherCourseLecture } from "@/lib/react-query/teacher/courses";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useI18n } from "@/i18n";

interface IProps {
  id: string;
  courseId: string;
  contentId: string;
}
const DeleteCourseLecture = ({ id, courseId, contentId }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken() || "";
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useI18n();
  const { mutateAsync: deleteCourseLecture, isPending } = useDeleteTeacherCourseLecture();

  const text = language === "ar"
    ? {
        success: "تم حذف المحاضرة بنجاح",
        title: "حذف المحاضرة",
        description: "هل أنت متأكد أنك تريد حذف هذه المحاضرة؟ لا يمكن التراجع عن العملية.",
        confirm: "حذف",
        error: "تعذر حذف المحاضرة",
      }
    : {
        success: "Lecture deleted successfully",
        title: "Delete Lecture",
        description: "Are you sure you want to delete this lecture? This action cannot be undone.",
        confirm: "Delete",
        error: "Unable to delete this lecture",
      };

  const handleDelete = async () => {
    try {
      const { message, status } = await deleteCourseLecture({ id, token, courseId, contentId });
      if (!status) return toast.error(message || text.error);

      toast.success(message || text.success);
      const routeState = location.state as { lecture?: { id?: number } } | null;
      if (Number(routeState?.lecture?.id) === Number(id)) {
        navigate(location.pathname, { replace: true, state: null });
      }
      setIsOpen(false);
    } catch (error) {
      handleResError(error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)} variant="destructive" size="icon" disabled={isPending} aria-label={language === "ar" ? "حذف المحاضرة" : "Delete lecture"} title={language === "ar" ? "حذف المحاضرة" : "Delete lecture"} className="h-9 w-9 rounded-xl">
        <Trash2 className="h-4 w-4" />
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        title={text.title}
        description={{ text: text.description, color: "text-destructive" }}
        isLoading={isPending}
        confirmText={text.confirm}
        onConfirm={handleDelete}
        showFooter
        variant="destructive"
      />
    </>
  );
};

export default DeleteCourseLecture;
