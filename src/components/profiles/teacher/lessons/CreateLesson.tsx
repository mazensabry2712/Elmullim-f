import LessonForm from "@/components/forms/teacher/LessonForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CreateLesson = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إنشاء درس</CardTitle>
        <CardDescription>أنشئ درسًا جديدًا من هنا</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <LessonForm action="create" />
      </CardContent>
    </Card>
  );
};

export default CreateLesson;
