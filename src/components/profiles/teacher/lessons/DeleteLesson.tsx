import { useState } from "react";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/shared/Modal";
import { useDeleteTeacherLesson } from "@/lib/react-query/teacher/lessons";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useI18n } from "@/i18n";

interface IProps {
  id: string;
  disabled?: boolean;
}
const DeleteLesson = ({ id, disabled = false }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken()!;
  const navigate = useNavigate();
  const { language } = useI18n();
  const { mutateAsync: deleteLesson, isPending } = useDeleteTeacherLesson();

  const text = language === "ar"
    ? {
        success: "تم حذف الدرس بنجاح",
        title: "حذف الدرس",
        description: "هل أنت متأكد أنك تريد حذف هذا الدرس؟",
        confirm: "حذف",
      }
    : {
        success: "Lesson deleted successfully",
        title: "Delete Lesson",
        description: "Are you sure you want to delete this lesson?",
        confirm: "Delete",
      };

  const handleDelete = async () => {
    try {
      const { message, status } = await deleteLesson({ id, token });
      if (!status) return toast.error(message || text.success);

      toast.success(message || text.success);
      setIsOpen(false);
      navigate("/profile");
    } catch (error) {
      handleResError(error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="destructive"
        size="icon"
        disabled={disabled}
        title={disabled ? (language === "ar" ? "لا يمكن حذف درس له حجوزات" : "A lesson with bookings cannot be deleted") : undefined}
        aria-label={disabled ? (language === "ar" ? "لا يمكن حذف الدرس لوجود حجوزات" : "Lesson cannot be deleted because it has bookings") : text.confirm}
      >
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

export default DeleteLesson;
