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
      <div
        className="flex min-h-72 items-center justify-center rounded-[24px] border border-black-blue/[0.07] bg-white px-6 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm font-bold text-black-blue/55">
          {language === "ar" ? "جاري تحميل الدرس..." : "Loading lesson..."}
        </p>
      </div>
    );
  }

  const status = lesson.data.publishing_status ?? "draft";
  const statusCopy =
    language === "ar"
      ? {
          published: "منشور",
          pending_approval: "قيد المراجعة",
          rejected: "مرفوض",
          draft: "مسودة",
          unpublished: "غير منشور",
        }
      : {
          published: "Published",
          pending_approval: "Pending review",
          rejected: "Rejected",
          draft: "Draft",
          unpublished: "Unpublished",
        };

  return (
    <>
      <div className="mb-5 rounded-[24px] border border-black-blue/[0.07] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-main">
              {language === "ar" ? "تعديل الدرس" : "Edit lesson"}
            </p>
            <h2 className="mt-1 truncate text-xl font-black text-black-blue">
              {lesson.data.title || (language === "ar" ? "درس بدون عنوان" : "Untitled lesson")}
            </h2>
            <p className="mt-1 text-xs font-semibold text-black-blue/45">
              {language === "ar"
                ? "عدّل البيانات المطلوبة فقط. المواعيد وروابط الاجتماعات والصورة الحالية محفوظة تلقائيًا."
                : "Change only what you need. Existing slots, meeting links and the current cover are preserved."}
            </p>
          </div>
          <span
            className={
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-black " +
              (status === "published"
                ? "bg-emerald-50 text-emerald-700"
                : status === "pending_approval"
                  ? "bg-amber-50 text-amber-700"
                  : status === "rejected"
                    ? "bg-red-50 text-red-700"
                    : "bg-slate-100 text-slate-600")
            }
          >
            {statusCopy[status as keyof typeof statusCopy] ?? status}
          </span>
        </div>
      </div>

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
