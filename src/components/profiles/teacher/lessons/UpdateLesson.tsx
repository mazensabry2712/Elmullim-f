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
          {language === "ar" ? "ضبط الدرس" : "Tune Lesson"}
        </CardTitle>
        <CardDescription>
          {language === "ar"
            ? "عدّل البيانات التي تحتاجها فقط؛ الإعدادات المرتبطة تتكيّف تلقائيًا."
            : "Edit only what you need; related settings adapt automatically."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {lesson?.data?.publishing_status === "rejected" && lesson.data.publishing_note ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-red-500">
              {language === "ar" ? "ملاحظة المراجعة" : "Review note"}
            </p>
            <p className="mt-1 text-sm font-semibold leading-6 text-red-700">
              {lesson.data.publishing_note}
            </p>
          </div>
        ) : null}
        <LessonForm action="update" lesson={lesson?.data} />
      </CardContent>
    </Card>
  );
};

export default LessonUpdate;
