import { useState } from "react";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/shared/Modal";
import { useDeleteTeacherCourse } from "@/lib/react-query/teacher/courses";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useI18n } from "@/i18n";

interface IProps {
  id: string;
}
const DeleteCourse = ({ id }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken()!;
  const navigate = useNavigate();
  const { language } = useI18n();
  const { mutateAsync: deleteCourse, isPending } = useDeleteTeacherCourse();

  const text = language === "ar"
    ? {
        success: "تم حذف الكورس بنجاح",
        title: "حذف الكورس",
        description: "هل أنت متأكد أنك تريد حذف هذا الكورس؟",
        confirm: "حذف",
      }
    : {
        success: "Course deleted successfully",
        title: "Delete Course",
        description: "Are you sure you want to delete this course?",
        confirm: "Delete",
      };

  const handleDelete = async () => {
    try {
      const { message, status } = await deleteCourse({ id, token });
      if (!status) return toast.error(message || text.success);

      toast.success(message || text.success);
      setIsOpen(false);
      navigate("/login");
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
        description={{
          text: text.description,
          color: "text-destructive",
        }}
        isLoading={isPending}
        confirmText={text.confirm}
        onConfirm={handleDelete}
        showFooter
        variant="destructive"
      />
    </>
  );
};

export default DeleteCourse;
