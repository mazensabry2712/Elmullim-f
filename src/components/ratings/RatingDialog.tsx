import { useEffect, useId, useState } from "react";
import { AxiosError } from "axios";
import { Loader2, Star, X } from "lucide-react";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n";
import { useSubmitRating } from "@/lib/react-query/rating";
import type { RatingActorRole, RatingTargetType } from "@/services/rating";

interface Props {
  token: string;
  actorRole: RatingActorRole;
  targetType: RatingTargetType;
  targetId: number;
  bookingId: number;
  targetName?: string | null;
  triggerLabel?: string;
  className?: string;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!AxiosError.isAxiosError(error)) return fallback;

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

const RatingDialog = ({
  token,
  actorRole,
  targetType,
  targetId,
  bookingId,
  targetName,
  triggerLabel,
  className,
}: Props) => {
  const { language } = useI18n();
  const isArabic = language === "ar";
  const titleId = useId();
  const descriptionId = useId();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const submitMutation = useSubmitRating();

  const targetLabel =
    targetType === "teacher"
      ? isArabic
        ? "المعلم"
        : "teacher"
      : isArabic
        ? "الطالب"
        : "student";

  const copy = isArabic
    ? {
        trigger: triggerLabel || "تقييم " + targetLabel,
        title: "تقييم " + targetLabel,
        intro: targetName
          ? "إرسال تقييم إلى " + targetName
          : "شارك تقييمك بعد الحصة المكتملة.",
        stars: "اختر التقييم من نجمة إلى 5 نجوم",
        feedback: "ملاحظتك",
        placeholder: "اكتب ملاحظتك عن التجربة...",
        characters: "حرف",
        cancel: "إلغاء",
        submit: "إرسال التقييم",
        submitting: "جاري إرسال التقييم...",
        requiredRating: "اختر تقييمًا من 1 إلى 5 نجوم.",
        requiredFeedback: "اكتب ملاحظة قبل إرسال التقييم.",
        tooLong: "الملاحظة يجب ألا تتجاوز 150 حرفًا.",
        success: "تم إرسال التقييم بنجاح.",
        failed: "تعذر إرسال التقييم. حاول مرة أخرى.",
        close: "إغلاق",
      }
    : {
        trigger: triggerLabel || "Rate " + targetLabel,
        title: "Rate " + targetLabel,
        intro: targetName
          ? "Share your feedback about " + targetName + "."
          : "Share your feedback after the completed session.",
        stars: "Choose a rating from 1 to 5 stars",
        feedback: "Your feedback",
        placeholder: "Write a short note about the experience...",
        characters: "characters",
        cancel: "Cancel",
        submit: "Submit rating",
        submitting: "Submitting...",
        requiredRating: "Choose a rating from 1 to 5 stars.",
        requiredFeedback: "Write a note before submitting your rating.",
        tooLong: "Your feedback must be 150 characters or less.",
        success: "Rating submitted successfully.",
        failed: "Could not submit the rating. Please try again.",
        close: "Close",
      };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitMutation.isPending) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, submitMutation.isPending]);

  const close = () => {
    if (submitMutation.isPending) return;
    setOpen(false);
    setError("");
    setRating(0);
    setHoverRating(0);
    setDescription("");
  };

  const submit = async () => {
    const trimmed = description.trim();

    if (rating < 1 || rating > 5) {
      setError(copy.requiredRating);
      return;
    }
    if (!trimmed) {
      setError(copy.requiredFeedback);
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
        actorRole,
        targetType,
        targetId,
        bookingId,
        rate: rating,
        description: trimmed,
      });

      if (!response.status) {
        const message = response.message || copy.failed;
        setError(message);
        toast.error(message);
        return;
      }

      toast.success(copy.success);
      close();
    } catch (requestError) {
      const message = getErrorMessage(requestError, copy.failed);
      setError(message);
      toast.error(message);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className || "inline-flex items-center gap-2 rounded-md bg-main px-4 py-2 text-sm font-semibold text-white hover:bg-main/90"}
      >
        <Star className="h-4 w-4 fill-current" aria-hidden="true" />
        {copy.trigger}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 py-6"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 id={titleId} className="font-sora text-xl font-bold text-black-blue sm:text-2xl">
                  {copy.title}
                </h2>
                <p id={descriptionId} className="mt-1 font-sora text-sm leading-6 text-[#5E6766]">
                  {copy.intro}
                </p>
              </div>

              <button
                type="button"
                onClick={close}
                disabled={submitMutation.isPending}
                aria-label={copy.close}
                className="rounded-full p-2 text-[#5E6766] transition hover:bg-gray-100 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-gray-100 bg-[#FAFCFB] p-4">
              <p className="font-sora text-sm font-semibold text-black-blue">{copy.stars}</p>

              <div className="mt-3 flex items-center gap-1" role="radiogroup" aria-label={copy.stars}>
                {Array.from({ length: 5 }, (_, index) => {
                  const value = index + 1;
                  const active = value <= (hoverRating || rating);

                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={rating === value}
                      aria-label={value + " / 5"}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      onFocus={() => setHoverRating(value)}
                      onBlur={() => setHoverRating(0)}
                      onClick={() => setRating(value)}
                      className="rounded-md p-1 transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-main/40"
                    >
                      <Star
                        className={
                          "h-8 w-8 sm:h-9 sm:w-9 " +
                          (active ? "fill-current text-main" : "text-gray-300")
                        }
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor={"rating-description-" + bookingId}
                className="font-sora text-sm font-semibold text-black-blue"
              >
                {copy.feedback}
              </label>

              <textarea
                id={"rating-description-" + bookingId}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={150}
                rows={4}
                placeholder={copy.placeholder}
                className="mt-2 w-full resize-y rounded-xl border border-gray-300 bg-white px-3 py-3 font-sora text-sm leading-6 text-black-blue outline-none transition focus:border-main focus:ring-2 focus:ring-main/15"
              />

              <div className="mt-1 flex justify-between gap-3 font-sora text-xs text-[#697372]">
                <span className="text-red-600">{error || " "}</span>
                <span>{description.length}/150 {copy.characters}</span>
              </div>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={close}
                disabled={submitMutation.isPending}
                className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 font-sora text-sm font-semibold text-black-blue hover:bg-gray-50 disabled:opacity-50"
              >
                {copy.cancel}
              </button>

              <button
                type="button"
                onClick={() => void submit()}
                disabled={submitMutation.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-main px-5 py-2.5 font-sora text-sm font-semibold text-white hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitMutation.isPending ? copy.submitting : copy.submit}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RatingDialog;
