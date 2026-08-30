import Modal from "@/components/shared/Modal";
import { useEnrollFreeLesson } from "@/lib/react-query/student/enrolling";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface IProps {
  lessonId: number;
}
const EnrollFreeLesson = ({ lessonId }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken()!;
  const navigate = useNavigate();
  const { mutateAsync: enrollLesson, isPending } = useEnrollFreeLesson();

  const handleEnroll = async () => {
    try {
      const { status, message } = await enrollLesson({ token, lessonId });
      if (!status)
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: message,
        });

      // Success
      Swal.fire({
        icon: "success",
        title: "Success",
        text: message,
      });

      navigate("/profile", {
        state: {
          myLessons: true,
        },
      });
    } catch (error) {
      handleResError(error);
    } finally {
      setIsOpen(false);
    }
  };
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-fit bg-main hover:bg-main/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm px-6 py-2"
      >
        Enroll now
      </button>

      <Modal
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        title="Enroll Lesson"
        description={{
          text: "Are you sure you want this free lesson?",
        }}
        isLoading={isPending}
        confirmText="Enroll Now"
        onConfirm={handleEnroll}
        showFooter
      />
    </>
  );
};

export default EnrollFreeLesson;
