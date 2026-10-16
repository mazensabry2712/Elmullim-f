import CourseForm from "@/components/forms/teacher/CourseForm";
import { useNavigate, useParams } from "react-router-dom";
import { useGetTeacherCourseById } from "@/lib/react-query/teacher/courses";
import cookieService from "@/utils/cookieService";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n";

const UpdateCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const isValidCourseId =
    !!courseId &&
    Number.isSafeInteger(Number(courseId)) &&
    Number(courseId) > 0;
  const normalizedCourseId = isValidCourseId ? String(Number(courseId)) : "";

  const {
    data: courseResponse,
    isLoading,
    isError,
  } = useGetTeacherCourseById({
    token,
    id: normalizedCourseId,
    enabled: isValidCourseId && !!token,
  });

  const course = courseResponse?.data;
  // Published metadata can be edited; pending review stays locked.
  // The API independently preserves price and enforces ownership.
  const canEditCourse =
    course?.publishing_status === "draft" ||
    course?.publishing_status === "rejected" ||
    course?.publishing_status === "published";

  useEffect(() => {
    if (!isValidCourseId) {
      navigate("/profile", { replace: true, state: { myCourses: true } });
      return;
    }

    if (isError) {
      toast.error(
        language === "ar"
          ? "عذرًا، تعذر تحميل بيانات الكورس"
          : "Unable to load the course"
      );
      navigate("/profile", { replace: true, state: { myCourses: true } });
      return;
    }

    if (course && !canEditCourse) {
      toast.info(
        language === "ar"
          ? "لا يمكن تعديل الكورس أثناء مراجعة الإدارة."
          : "Courses cannot be edited while under review."
      );
      navigate(`/profile/my-courses/${course.id}/view`, { replace: true });
    }
  }, [canEditCourse, course, isError, isValidCourseId, language, navigate]);

  if (!isValidCourseId || isLoading || isError || !course || !canEditCourse) {
    return null;
  }

  return <CourseForm action="update" course={course} />;
};

export default UpdateCourse;
