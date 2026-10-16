import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import type { ILecture } from "@/interfaces/courses/lectures";
import type {
  ICourseQuizQuestionInput,
} from "@/interfaces/teachers/teacherCourses";
import {
  useCreateTeacherCourseQuiz,
  useDeleteTeacherCourseQuiz,
  useGetTeacherCourseQuiz,
  useUpdateTeacherCourseQuiz,
} from "@/lib/react-query/teacher/courses";
import cookieService from "@/utils/cookieService";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n";

interface QuizOptionDraft {
  id: string;
  title: string;
  is_correct: boolean;
}

interface QuizQuestionDraft {
  id: string;
  title: string;
  score: number;
  options: QuizOptionDraft[];
}

interface IProps {
  courseId: number;
  contentId: number;
  lecture: ILecture;
  courseStatus: "draft" | "pending_approval" | "published" | "rejected";
}

const makeOption = (index: number): QuizOptionDraft => ({
  id: `option-${Date.now()}-${Math.random()}-${index}`,
  title: "",
  is_correct: false,
});

const makeQuestion = (): QuizQuestionDraft => ({
  id: `question-${Date.now()}-${Math.random()}`,
  title: "",
  score: 10,
  options: [makeOption(1), makeOption(2)],
});

const ManageCourseQuiz = ({
  courseId,
  contentId,
  lecture,
  courseStatus,
}: IProps) => {
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const isArabic = language === "ar";
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestionDraft[]>([makeQuestion()]);

  const { mutateAsync: createQuiz, isPending: isCreating } =
    useCreateTeacherCourseQuiz();
  const { mutateAsync: updateQuiz, isPending: isUpdating } =
    useUpdateTeacherCourseQuiz();
  const { mutateAsync: deleteQuiz, isPending: isDeleting } =
    useDeleteTeacherCourseQuiz();

  const quiz = lecture.quiz;
  const { data: fullQuiz, isLoading: isLoadingQuiz, isError: isQuizError } = useGetTeacherCourseQuiz({
    token,
    courseId: courseId.toString(),
    contentId: contentId.toString(),
    lectureId: lecture.id.toString(),
    enabled: (isOpen || isDetailsOpen) && !!quiz,
  });
  const canEdit =
    courseStatus === "draft" || courseStatus === "rejected";

  const resetForm = () => {
    setTitle("");
    setTimeLimit(0);
    setQuestions([makeQuestion()]);
  };

  useEffect(() => {
    if (!fullQuiz?.data || !isOpen) return;

    setTitle(fullQuiz.data.title || "");
    setTimeLimit(Number(fullQuiz.data.time_limit) || 0);
    setQuestions(
      fullQuiz.data.questions.map((question) => ({
        id: "question-" + question.id,
        title: question.title || "",
        score: Number(question.score) || 1,
        options: question.options.map((option) => ({
          id: "option-" + option.id,
          title: option.title || "",
          is_correct: option.is_correct,
        })),
      }))
    );
  }, [fullQuiz, isOpen]);

  const openEditor = () => {
    resetForm();
    setIsOpen(true);
  };

  const closeEditor = () => {
    if (!isCreating && !isUpdating) {
      setIsOpen(false);
      resetForm();
    }
  };

  const updateQuestion = (
    questionId: string,
    updates: Partial<QuizQuestionDraft>
  ) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId ? { ...question, ...updates } : question
      )
    );
  };

  const updateOption = (
    questionId: string,
    optionId: string,
    updates: Partial<QuizOptionDraft>
  ) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id !== questionId
          ? question
          : {
              ...question,
              options: question.options.map((option) =>
                option.id === optionId ? { ...option, ...updates } : option
              ),
            }
      )
    );
  };

  const markCorrect = (questionId: string, optionId: string) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id !== questionId
          ? question
          : {
              ...question,
              options: question.options.map((option) => ({
                ...option,
                is_correct: option.id === optionId,
              })),
            }
      )
    );
  };

  const addQuestion = () => {
    setQuestions((current) => [...current, makeQuestion()]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions((current) =>
      current.filter((question) => question.id !== questionId)
    );
  };

  const addOption = (questionId: string) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id !== questionId || question.options.length >= 4
          ? question
          : {
              ...question,
              options: [
                ...question.options,
                makeOption(question.options.length + 1),
              ],
            }
      )
    );
  };

  const removeOption = (questionId: string, optionId: string) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id !== questionId || question.options.length <= 2
          ? question
          : {
              ...question,
              options: question.options.filter((option) => option.id !== optionId),
            }
      )
    );
  };

  const validate = (): ICourseQuizQuestionInput[] | null => {
    if (!title.trim()) {
      toast.error(isArabic ? "عنوان الاختبار مطلوب" : "Quiz title is required");
      return null;
    }

    if (questions.length < 1) {
      toast.error(isArabic ? "أضف سؤالًا واحدًا على الأقل" : "Add at least one question");
      return null;
    }

    const payload: ICourseQuizQuestionInput[] = [];

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index];
      if (!question.title.trim()) {
        toast.error(
          isArabic
            ? `السؤال رقم ${index + 1} مطلوب`
            : `Question ${index + 1} is required`
        );
        return null;
      }

      const options = question.options
        .map((option) => ({
          title: option.title.trim(),
          is_correct: option.is_correct,
        }))
        .filter((option) => option.title !== "");

      if (options.length < 2) {
        toast.error(
          isArabic
            ? `السؤال رقم ${index + 1} يجب أن يحتوي على إجابتين على الأقل`
            : `Question ${index + 1} needs at least two options`
        );
        return null;
      }

      if (options.length > 4) {
        toast.error(
          isArabic
            ? `السؤال رقم ${index + 1} يحتوي على إجابات كثيرة`
            : `Question ${index + 1} has too many options`
        );
        return null;
      }

      if (options.filter((option) => option.is_correct).length !== 1) {
        toast.error(
          isArabic
            ? `حدد إجابة صحيحة واحدة للسؤال رقم ${index + 1}`
            : `Choose exactly one correct answer for question ${index + 1}`
        );
        return null;
      }

      const duplicateTitles = new Set<string>();
      for (const option of options) {
        const normalized = option.title.toLocaleLowerCase();
        if (duplicateTitles.has(normalized)) {
          toast.error(
            isArabic
              ? `الإجابات في السؤال رقم ${index + 1} يجب أن تكون مختلفة`
              : `Options in question ${index + 1} must be unique`
          );
          return null;
        }
        duplicateTitles.add(normalized);
      }

      payload.push({
        title: question.title.trim(),
        score: Math.max(1, Number(question.score) || 0),
        options,
      });
    }

    return payload;
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!lecture.hasVideo) {
      toast.error(
        isArabic
          ? "ارفع فيديو المحاضرة أولًا قبل إضافة الاختبار"
          : "Upload the lecture video before adding a quiz"
      );
      return;
    }

    const payload = validate();
    if (!payload) return;

    try {
      const quizPayload = {
        courseId: courseId.toString(),
        contentId: contentId.toString(),
        lectureId: lecture.id.toString(),
        title: title.trim(),
        timeLimit: Math.max(0, Number(timeLimit) || 0),
        questions: payload,
      };

      const response = quiz
        ? await updateQuiz({ token, quiz: quizPayload })
        : await createQuiz({ token, quiz: quizPayload });

      if (!response.status) {
        toast.error(response.message || (isArabic ? "تعذر إنشاء الاختبار" : "Unable to create quiz"));
        return;
      }

      setIsOpen(false);
      resetForm();
      toast.success(
        quiz
          ? isArabic
            ? "تم تحديث الاختبار"
            : "Quiz updated"
          : isArabic
            ? "تم إضافة الاختبار للمحاضرة"
            : "Quiz added to the lecture"
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : isArabic ? "حدث خطأ غير متوقع" : "Unexpected error";
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!quiz || isDeleting || !canEdit) return;

    const result = await Swal.fire({
      icon: "warning",
      title: isArabic ? "حذف الاختبار؟" : "Delete quiz?",
      text: isArabic
        ? "سيتم حذف الاختبار وأسئلته."
        : "The quiz and its questions will be deleted.",
      showCancelButton: true,
      confirmButtonText: isArabic ? "حذف" : "Delete",
      cancelButtonText: isArabic ? "إلغاء" : "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteQuiz({
        token,
        quiz: {
          courseId: courseId.toString(),
          contentId: contentId.toString(),
          lectureId: lecture.id.toString(),
        },
      });

      if (!response.status) {
        toast.error(response.message || (isArabic ? "تعذر حذف الاختبار" : "Unable to delete quiz"));
        return;
      }

      toast.success(isArabic ? "تم حذف الاختبار" : "Quiz deleted");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : isArabic ? "حدث خطأ غير متوقع" : "Unexpected error";
      toast.error(message);
    }
  };

  if (quiz) {
    return (
      <div className="mt-3 rounded-lg border border-main/20 bg-main/5 p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-main">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <p className="truncate text-sm font-bold">
                {isArabic ? "اختبار بعد المحاضرة" : "Quiz after lecture"}
              </p>
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-black-blue">
              {quiz.title || (isArabic ? "اختبار" : "Quiz")}
            </p>
            <p className="mt-1 text-xs text-black-blue/60">
              {quiz.questions_count} {isArabic ? "أسئلة" : "questions"} ·{" "}
              {quiz.time_limit
                ? `${quiz.time_limit} ${isArabic ? "دقيقة" : "min"}`
                : isArabic
                  ? "بدون حد زمني"
                  : "No time limit"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              aria-expanded={isDetailsOpen}
              onClick={() => setIsDetailsOpen((open) => !open)}
              className="border-main/40 text-main hover:bg-main/10"
            >
              {isDetailsOpen ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span>
                {isDetailsOpen
                  ? (isArabic ? "إخفاء الأسئلة" : "Hide questions")
                  : (isArabic ? "عرض الأسئلة" : "View questions")}
              </span>
            </Button>
            {canEdit ? (
              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={openEditor}
                  disabled={isLoadingQuiz}
                  className="border-main text-main hover:bg-main hover:text-white"
                >
                  {isLoadingQuiz ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Pencil className="h-4 w-4" />
                  )}
                  <span>{isArabic ? "تعديل الاختبار" : "Edit quiz"}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void handleDelete()}
                  disabled={isDeleting}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span>{isArabic ? "حذف الاختبار" : "Delete quiz"}</span>
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {isDetailsOpen ? (
          <div className="mt-3 border-t border-main/10 pt-3" aria-live="polite">
            {isLoadingQuiz ? (
              <p className="py-3 text-sm text-black-blue/60" role="status">
                {isArabic ? "جارٍ تحميل أسئلة الاختبار..." : "Loading quiz questions..."}
              </p>
            ) : isQuizError ? (
              <p className="py-3 text-sm text-red-600" role="alert">
                {isArabic ? "تعذر تحميل أسئلة الاختبار." : "Unable to load quiz questions."}
              </p>
            ) : fullQuiz?.data?.questions?.length ? (
              <ol className="space-y-3">
                {fullQuiz.data.questions.map((question, index) => (
                  <li key={question.id} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="min-w-0 flex-1 text-sm font-bold text-slate-900">
                        {index + 1}. {question.title || (isArabic ? "سؤال بدون عنوان" : "Untitled question")}
                      </p>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                        {question.score} {isArabic ? "درجة" : "points"}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-2">
                      {question.options.map((option) => (
                        <li
                          key={option.id}
                          className={
                            "flex flex-wrap items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm " +
                            (option.is_correct
                              ? "bg-emerald-50 text-emerald-800"
                              : "bg-slate-50 text-slate-700")
                          }
                        >
                          <span>{option.title || (isArabic ? "إجابة بدون نص" : "Untitled option")}</span>
                          {option.is_correct ? (
                            <span className="shrink-0 text-xs font-bold">
                              {isArabic ? "الإجابة الصحيحة" : "Correct answer"}
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="py-3 text-sm text-slate-500" role="status">
                {isArabic ? "لا توجد أسئلة محفوظة في هذا الاختبار." : "No questions are saved in this quiz."}
              </p>
            )}
          </div>
        ) : null}
      </div>
    );
  }

  if (!canEdit || !lecture.hasVideo) {
    return null;
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={openEditor}
        className="mt-3 border-main text-main hover:bg-main hover:text-white"
      >
        <Plus className="h-4 w-4" />
        {isArabic ? "إضافة اختبار بعد الفيديو" : "Add quiz after video"}
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={closeEditor}
        title={quiz
          ? isArabic
            ? "تعديل اختبار المحاضرة"
            : "Edit lecture quiz"
          : isArabic
            ? "إضافة اختبار للمحاضرة"
            : "Add lecture quiz"}
        description={{
          text: isArabic
            ? "أضف أسئلة اختيار من متعدد. يمكنك جعل الاختبار بدون حد زمني."
            : "Add multiple-choice questions. The quiz can have no time limit.",
        }}
        showFooter={false}
      >
        <form
          onSubmit={(event) => void handleSave(event)}
          className="max-h-[75vh] space-y-5 overflow-y-auto px-1 pb-2 text-black-blue"
        >
          <div>
            <label className="mb-1 block text-sm font-semibold">
              {isArabic ? "عنوان الاختبار" : "Quiz title"}
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 outline-none focus:border-main"
              placeholder={isArabic ? "اختبار الوحدة الأولى" : "Unit 1 quiz"}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              {isArabic ? "المدة بالدقائق (0 = بدون حد)" : "Time limit in minutes (0 = unlimited)"}
            </label>
            <input
              type="number"
              min={0}
              max={1440}
              value={timeLimit}
              onChange={(event) => setTimeLimit(Number(event.target.value))}
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 outline-none focus:border-main"
            />
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="rounded-lg border border-gray-200 p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h4 className="font-bold">
                    {isArabic ? "السؤال" : "Question"} {index + 1}
                  </h4>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-600"
                      aria-label={isArabic ? "حذف السؤال" : "Delete question"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <input
                  value={question.title}
                  onChange={(event) =>
                    updateQuestion(question.id, { title: event.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 outline-none focus:border-main"
                  placeholder={isArabic ? "اكتب السؤال" : "Write the question"}
                />

                <div className="mt-3">
                  <label className="mb-1 block text-xs font-semibold text-black-blue/70">
                    {isArabic ? "الدرجة" : "Score"}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={question.score}
                    onChange={(event) =>
                      updateQuestion(question.id, {
                        score: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-main"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => markCorrect(question.id, option.id)}
                        className="shrink-0"
                        aria-label={
                          isArabic
                            ? `تحديد الإجابة رقم ${optionIndex + 1} كصحيحة`
                            : `Mark option ${optionIndex + 1} as correct`
                        }
                      >
                        {option.is_correct ? (
                          <CheckCircle2 className="h-5 w-5 text-main" />
                        ) : (
                          <span className="block h-5 w-5 rounded-full border-2 border-gray-300" />
                        )}
                      </button>
                      <input
                        value={option.title}
                        onChange={(event) =>
                          updateOption(question.id, option.id, {
                            title: event.target.value,
                          })
                        }
                        className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-main"
                        placeholder={
                          isArabic
                            ? `الإجابة ${optionIndex + 1}`
                            : `Option ${optionIndex + 1}`
                        }
                      />
                      {question.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(question.id, option.id)}
                          className="shrink-0 text-red-500"
                          aria-label={isArabic ? "حذف الإجابة" : "Delete option"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {question.options.length < 4 && (
                  <button
                    type="button"
                    onClick={() => addOption(question.id)}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-main"
                  >
                    <Plus className="h-4 w-4" />
                    {isArabic ? "إضافة إجابة" : "Add option"}
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addQuestion}
            className="inline-flex items-center gap-2 rounded-md border border-main px-4 py-2 text-sm font-semibold text-main hover:bg-main hover:text-white"
          >
            <Plus className="h-4 w-4" />
            {isArabic ? "إضافة سؤال" : "Add question"}
          </button>

          <div className="flex items-center gap-2 border-t border-gray-200 pt-4">
            <AlertCircle className="h-4 w-4 text-main" />
            <p className="text-xs text-black-blue/60">
              {isArabic
                ? "سيتم إرسال الاختبار مع الكورس إلى مراجعة الإدارة."
                : "The quiz will be reviewed together with the course."}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeEditor}
              disabled={isCreating || isUpdating}
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating || (Boolean(quiz) && isLoadingQuiz)}
              className="bg-main hover:bg-main/90"
            >
              {(isCreating || isUpdating) && <Loader2 className="h-4 w-4 animate-spin" />}
              {quiz
                ? isArabic
                  ? "حفظ التعديلات"
                  : "Save changes"
                : isArabic
                  ? "حفظ الاختبار"
                  : "Save quiz"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ManageCourseQuiz;
