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
  const { data: course, isLoading, isError } = useGetTeacherCourseById({
    token,
    id: courseId || "",
    enabled: Boolean(courseId),
  });

  useEffect(() => {
    if (isError) {
      toast.error(
        language === "ar"
          ? "عذرًا، تعذر تحميل بيانات الكورس"
          : "Unable to load the course"
      );
      navigate(-1);
    }
  }, [navigate, isError, language]);

  if (isLoading) {
    return null;
  }

  return <CourseForm action="update" course={course?.data} />;
};

export default UpdateCourse;
