import { useState } from "react";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/shared/Modal";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteTeacherLesson } from "@/lib/react-query/teacher/lessons";

interface IProps {
  id: string;
}
const DeleteLesson = ({ id }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken()!;
  const navigate = useNavigate();
  const { mutateAsync: deleteLesson, isPending } = useDeleteTeacherLesson();

  const handleDelete = async () => {
    try {
      const { message, status } = await deleteLesson({ id, token });
      if (!status) return toast.error(message || "Lesson deleted successfully");

      // delete success
      toast.success(message || "Lesson deleted successfully");
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
        title="Delete Course"
        description={{
          text: "Are you sure you want to delete this course?",
          color: "text-destructive",
        }}
        isLoading={isPending}
        confirmText="delete"
        onConfirm={handleDelete}
        showFooter
        variant="destructive"
      />
    </>
  );
};

export default DeleteLesson;
