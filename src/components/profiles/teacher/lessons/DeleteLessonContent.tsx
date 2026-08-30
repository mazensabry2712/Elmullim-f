import { useState } from "react";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import Modal from "@/components/shared/Modal";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteTeacherLessonContent } from "@/lib/react-query/teacher/lessons";

interface IProps {
  id: string;
  lessonId: string;
}
const DeleteLessonContent = ({ id, lessonId }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken()!;
  const { mutateAsync: deleteLessonContent, isPending } =
    useDeleteTeacherLessonContent();

  const handleDelete = async () => {
    try {
      const { message, status } = await deleteLessonContent({
        id,
        token,
        lessonId,
      });
      if (!status)
        return toast.error(message || "Content deleted successfully");

      // delete success
      toast.success(message || "Content deleted successfully");
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
        title="Delete Content"
        description={{
          text: "Are you sure you want to delete this content?",
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

export default DeleteLessonContent;
