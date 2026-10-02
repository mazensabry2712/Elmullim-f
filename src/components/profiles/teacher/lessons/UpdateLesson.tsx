import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import cookieService from "@/utils/cookieService";
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
        language === "ar"
          ? "عذرًا، تعذر تحميل الدرس"
          : "Unable to load this lesson"
      );
      navigate(-1);
    }
  }, [navigate, isError, language]);

  if (!lesson?.data) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-[24px] border border-black-blue/[0.07] bg-white px-6 text-center">
        <p className="text-sm font-bold text-black-blue/55">
          {language === "ar" ? "جاري تحميل الدرس..." : "Loading lesson..."}
        </p>
      </div>
    );
  }

  return (
    <>
      {lesson.data.publishing_status === "rejected" &&
      lesson.data.publishing_note ? (
        <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-4">
          <p className="text-xs font-extrabold uppercase tracking-wide text-red-500">
            {language === "ar" ? "ملاحظة المراجعة" : "Review note"}
          </p>
          <p className="mt-1 text-sm font-semibold leading-6 text-red-700">
            {lesson.data.publishing_note}
          </p>
        </div>
      ) : null}
      <LessonForm action="update" lesson={lesson.data} />
    </>
  );
};

export default LessonUpdate;
