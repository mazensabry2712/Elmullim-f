import Modal from "@/components/shared/Modal";
import { useEnrollFreeLesson } from "@/lib/react-query/student/enrolling";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import type { LessonsCopy } from "@/pages/lessons/lessonCopy";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface IProps {
  lessonId: number;
  copy?: LessonsCopy;
}

const EnrollFreeLesson = ({ lessonId, copy }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken() || "";
  const navigate = useNavigate();
  const { mutateAsync: enrollLesson, isPending } = useEnrollFreeLesson();

  const text = {
    button: copy?.enroll ?? "Enroll now",
    title: copy?.detailTitle ?? "Enroll Lesson",
    description: copy?.enroll === "اشترك الآن" ? "هل تريد الاشتراك في هذا الدرس المجاني؟" : "Are you sure you want this free lesson?",
    confirm: copy?.enroll ?? "Enroll now",
    success: copy?.enroll === "اشترك الآن" ? "تم الاشتراك بنجاح" : "Lesson enrolled successfully",
    error: copy?.enroll === "اشترك الآن" ? "حدث خطأ" : "Error",
  };

  const handleEnroll = async () => {
    try {
      const { status, message } = await enrollLesson({ token, lessonId });
      if (!status) {
        await Swal.fire({
          icon: "error",
          title: text.error,
          text: message,
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: text.success,
        text: message,
      });

      navigate("/profile", { state: { myLessons: true } });
    } catch (error) {
      handleResError(error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-fit bg-main hover:bg-main/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm px-6 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
      >
        {text.button}
      </button>

      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={text.title}
        description={{ text: text.description }}
        isLoading={isPending}
        confirmText={text.confirm}
        onConfirm={handleEnroll}
        showFooter
      />
    </>
  );
};

export default EnrollFreeLesson;
