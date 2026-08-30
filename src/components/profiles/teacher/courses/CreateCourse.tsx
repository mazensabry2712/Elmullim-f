import CourseForm from "@/components/forms/teacher/CourseForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CreateCourse = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Course</CardTitle>
        <CardDescription>Create a new course from here</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <CourseForm action="create" />
      </CardContent>
    </Card>
  );
};

export default CreateCourse;
