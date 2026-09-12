import { useState } from "react";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import Modal from "@/components/shared/Modal";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteTeacherLessonLecture } from "@/lib/react-query/teacher/lessons";
import { useI18n } from "@/i18n";

interface IProps {
  id: string;
  lessonId: string;
  contentId: string;
}
const DeleteLessonLecture = ({ id, lessonId, contentId }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken()!;
  const { language } = useI18n();
  const { mutateAsync: deleteLessonLecture, isPending } = useDeleteTeacherLessonLecture();

  const text = language === "ar"
    ? {
        success: "تم حذف المحاضرة بنجاح",
        title: "حذف المحاضرة",
        description: "هل أنت متأكد أنك تريد حذف هذه المحاضرة؟",
        confirm: "حذف",
      }
    : {
        success: "Lecture deleted successfully",
        title: "Delete Lecture",
        description: "Are you sure you want to delete this lecture?",
        confirm: "Delete",
      };

  const handleDelete = async () => {
    try {
      const { message, status } = await deleteLessonLecture({ id, token, lessonId, contentId });
      if (!status) return toast.error(message || text.success);

      toast.success(message || text.success);
      setIsOpen(false);
    } catch (error) {
      handleResError(error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="destructive" size="icon">
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

export default DeleteLessonLecture;
