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
        description: "هل أنت متأكد أنك تريد حذف هذا الكورس؟ لا يمكن التراجع عن العملية.",
        confirm: "حذف",
        error: "تعذر حذف الكورس",
      }
    : {
        success: "Course deleted successfully",
        title: "Delete Course",
        description: "Are you sure you want to delete this course? This action cannot be undone.",
        confirm: "Delete",
        error: "Unable to delete this course",
      };

  const handleDelete = async () => {
    try {
      const { message, status } = await deleteCourse({ id, token });
      if (!status) return toast.error(message || text.error);

      toast.success(message || text.success);
      setIsOpen(false);
      navigate("/profile", { replace: true, state: { myCourses: true } });
    } catch (error) {
      handleResError(error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)} variant="destructive" size="sm" disabled={isPending} aria-label={language === "ar" ? "حذف الكورس" : "Delete course"} title={language === "ar" ? "حذف الكورس" : "Delete course"} className="h-10 rounded-xl px-4">
        <Trash2 className="h-4 w-4" />
        {language === "ar" ? "حذف الكورس" : "Delete course"}
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
