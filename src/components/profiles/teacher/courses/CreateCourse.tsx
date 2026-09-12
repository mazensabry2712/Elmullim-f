import CourseForm from "@/components/forms/teacher/CourseForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useI18n } from "@/i18n";

const CreateCourse = () => {
  const { language } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === "ar" ? "إنشاء كورس" : "Create Course"}</CardTitle>
        <CardDescription>
          {language === "ar" ? "أنشئ كورسًا جديدًا من هنا" : "Create a new course from here"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <CourseForm action="create" />
      </CardContent>
    </Card>
  );
};

export default CreateCourse;
