import { useState } from "react";
import { isAxiosError } from "axios";
import { Loader2, MessageSquareText, Star } from "lucide-react";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n";
import {
  useCourseTeacherRatingStatus,
  useSubmitCourseTeacherRating,
} from "@/lib/react-query/courseTeacherRating";

interface Props {
  courseId: number;
  token: string;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!isAxiosError(error)) return fallback;

  const responseData = error.response?.data as
    | { message?: string; errors?: Record<string, string[] | string> }
    | undefined;

  if (typeof responseData?.message === "string" && responseData.message.trim()) {
    return responseData.message;
  }

  for (const value of Object.values(responseData?.errors ?? {})) {
    const message = Array.isArray(value) ? value[0] : value;
    if (typeof message === "string" && message.trim()) return message;
  }

  return fallback;
};

const CourseTeacherRating = ({ courseId, token }: Props) => {
  const { language } = useI18n();
  const isArabic = language === "ar";
  const statusQuery = useCourseTeacherRatingStatus({ token, courseId });
  const submitMutation = useSubmitCourseTeacherRating();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const copy = isArabic
    ? {
        title: "قيّم تجربتك مع المدرس",
        subtitle: "رأيك يساعد الطلاب الآخرين ويُظهر للمدرس ما الذي يمكن تحسينه.",
        prompt: "اختر تقييمك",
        feedback: "اكتب تعليقك",
        placeholder: "إيه أكتر حاجة عجبتك في الكورس أو شايف إنها محتاجة تحسين؟",
        submit: "إرسال التقييم",
        submitting: "جاري إرسال التقييم...",
        thankYou: "شكرًا على تقييمك!",
        alreadyRated: "أرسلت تقييمك لهذا الكورس بالفعل.",
        notEligible: "لازم تكون مشتركًا في الكورس حتى تقيّم المدرس.",
        loading: "جاري تحميل حالة التقييم...",
        loadError: "تعذر تحميل حالة التقييم. حاول مرة أخرى.",
        retry: "إعادة المحاولة",
        chooseStars: "اختار تقييمًا من نجمة إلى 5 نجوم.",
        writeFeedback: "اكتب تعليقًا قصيرًا قبل الإرسال.",
        tooLong: "التعليق يجب ألا يتجاوز 150 حرفًا.",
        failed: "تعذر إرسال التقييم. حاول مرة أخرى.",
        chars: "حرف",
        rateLabel: "نجوم",
        yourRating: "تقييمك",
      }
    : {
        title: "Rate your experience with the teacher",
        subtitle: "Your feedback helps other students and gives the teacher useful ways to improve.",
        prompt: "Choose your rating",
        feedback: "Your feedback",
        placeholder: "What did you like about this course, or what could be improved?",
        submit: "Submit rating",
        submitting: "Submitting rating...",
        thankYou: "Thank you for your rating!",
        alreadyRated: "You have already rated this course.",
        notEligible: "You need to be enrolled in this course to rate its teacher.",
        loading: "Loading rating status...",
        loadError: "We couldn't load your rating status. Please try again.",
        retry: "Try again",
        chooseStars: "Choose a rating from 1 to 5 stars.",
        writeFeedback: "Please write a short comment before submitting.",
        tooLong: "Your comment must be 150 characters or less.",
        failed: "We couldn't submit your rating. Please try again.",
        chars: "characters",
        rateLabel: "stars",
        yourRating: "Your rating",
      };

  const status = statusQuery.data?.data;

  const submit = async () => {
    const trimmed = description.trim();

    if (rating < 1 || rating > 5) {
      setError(copy.chooseStars);
      return;
    }
    if (!trimmed) {
      setError(copy.writeFeedback);
      return;
    }
    if (trimmed.length > 150) {
      setError(copy.tooLong);
      return;
    }

    setError("");
    try {
      const response = await submitMutation.mutateAsync({
        token,
        courseId,
        rate: rating,
        description: trimmed,
      });

      if (!response.status) {
        const message = response.message || copy.failed;
        setError(message);
        toast.error(message);
        return;
      }

      toast.success(copy.thankYou);
      setDescription("");
      setRating(0);
      await statusQuery.refetch();
    } catch (requestError) {
      const message = getErrorMessage(requestError, copy.failed);
      setError(message);
      toast.error(message);
    }
  };

  return (
    <section
      className="my-8 overflow-hidden rounded-2xl border border-main/15 bg-gradient-to-br from-[#F7FAF9] to-white p-5 shadow-sm md:p-7"
      aria-labelledby={"course-teacher-rating-title-" + courseId}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
          <MessageSquareText className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2
            id={"course-teacher-rating-title-" + courseId}
            className="text-xl font-black text-black-blue md:text-2xl"
          >
            {copy.title}
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-[#5E6766]">
            {copy.subtitle}
          </p>
        </div>
      </div>

      {statusQuery.isLoading ? (
        <div className="mt-5 flex items-center gap-2 text-sm text-[#5E6766]" role="status">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {copy.loading}
        </div>
      ) : statusQuery.isError || !status ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4">
          <p className="text-sm text-red-700" role="alert">{copy.loadError}</p>
          <button
            type="button"
            onClick={() => void statusQuery.refetch()}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-black-blue hover:bg-gray-50"
          >
            {copy.retry}
          </button>
        </div>
      ) : !status.eligible ? (
        <p className="mt-5 rounded-xl bg-white p-4 text-sm text-[#5E6766]">{copy.notEligible}</p>
      ) : status.has_rated ? (
        <div className="mt-5 rounded-xl border border-emerald-100 bg-white p-4 md:p-5">
          <p className="font-bold text-black-blue">{copy.thankYou}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1" aria-label={copy.yourRating + ": " + (status.rating ?? 0) + " / 5"}>
              {Array.from({ length: 5 }, (_, index) => {
                const active = index < (status.rating ?? 0);
                return (
                  <Star
                    key={index + 1}
                    className={"h-5 w-5 " + (active ? "fill-current text-main" : "text-gray-300")}
                    aria-hidden="true"
                  />
                );
              })}
            </div>
            <span className="text-sm font-bold text-black-blue">
              {(status.rating ?? 0) + "/5"}
            </span>
          </div>
          {status.description && (
            <p className="mt-3 rounded-lg bg-[#F7F9F9] p-3 text-sm leading-6 text-[#4D5756]">
              {status.description}
            </p>
          )}
          <p className="mt-3 text-xs text-[#68716F]">{copy.alreadyRated}</p>
        </div>
      ) : (
        <form
          className="mt-5 rounded-xl border border-black-blue/[0.06] bg-white p-4 md:p-5"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <fieldset>
            <legend className="text-sm font-bold text-black-blue">{copy.prompt}</legend>
            <div className="mt-3 flex items-center gap-1" role="radiogroup" aria-label={copy.prompt}>
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1;
                const active = value <= (hoverRating || rating);
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={rating === value}
                    aria-label={value + " / 5 " + copy.rateLabel}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    onFocus={() => setHoverRating(value)}
                    onBlur={() => setHoverRating(0)}
                    onClick={() => setRating(value)}
                    className="rounded-md p-1 transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-main/40"
                  >
                    <Star
                      className={"h-8 w-8 " + (active ? "fill-current text-main" : "text-gray-300")}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-5">
            <label
              htmlFor={"course-rating-feedback-" + courseId}
              className="text-sm font-bold text-black-blue"
            >
              {copy.feedback}
            </label>
            <textarea
              id={"course-rating-feedback-" + courseId}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={150}
              rows={3}
              required
              placeholder={copy.placeholder}
              className="mt-2 w-full resize-y rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm leading-6 text-black-blue outline-none transition focus:border-main focus:ring-2 focus:ring-main/15"
            />
            <div className="mt-1 flex items-start justify-between gap-3 text-xs text-[#697372]">
              <span className="text-red-600" role={error ? "alert" : undefined}>{error || " "}</span>
              <span className="shrink-0">{description.length}/150 {copy.chars}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-main px-5 py-3 text-sm font-bold text-white transition hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {submitMutation.isPending ? copy.submitting : copy.submit}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default CourseTeacherRating;
