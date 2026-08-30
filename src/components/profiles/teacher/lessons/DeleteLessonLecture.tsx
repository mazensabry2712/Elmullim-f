import { useState } from "react";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import Modal from "@/components/shared/Modal";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteTeacherLessonLecture } from "@/lib/react-query/teacher/lessons";

interface IProps {
  id: string;
  lessonId: string;
  contentId: string;
}
const DeleteLessonLecture = ({ id, lessonId, contentId }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken()!;
  const { mutateAsync: deleteLessonLecture, isPending } =
    useDeleteTeacherLessonLecture();

  const handleDelete = async () => {
    try {
      const { message, status } = await deleteLessonLecture({
        id,
        token,
        lessonId,
        contentId,
      });
      if (!status)
        return toast.error(message || "Lecture deleted successfully");

      // delete success
      toast.success(message || "Lecture deleted successfully");
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
        title="Delete Lecture"
        description={{
          text: "Are you sure you want to delete this lecture?",
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

export default DeleteLessonLecture;
