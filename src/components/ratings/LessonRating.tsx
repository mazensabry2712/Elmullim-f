import { useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { Loader2, MessageSquareText, RefreshCw, Star } from "lucide-react";
import { useI18n } from "@/i18n";
import {
  useLessonRatingStatus,
  useSubmitLessonRating,
} from "@/lib/react-query/lessonRating";

interface Props {
  lessonId: number;
  average?: number | null;
  count?: number;
  token: string;
  role: string;
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

const LessonRating = ({ lessonId, average, count = 0, token, role }: Props) => {
  const { language } = useI18n();
  const isArabic = language === "ar";
  const canCheckStatus = !!token && ["student", "parent", "family"].includes(role);
  const statusQuery = useLessonRatingStatus({
    token,
    lessonId,
    enabled: canCheckStatus,
  });
  const submitMutation = useSubmitLessonRating();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [description, setDescription] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const copy = isArabic
    ? {
        title: "تقييم الدرس",
        subtitle: "تقييم الدرس منفصل عن تقييم المعلم، ويظهر بعد اكتمال الحصة وتسجيلها كمكتملة.",
        noRatings: "لا توجد تقييمات لهذا الدرس بعد",
        ratings: "تقييم",
        login: "سجّل الدخول كطالب أو ولي أمر. يمكنك تقييم الدرس بعد اكتمال حصة محجوزة وتسجيلها كمكتملة.",
        otherRole: "تقييم الدرس متاح للطلاب وأولياء الأمور بعد اكتمال الحصة.",
        loading: "جاري تحميل حالة تقييم الدرس...",
        loadError: "تعذر تحميل حالة التقييم. حاول مرة أخرى.",
        retry: "إعادة المحاولة",
        noBooking: "احجز الدرس، وبعد اكتمال الحصة وتسجيل الجلسة كمكتملة سيظهر لك نموذج التقييم هنا.",
        pending: "الحجز موجود، لكن التقييم لا يتاح إلا بعد تسجيل الحجز والجلسة كمكتملين.",
        alreadyRated: "تم إرسال تقييم هذه الحصة بالفعل.",
        prompt: "قيّم تجربتك في هذه الحصة",
        chooseBooking: "اختر الحصة المكتملة التي تريد تقييمها",
        booking: "حجز",
        feedback: "تعليقك",
        placeholder: "إيه اللي عجبك في الدرس؟ وإيه اللي ممكن يتحسن؟",
        chooseStars: "اختار تقييمًا من نجمة إلى 5 نجوم.",
        writeFeedback: "اكتب تعليقًا قصيرًا قبل الإرسال.",
        tooLong: "التعليق يجب ألا يتجاوز 150 حرفًا.",
        submit: "إرسال التقييم",
        submitting: "جاري إرسال التقييم...",
        thankYou: "شكرًا على تقييمك للدرس!",
        failed: "تعذر إرسال التقييم. حاول مرة أخرى.",
        chars: "حرف",
        stars: "نجوم",
        yourRating: "تقييمك",
        completedSession: "حصة مكتملة",
      }
    : {
        title: "Lesson rating",
        subtitle: "This rating is for the lesson itself, separate from the teacher's rating. It unlocks after the session is marked completed.",
        noRatings: "No ratings for this lesson yet",
        ratings: "ratings",
        login: "Sign in as a student or parent. You can rate a lesson after a booked session is marked completed.",
        otherRole: "Lesson ratings are available to students and parents after the session is completed.",
        loading: "Loading lesson rating status...",
        loadError: "We couldn't load rating status. Please try again.",
        retry: "Retry",
        noBooking: "Book the lesson. The rating form will appear here after the session is marked completed.",
        pending: "Your booking exists, but the booking and session must both be marked completed before rating.",
        alreadyRated: "This session has already been rated.",
        prompt: "Rate your experience with this lesson",
        chooseBooking: "Choose the completed session to rate",
        booking: "Booking",
        feedback: "Your feedback",
        placeholder: "What did you like about the lesson, and what could be improved?",
        chooseStars: "Choose a rating from 1 to 5 stars.",
        writeFeedback: "Please add a short comment before submitting.",
        tooLong: "Your comment must be 150 characters or less.",
        submit: "Submit rating",
        submitting: "Submitting rating...",
        thankYou: "Thank you for rating this lesson!",
        failed: "We couldn't submit your rating. Please try again.",
        chars: "characters",
        stars: "stars",
        yourRating: "Your rating",
        completedSession: "Completed session",
      };

  const status = statusQuery.data?.data;
  const bookings = status?.bookings ?? [];
  const rateableBookings = useMemo(
    () => bookings.filter((booking) => booking.can_rate),
    [bookings]
  );
  const pendingBookings = useMemo(
    () => bookings.filter((booking) => !booking.has_rated && !booking.can_rate),
    [bookings]
  );
  const selectedBooking =
    rateableBookings.find((booking) => booking.booking_id === selectedBookingId)
    ?? rateableBookings[0];
  const ratedBooking = bookings.find((booking) => booking.has_rated);

  const averageValue = status?.rating_average ?? average ?? null;
  const ratingCount = status?.rating_count ?? count;

  const submit = async () => {
    const trimmed = description.trim();
    if (!selectedBooking) return;
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
    setSuccess(false);

    try {
      const response = await submitMutation.mutateAsync({
        token,
        lessonId,
        bookingId: selectedBooking.booking_id,
        rate: rating,
        description: trimmed,
      });

      if (!response.status) {
        const message = response.message || copy.failed;
        setError(message);
        return;
      }

      setSuccess(true);
      setDescription("");
      setRating(0);
      setSelectedBookingId(null);
      await statusQuery.refetch();
    } catch (requestError) {
      setError(getErrorMessage(requestError, copy.failed));
    }
  };

  return (
    <section
      className="overflow-hidden rounded-3xl border border-main/15 bg-white p-5 shadow-sm md:p-6"
      aria-labelledby={"lesson-rating-title-" + lessonId}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-main/10 text-main">
          <MessageSquareText className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 id={"lesson-rating-title-" + lessonId} className="text-xl font-black text-black-blue">
            {copy.title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-[#5E6766]">{copy.subtitle}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2" aria-label={copy.title}>
            <span className="inline-flex items-center gap-1" aria-label={copy.title + ": " + (averageValue ?? 0) + " / 5"}>
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index + 1}
                  className={"h-4 w-4 " + (averageValue !== null && index < Math.round(averageValue) ? "fill-current text-main" : "text-gray-300")}
                  aria-hidden="true"
                />
              ))}
            </span>
            <span className="text-sm font-black text-black-blue">
              {averageValue !== null ? Number(averageValue).toFixed(1) : "—"}
            </span>
            <span className="text-xs font-semibold text-[#68716F]">
              {ratingCount} {copy.ratings}
            </span>
            {ratingCount === 0 && <span className="text-xs text-[#68716F]">{copy.noRatings}</span>}
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-black-blue/[0.07] pt-5">
        {!canCheckStatus ? (
          <p className="rounded-xl bg-[#F7F9F9] p-4 text-sm leading-6 text-[#4D5756]">
            {token ? copy.otherRole : copy.login}
          </p>
        ) : statusQuery.isLoading ? (
          <div className="flex items-center gap-2 text-sm text-[#5E6766]" role="status">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {copy.loading}
          </div>
        ) : statusQuery.isError || !statusQuery.data?.status || !status ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F7F9F9] p-4">
            <p className="text-sm text-red-700" role="alert">{copy.loadError}</p>
            <button
              type="button"
              onClick={() => void statusQuery.refetch()}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-black-blue hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              {copy.retry}
            </button>
          </div>
        ) : rateableBookings.length > 0 && selectedBooking ? (
          <form
            className="rounded-2xl bg-[#F7F9F9] p-4 md:p-5"
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}
          >
            {rateableBookings.length > 1 && (
              <label className="mb-4 block text-sm font-bold text-black-blue">
                {copy.chooseBooking}
                <select
                  value={selectedBooking.booking_id}
                  onChange={(event) => setSelectedBookingId(Number(event.target.value))}
                  className="mt-2 min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-black-blue"
                >
                  {rateableBookings.map((booking) => (
                    <option key={booking.booking_id} value={booking.booking_id}>
                      {copy.booking} #{booking.booking_id} — {booking.student_name || copy.completedSession}
                    </option>
                  ))}
                </select>
              </label>
            )}
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
                      aria-label={value + " / 5 " + copy.stars}
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
              <label htmlFor={"lesson-rating-feedback-" + lessonId} className="text-sm font-bold text-black-blue">
                {copy.feedback}
              </label>
              <textarea
                id={"lesson-rating-feedback-" + lessonId}
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

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-emerald-700" role={success ? "status" : undefined}>
                {success ? copy.thankYou : " "}
              </span>
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-main px-5 py-3 text-sm font-bold text-white transition hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {submitMutation.isPending ? copy.submitting : copy.submit}
              </button>
            </div>
          </form>
        ) : ratedBooking ? (
          <div className="rounded-2xl border border-emerald-100 bg-[#F7F9F9] p-4">
            <p className="font-bold text-black-blue">{copy.alreadyRated}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index + 1}
                    className={"h-4 w-4 " + (index < (ratedBooking.rating ?? 0) ? "fill-current text-main" : "text-gray-300")}
                    aria-hidden="true"
                  />
                ))}
              </span>
              <span className="text-sm font-bold text-black-blue">{ratedBooking.rating}/5</span>
            </div>
            {ratedBooking.description && (
              <p className="mt-3 rounded-lg bg-white p-3 text-sm leading-6 text-[#4D5756]">
                {ratedBooking.description}
              </p>
            )}
            {pendingBookings.length > 0 && (
              <p className="mt-3 text-sm leading-6 text-[#5E6766]">{copy.pending}</p>
            )}
          </div>
        ) : bookings.length > 0 ? (
          <p className="rounded-xl bg-[#F7F9F9] p-4 text-sm leading-6 text-[#4D5756]">{copy.pending}</p>
        ) : (
          <p className="rounded-xl bg-[#F7F9F9] p-4 text-sm leading-6 text-[#4D5756]">{copy.noBooking}</p>
        )}
      </div>
    </section>
  );
};

export default LessonRating;
