import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import cookieService from "@/utils/cookieService";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useGetTeacherLessonById } from "@/lib/react-query/teacher/lessons";
import LessonForm from "@/components/forms/teacher/LessonForm";
import { useI18n } from "@/i18n";

const LessonUpdate = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const token = cookieService.getToken()!;
  const { language } = useI18n();
  const { data: lesson, isError } = useGetTeacherLessonById({
    token,
    id: lessonId!,
  });

  useEffect(() => {
    if (isError) {
      toast.error(
        language === "ar" ? "عذرًا، فشل تحميل الدرس" : "Oops...! failed to load"
      );
      navigate(-1);
    }
  }, [navigate, isError, language]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === "ar" ? "تحديث الدرس" : "Update Lesson"}
        </CardTitle>
        <CardDescription>
          {language === "ar"
            ? "يمكنك تحديث تفاصيل الدرس من هنا"
            : "You can update lesson details from here"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <LessonForm action="update" lesson={lesson?.data} />
      </CardContent>
    </Card>
  );
};

export default LessonUpdate;
