import { CheckCircle2, Clock3, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useI18n } from "@/i18n";
import { getCoursesCopy } from "./courseCopy";
import { getPaymentStatus } from "@/services/student/enrolling";

type PaymentState = "pending" | "success" | "failed" | "unknown";

const PaymentResult = () => {
  const { language } = useI18n();
  const copy = getCoursesCopy(language);
  const [params] = useSearchParams();
  const orderId = Number(params.get("order"));
  const signature = params.get("sig") || "";
  const [state, setState] = useState<PaymentState>(
    orderId > 0 && signature ? "pending" : "unknown"
  );
  const [courseId, setCourseId] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (orderId <= 0 || !signature) {
      return;
    }

    let cancelled = false;
    let attempts = 0;
    let timer: number | undefined;

    const check = async () => {
      try {
        const response = await getPaymentStatus({
          orderId,
          signature,
        });

        if (cancelled) return;

        const status = response.data?.status;
        if (response.status && status) {
          setCourseId(response.data?.course_id ?? null);

          if (status === "success" || status === "failed") {
            setState(status);
            return;
          }
        }
      } catch {
        if (!cancelled) setState("unknown");
      }

      if (cancelled) return;

      attempts += 1;
      if (attempts >= 15) {
        setTimedOut(true);
        return;
      }

      setState((current) => current === "unknown" ? "pending" : current);
      timer = window.setTimeout(check, 2000);
    };

    void check();

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [orderId, signature]);

  useEffect(() => {
    document.title = `${copy.paymentResultTitle} | Elmullim`;
  }, [copy.paymentResultTitle]);

  const detailsUrl = courseId ? `/courses/${courseId}` : "/courses";

  const contentByState = {
    success: {
      icon: <CheckCircle2 className="mx-auto h-16 w-16 text-main" aria-hidden="true" />,
      title: copy.paymentSuccess,
      action: courseId ? copy.viewCourse : copy.returnToCourse,
      href: courseId ? `/courses/${courseId}/view` : detailsUrl,
    },
    failed: {
      icon: <XCircle className="mx-auto h-16 w-16 text-red-500" aria-hidden="true" />,
      title: copy.paymentFailed,
      action: copy.returnToCourse,
      href: detailsUrl,
    },
    pending: {
      icon: <Clock3 className="mx-auto h-16 w-16 text-main" aria-hidden="true" />,
      title: copy.paymentPending,
      action: copy.returnToCourse,
      href: detailsUrl,
    },
    unknown: {
      icon: <XCircle className="mx-auto h-16 w-16 text-amber-500" aria-hidden="true" />,
      title: copy.paymentUnknown,
      action: copy.returnToCourse,
      href: detailsUrl,
    },
  }[state];

  return (
    <main className="bg-white">
      <section className="container py-20 md:py-28">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm md:p-12">
          <h1 className="text-3xl font-bold text-black-blue md:text-4xl">
            {copy.paymentResultTitle}
          </h1>

          <div className="mt-8" aria-live="polite" role="status">
            {contentByState.icon}
            <p className="mt-6 text-base leading-7 text-[#4D5756]">
              {contentByState.title}
            </p>
          </div>

          {state === "pending" && !timedOut ? (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {copy.paymentPending}
            </div>
          ) : null}

          <Link
            to={contentByState.href}
            className="mt-8 inline-flex items-center justify-center rounded-[5px] bg-main px-6 py-3 font-sora text-sm text-white transition hover:bg-main/90"
          >
            {contentByState.action}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default PaymentResult;
