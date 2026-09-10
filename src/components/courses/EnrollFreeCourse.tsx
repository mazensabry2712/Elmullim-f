import Modal from "@/components/shared/Modal";
import { useEnrollFreeCourse } from "@/lib/react-query/student/enrolling";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import type { CoursesCopy } from "@/pages/courses/courseCopy";

interface IProps {
  courseId: number;
  copy: CoursesCopy;
}

const EnrollFreeCourse = ({ courseId, copy }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken() || "";
  const navigate = useNavigate();
  const { mutateAsync: enrollCourse, isPending } = useEnrollFreeCourse();

  const handleEnroll = async () => {
    try {
      const { status, message } = await enrollCourse({ token, courseId });

      if (!status) {
        return Swal.fire({
          icon: "error",
          title: copy.enrollmentErrorTitle,
          text: message,
        });
      }

      Swal.fire({
        icon: "success",
        title: copy.enrollmentSuccessTitle,
        text: message,
      });

      navigate("/profile", { state: { myCourses: true } });
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
        {copy.enroll}
      </button>

      <Modal
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        title={copy.enroll}
        description={{
          text: copy.enrollConfirmation,
        }}
        isLoading={isPending}
        confirmText={copy.confirmEnrollment}
        onConfirm={handleEnroll}
        showFooter
      />
    </>
  );
};

export default EnrollFreeCourse;
