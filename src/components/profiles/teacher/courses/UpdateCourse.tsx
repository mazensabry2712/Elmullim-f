import CourseForm from "@/components/forms/teacher/CourseForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { useGetTeacherCourseById } from "@/lib/react-query/teacher/courses";
import cookieService from "@/utils/cookieService";
import { useEffect } from "react";
import { toast } from "react-toastify";

const UpdateCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = cookieService.getToken()!;
  const { data: course, isError } = useGetTeacherCourseById({
    token,
    id: courseId!,
  });
  useEffect(() => {
    if (isError) {
      toast.error("Oops...! failed to load");
      navigate(-1);
    }
  }, [navigate, isError]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Course</CardTitle>
        <CardDescription>
          You can Update course details from here
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <CourseForm action="update" course={course?.data} />
      </CardContent>
    </Card>
  );
};

export default UpdateCourse;
