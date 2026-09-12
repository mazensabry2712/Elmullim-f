import { useState } from "react";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import Modal from "@/components/shared/Modal";
import { useDeleteTeacherCourseContent } from "@/lib/react-query/teacher/courses";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useI18n } from "@/i18n";

interface IProps {
  id: string;
  courseId: string;
}
const DeleteCourseContent = ({ id, courseId }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken()!;
  const { language } = useI18n();
  const { mutateAsync: deleteCourseContent, isPending } = useDeleteTeacherCourseContent();

  const text = language === "ar"
    ? {
        success: "تم حذف المحتوى بنجاح",
        title: "حذف المحتوى",
        description: "هل أنت متأكد أنك تريد حذف هذا المحتوى؟",
        confirm: "حذف",
      }
    : {
        success: "Content deleted successfully",
        title: "Delete Content",
        description: "Are you sure you want to delete this content?",
        confirm: "Delete",
      };

  const handleDelete = async () => {
    try {
      const { message, status } = await deleteCourseContent({ id, token, courseId });
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

export default DeleteCourseContent;
