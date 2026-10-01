import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  CreditCard,
  Loader,
  LockKeyhole,
  Tag,
  X,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useGetCourseById } from "@/lib/react-query/courses/courses";
import { RootState } from "@/store/store";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";
import { formatDate } from "@/utils/dateTime";
import { getCoursesCopy } from "./courseCopy";
import { useEnrollFreeCourse, useInitiatePayment, useValidatePromoCode } from "@/lib/react-query/student/enrolling";
import type { IPaymentPricing, PaymentMethod } from "@/services/student/enrolling";

function EnrollCourse() {
  const { language } = useI18n();
  const copy = getCoursesCopy(language);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const token = cookieService.getToken() || undefined;
  const isStudent = cookieService.getRole() === "student";
  const { courseId } = useParams<{ courseId: string }>();
  const numericCourseId = Number(courseId);
  const validCourseId = Number.isInteger(numericCourseId) && numericCourseId > 0;
  const payment = useInitiatePayment();
  const freeEnrollment = useEnrollFreeCourse();
  const promoValidation = useValidatePromoCode();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [appliedPromo, setAppliedPromo] = useState<IPaymentPricing | null>(null);
  const [promoError, setPromoError] = useState("");
  const [freeEnrollmentError, setFreeEnrollmentError] = useState("");

  const { data: course, isLoading, isError, refetch } = useGetCourseById({
    courseId: numericCourseId,
    ...(token && { token }),
  });

  useEffect(() => {
    document.title = `${copy.enrollmentTitle} | Elmullim`;
  }, [copy.enrollmentTitle]);

  const handleFreeEnrollment = async () => {
    if (!token || !validCourseId || freeEnrollment.isPending) return;

    setFreeEnrollmentError("");

    try {
      const response = await freeEnrollment.mutateAsync({
        token,
        courseId: numericCourseId,
      });

      if (response.status) {
        navigate(`/courses/${numericCourseId}/view`, { replace: true });
        return;
      }

      setFreeEnrollmentError(response.message || copy.enrollmentErrorTitle);
    } catch {
      setFreeEnrollmentError(copy.enrollmentErrorTitle);
    }
  };

  const handlePayment = async () => {
    if (!token || !validCourseId) return;

    if (promoCode.trim() && !appliedPromo) {
      setPromoError(copy.applyPromoFirst);
      return;
    }

    setPromoError("");

    try {
      const response = await payment.mutateAsync({
        token,
        courseId: numericCourseId,
        promoCode: appliedPromo?.code || undefined,
        paymentMethod,
      });

      if (response.data?.payment_required === false) {
        navigate(`/courses/${numericCourseId}/view`, { replace: true });
        return;
      }

      if (response.data?.redirect_url) {
        window.location.assign(response.data.redirect_url);
      }
    } catch {
      // React Query exposes the failure through payment.isError.
    }
  };
  const handleApplyPromo = async () => {
    const code = promoCode.trim();

    if (!code || !token || !validCourseId) {
      setPromoError(copy.enterPromoCode);
      return;
    }

    setPromoError("");
    setAppliedPromo(null);

    try {
      const response = await promoValidation.mutateAsync({
        token,
        courseId: numericCourseId,
        code,
      });

      if (!response.status || !response.data) {
        setPromoError(response.message || copy.invalidPromoCode);
        return;
      }

      setAppliedPromo(response.data);
      setPromoCode(response.data.code);
    } catch {
      setPromoError(copy.invalidPromoCode);
    }
  };

  const clearPromo = () => {
    setPromoCode("");
    setAppliedPromo(null);
    setPromoError("");
    promoValidation.reset();
  };

  if (!validCourseId) {
    return (
      <main className="min-h-[60vh] bg-[#F7FAF9]">
        <div className="container flex min-h-[60vh] items-center justify-center py-20 text-center">
          <div>
            <p className="font-sora text-lg text-[#4D5756]" role="alert">
              {copy.enrollmentError}
            </p>
            <Link
              to="/courses"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-main px-6 py-3 text-sm font-semibold text-white transition hover:bg-main/90"
            >
              <ArrowLeft size={18} aria-hidden="true" />
              {copy.backToCourses}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-[60vh] bg-[#F7FAF9]">
        <div className="container flex min-h-[60vh] items-center justify-center py-20" role="status" aria-live="polite">
          <Loader className="animate-spin text-main" size={40} aria-hidden="true" />
          <span className="sr-only">{copy.loadingCourse}</span>
        </div>
      </main>
    );
  }

  if (isError || !course?.data) {
    return (
      <main className="min-h-[60vh] bg-[#F7FAF9]">
        <div className="container flex min-h-[60vh] items-center justify-center py-20 text-center">
          <div className="max-w-lg">
            <p className="font-sora text-lg text-[#4D5756]" role="alert">
              {copy.enrollmentError}
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-xl bg-main px-6 py-3 text-sm font-semibold text-white transition hover:bg-main/90"
              >
                {copy.retry}
              </button>
              <Link
                to="/courses"
                className="rounded-xl border border-[#DDE5E3] bg-white px-6 py-3 text-sm font-semibold text-black-blue transition hover:border-main hover:text-main"
              >
                {copy.backToCourses}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const courseData = course.data;
  const isFree = Number(courseData.price) === 0;

  return (
    <main className="min-h-screen bg-[#F7FAF9]">
      <motion.section
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="border-b border-white/10 bg-black-blue"
      >
        <div className="container py-10 md:py-14">
          <div className="mx-auto max-w-6xl">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white"
            >
              <ArrowLeft className="rtl:rotate-180" size={16} aria-hidden="true" />
              {copy.backToCourses}
            </Link>

            <div className="mt-6 max-w-3xl">
              <p className="mb-2 text-sm font-medium text-main">{copy.enrollmentTitle}</p>
              <h1 className="text-3xl font-bold leading-tight text-white md:text-5xl">
                {courseData.title}
              </h1>
              <p className="mt-3 max-w-2xl font-sora text-sm leading-7 text-white/70 md:text-base">
                {isFree ? copy.freeEnrollmentPrompt : copy.paymentAvailableDescription}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="py-8 md:py-14" aria-labelledby="enrollment-title">
        <div className="container">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <motion.article
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="overflow-hidden rounded-3xl border border-[#E0E8E6] bg-white shadow-[0_16px_50px_rgba(25,77,80,0.08)]"
            >
              <div className="relative">
                <img
                  src={courseData.image || "/images/placeholder-img.webp"}
                  alt={courseData.title}
                  className="h-64 w-full object-cover md:h-80"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-5 pt-20">
                  <span className="inline-flex rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-black-blue">
                    {isFree ? copy.free : copy.paid}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <h2 id="enrollment-title" className="text-2xl font-bold text-black-blue md:text-3xl">
                  {copy.orderSummary}
                </h2>

                <div className="mt-6 rounded-2xl bg-[#F4FAF9] p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    <img
                      src={courseData.teacher?.profile_image || "/images/profile-avatar.webp"}
                      alt={courseData.teacher?.name ?? copy.teacherImageAlt}
                      className="h-12 w-12 shrink-0 rounded-full border-2 border-white object-cover object-top shadow-sm"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-black-blue">{courseData.title}</p>
                      <p className="mt-1 text-sm text-[#4D5756]">
                        {copy.by} {courseData.teacher?.name ?? "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <dl className="mt-6 divide-y divide-[#EDF1F0]">
                  <div className="flex items-center justify-between gap-4 py-4">
                    <dt className="text-sm text-[#66716F]">{copy.level}</dt>
                    <dd className="text-sm font-semibold text-black-blue">{courseData.level || "—"}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-4">
                    <dt className="text-sm text-[#66716F]">{copy.attendance}</dt>
                    <dd className="text-sm font-semibold text-black-blue">{copy.online}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-4">
                    <dt className="text-sm text-[#66716F]">{copy.startDate}</dt>
                    <dd className="text-sm font-semibold text-black-blue">
                      {courseData.created_at ? formatDate(courseData.created_at, language) : "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            </motion.article>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="rounded-3xl border border-[#E0E8E6] bg-white p-6 shadow-[0_16px_50px_rgba(25,77,80,0.08)] md:p-8 lg:sticky lg:top-24"
              aria-live="polite"
            >
              {courseData.hasEnrolled ? (
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F8F4]">
                    <Check className="text-main" size={30} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-black-blue">{copy.watch}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#66716F]">{copy.paymentSuccess}</p>
                  <Link
                    to={`/courses/${courseData.id}/view`}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-main px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-main/90"
                  >
                    {copy.watch}
                    <ArrowRight className="rtl:rotate-180" size={18} aria-hidden="true" />
                  </Link>
                </div>
              ) : !isAuthenticated || !isStudent ? (
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDF4F5]">
                    <LockKeyhole className="text-main" size={24} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-black-blue">{copy.paymentUnavailable}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#66716F]">
                    {copy.paymentUnavailableDescription}
                  </p>
                  <Link
                    to="/sign-in"
                    className="mt-6 flex w-full items-center justify-center rounded-xl bg-main px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-main/90"
                  >
                    {copy.enroll}
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-main">{copy.checkout}</p>
                      <h3 className="mt-1 text-2xl font-bold text-black-blue">{isFree ? copy.freeEnrollmentCheckoutTitle : copy.paymentAvailableTitle}</h3>
                    </div>
                    <div className="rounded-2xl border border-[#DFE8E6] bg-[#FBFDFC] px-4 py-2 text-right">
                      <p className="text-xs text-[#7B8583]">{copy.total}</p>
                      {appliedPromo ? (
                        <p className="mt-0.5 text-xs text-[#9AA5A2] line-through">
                          {Number(courseData.price).toFixed(2)} L.E
                        </p>
                      ) : null}
                      <p className="mt-0.5 text-xl font-bold text-black-blue">
                        {(appliedPromo?.final_amount ?? Number(courseData.price)).toFixed(2)} L.E
                      </p>
                    </div>
                  </div>

                  {isFree ? (
                    <div className="mt-6 rounded-2xl border border-[#CDEADF] bg-[#F0FAF5] p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-main text-white">
                          <Check size={20} aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-black-blue">{copy.free}</p>
                          <p className="mt-1 text-xs leading-5 text-[#65716E]">{copy.freeEnrollmentPrompt}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                  <div className="mt-6 rounded-2xl border border-[#DFE8E6] bg-[#FBFDFC] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-black-blue">{copy.paymentMethods}</p>
                        <p className="mt-1 text-xs leading-5 text-[#6E7977]">{copy.paymentAvailableDescription}</p>
                      </div>
                      <ShieldCheck className="shrink-0 text-main" size={24} aria-hidden="true" />
                    </div>

                    <div className="mt-4 space-y-3" role="radiogroup" aria-label={copy.paymentMethods}>
                    {([
                      { id: "card" as PaymentMethod, icon: CreditCard, title: copy.cardPayment, description: copy.cardPaymentDescription },
                      { id: "fawry" as PaymentMethod, icon: Banknote, title: copy.fawryPayment, description: copy.fawryPaymentDescription },
                      { id: "wallet" as PaymentMethod, icon: Smartphone, title: copy.walletPayment, description: copy.walletPaymentDescription },
                    ]).map(({ id, icon: Icon, title, description }) => {
                      const selected = paymentMethod === id;

                      return (
                        <button
                          key={id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setPaymentMethod(id)}
                          disabled={payment.isPending}
                          className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
                            selected
                              ? "border-main bg-[#F0FAF8] ring-2 ring-main/10"
                              : "border-[#DFE8E6] bg-white hover:border-main/40 hover:bg-[#FBFDFC]"
                          }`}
                        >
                          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            selected ? "bg-main text-white" : "bg-[#EEF5F6] text-main"
                          }`}>
                            <Icon size={20} aria-hidden="true" />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-black-blue">{title}</span>
                            <span className="mt-1 block text-xs leading-5 text-[#7B8583]">{description}</span>
                          </span>

                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              selected ? "border-main bg-main text-white" : "border-[#C9D5D2] bg-white"
                            }`}
                            aria-hidden="true"
                          >
                            {selected ? <Check size={13} strokeWidth={3} /> : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  </div>

                  )}

                  {!isFree && payment.isError ? (
                    <p role="alert" className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
                      {copy.paymentError}
                    </p>
                  ) : null}

                  {!isFree ? (
                  <div className="mt-5 rounded-2xl border border-[#DFE8E6] bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF5F6]">
                        <Tag className="text-main" size={18} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-black-blue">{copy.promoCodeTitle}</p>
                        <p className="text-xs text-[#7B8583]">{copy.promoCodeDescription}</p>
                      </div>
                      <span className="rounded-full bg-[#F4F8F7] px-2.5 py-1 text-[11px] font-medium text-[#6E7977]">{copy.optional}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(event) => {
                            setPromoCode(event.target.value.toUpperCase());
                            if (appliedPromo) {
                              setAppliedPromo(null);
                            }
                            if (promoError) {
                              setPromoError("");
                            }
                          }}
                          placeholder={copy.promoCodePlaceholder}
                          aria-label={copy.promoCodeTitle}
                          disabled={promoValidation.isPending || payment.isPending}
                          className="h-12 w-full rounded-xl border border-[#DDE6E4] bg-[#FAFCFB] px-4 pr-10 text-sm font-semibold tracking-wide text-black-blue outline-none transition placeholder:font-normal placeholder:tracking-normal focus:border-main focus:ring-2 focus:ring-main/10 disabled:opacity-60"
                        />
                        {promoCode ? (
                          <button
                            type="button"
                            onClick={clearPromo}
                            aria-label={copy.clearPromoCode}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#7B8583] transition hover:bg-[#EDF3F1] hover:text-black-blue"
                          >
                            <X size={16} aria-hidden="true" />
                          </button>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={() => void handleApplyPromo()}
                        disabled={!promoCode.trim() || promoValidation.isPending || payment.isPending}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-main px-5 text-sm font-semibold text-main transition hover:bg-[#EEF8F6] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {promoValidation.isPending ? (
                          <Loader size={17} className="animate-spin" aria-hidden="true" />
                        ) : null}
                        {promoValidation.isPending ? copy.applyingPromoCode : copy.applyPromoCode}
                      </button>
                    </div>

                    {promoError ? (
                      <p role="alert" className="mt-2 text-xs font-medium text-red-600">{promoError}</p>
                    ) : null}

                    {appliedPromo ? (
                      <div className="mt-3 rounded-xl border border-[#CDEADF] bg-[#F0FAF5] px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Check className="text-main" size={17} aria-hidden="true" />
                            <span className="text-sm font-semibold text-black-blue">
                              {appliedPromo.code} · {appliedPromo.discount_percent}% {copy.off}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={clearPromo}
                            className="text-xs font-semibold text-[#66716F] underline underline-offset-2 hover:text-black-blue"
                          >
                            {copy.removePromoCode}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  ) : null}

                  <div className="mt-4 rounded-2xl border border-[#DFE8E6] bg-[#FAFCFB] px-4 py-1">
                    <div className="flex items-center justify-between border-b border-[#E8EEEC] py-3 text-sm">
                      <span className="text-[#697572]">{copy.subtotal}</span>
                      <span className="font-semibold text-black-blue">{Number(courseData.price).toFixed(2)} L.E</span>
                    </div>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between border-b border-[#E8EEEC] py-3 text-sm">
                        <span className="text-[#697572]">{copy.discount}</span>
                        <span className="font-semibold text-main">-{appliedPromo.discount_amount.toFixed(2)} L.E</span>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between py-4">
                      <span className="text-base font-bold text-black-blue">{copy.total}</span>
                      <span className="text-xl font-extrabold text-black-blue">
                        {(appliedPromo?.final_amount ?? Number(courseData.price)).toFixed(2)} L.E
                      </span>
                    </div>
                  </div>

                  {freeEnrollmentError ? (
                    <p role="alert" className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
                      {freeEnrollmentError}
                    </p>
                  ) : null}

                  {isFree ? (
                    <button
                      type="button"
                      onClick={() => void handleFreeEnrollment()}
                      disabled={freeEnrollment.isPending}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-main px-6 py-4 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(25,77,80,0.2)] transition hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {freeEnrollment.isPending ? (
                        <Loader size={19} className="animate-spin" aria-hidden="true" />
                      ) : (
                        <Check size={18} aria-hidden="true" />
                      )}
                      {freeEnrollment.isPending ? copy.enrollingFree : copy.enrollForFree}
                      {!freeEnrollment.isPending ? <ArrowRight className="rtl:rotate-180" size={18} aria-hidden="true" /> : null}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handlePayment()}
                      disabled={payment.isPending}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-main px-6 py-4 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(25,77,80,0.2)] transition hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {payment.isPending ? (
                        <Loader size={19} className="animate-spin" aria-hidden="true" />
                      ) : (
                        <LockKeyhole size={18} aria-hidden="true" />
                      )}
                      {payment.isPending ? copy.paymentLoading : copy.payNow}
                      {!payment.isPending ? <ArrowRight className="rtl:rotate-180" size={18} aria-hidden="true" /> : null}
                    </button>
                  )}

                  <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-[#7B8583]">
                    <ShieldCheck size={15} className="text-main" aria-hidden="true" />
                    <span>{isFree ? copy.freeEnrollmentSecure : copy.secureCheckout}</span>
                  </div>
                </div>
              )}
            </motion.section>
          </div>
        </div>
      </section>
    </main>
  );
}

export default EnrollCourse;
