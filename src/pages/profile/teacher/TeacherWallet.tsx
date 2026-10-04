import { useState } from "react";
import { WalletCards, ArrowDownToLine, BookOpen, GraduationCap, Loader, ChevronLeft, ChevronRight } from "lucide-react";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";
import { useGetTeacherPayouts, useGetTeacherWallet } from "@/lib/react-query/teacherWallet";
import { formatDateTime } from "@/utils/dateTime";

const TeacherWallet = () => {
  const { language } = useI18n();
  const ar = language === "ar";
  const token = cookieService.getToken() || "";
  const [page, setPage] = useState(1);

  const wallet = useGetTeacherWallet({ token, enabled: !!token });
  const payouts = useGetTeacherPayouts({ token, page, enabled: !!token });

  const walletData = wallet.data?.data;
  const payoutItems = payouts.data?.data ?? [];
  const pagination = payouts.data?.meta;

  const copy = ar
    ? {
        eyebrow: "الحساب المالي",
        title: "المحفظة والأرباح",
        description: "تابع أرباحك وإحصائيات الحجوزات والمدفوعات المسحوبة من مكان واحد.",
        total: "إجمالي الأرباح",
        withdrawn: "إجمالي المسحوب",
        lessonEnrollments: "حجوزات الدروس",
        courseEnrollments: "اشتراكات الكورسات",
        payouts: "طلبات السحب",
        noPayouts: "لا توجد عمليات سحب حتى الآن.",
        amount: "المبلغ",
        status: "الحالة",
        date: "التاريخ",
        pending: "قيد التنفيذ",
        success: "ناجحة",
        failed: "فشلت",
        previous: "السابق",
        next: "التالي",
        page: "صفحة",
        of: "من",
        loading: "جاري تحميل البيانات...",
        error: "تعذر تحميل بيانات المحفظة.",
      }
    : {
        eyebrow: "Financial account",
        title: "Wallet & Earnings",
        description: "Track your earnings, enrollment activity and completed payouts in one place.",
        total: "Total earnings",
        withdrawn: "Total withdrawn",
        lessonEnrollments: "Lesson bookings",
        courseEnrollments: "Course enrollments",
        payouts: "Payout history",
        noPayouts: "No payouts yet.",
        amount: "Amount",
        status: "Status",
        date: "Date",
        pending: "Pending",
        success: "Successful",
        failed: "Failed",
        previous: "Previous",
        next: "Next",
        page: "Page",
        of: "of",
        loading: "Loading financial data...",
        error: "Could not load wallet data.",
      };

  const money = (value: number | string | null | undefined) =>
    Number(value ?? 0).toLocaleString(ar ? "ar-EG" : "en-EG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const statusLabel = (status: string) => {
    switch (status) {
      case "success":
        return copy.success;
      case "failed":
      case "failure":
        return copy.failed;
      default:
        return copy.pending;
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F8FA] py-10 md:py-14">
      <div className="container">
        <div className="mb-8">
          <p className="font-sora text-xs font-semibold uppercase tracking-[0.18em] text-main">
            {copy.eyebrow}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-main/10 text-main">
              <WalletCards className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-epilogue text-3xl font-bold text-black-blue md:text-5xl">
                {copy.title}
              </h1>
              <p className="mt-2 max-w-2xl font-sora text-sm leading-6 text-black-blue/55 md:text-base">
                {copy.description}
              </p>
            </div>
          </div>
        </div>

        {wallet.isLoading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm" role="status">
            <Loader className="mx-auto animate-spin text-main" size={32} />
            <p className="mt-3 font-sora text-sm text-black-blue/55">{copy.loading}</p>
          </div>
        ) : wallet.isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700" role="alert">
            {copy.error}
          </div>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-main/10 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-main">
                  <WalletCards size={18} />
                  <span className="font-sora text-xs font-semibold">{copy.total}</span>
                </div>
                <p className="mt-4 text-2xl font-bold text-black-blue">{money(walletData?.total)} {ar ? "ج.م" : "EGP"}</p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-black-blue">
                  <ArrowDownToLine size={18} />
                  <span className="font-sora text-xs font-semibold">{copy.withdrawn}</span>
                </div>
                <p className="mt-4 text-2xl font-bold text-black-blue">{money(walletData?.withdrawn)} {ar ? "ج.م" : "EGP"}</p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-black-blue">
                  <BookOpen size={18} />
                  <span className="font-sora text-xs font-semibold">{copy.lessonEnrollments}</span>
                </div>
                <p className="mt-4 text-2xl font-bold text-black-blue">{walletData?.lesson_enrollments ?? 0}</p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-black-blue">
                  <GraduationCap size={18} />
                  <span className="font-sora text-xs font-semibold">{copy.courseEnrollments}</span>
                </div>
                <p className="mt-4 text-2xl font-bold text-black-blue">{walletData?.course_enrollments ?? 0}</p>
              </div>
            </section>

            <section className="mt-7 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
                <h2 className="font-sora text-lg font-bold text-black-blue">{copy.payouts}</h2>
              </div>

              {payoutItems.length === 0 ? (
                <div className="p-10 text-center font-sora text-sm text-black-blue/50">{copy.noPayouts}</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {payoutItems.map((payout) => (
                    <div key={payout.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:px-6">
                      <div>
                        <p className="font-semibold text-black-blue">{money(payout.amount)} {ar ? "ج.م" : "EGP"}</p>
                        <p className="mt-1 text-xs text-black-blue/45">{formatDateTime(payout.created_at, language)}</p>
                      </div>
                      <span className="w-fit rounded-full bg-main/10 px-3 py-1 text-xs font-semibold text-main">
                        {statusLabel(payout.status)}
                      </span>
                      <span className="text-xs font-mono text-black-blue/40">
                        #{payout.id}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {pagination && pagination.last_page > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-3 border-t border-gray-100 p-4">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page <= 1 || payouts.isFetching}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm disabled:opacity-50"
                  >
                    {copy.previous}
                  </button>
                  <span className="font-sora text-xs text-black-blue/50">
                    {copy.page} {pagination.current_page} {copy.of} {pagination.last_page}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.min(pagination.last_page, current + 1))}
                    disabled={!pagination.has_more_pages || payouts.isFetching}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm disabled:opacity-50"
                  >
                    {copy.next}
                  </button>
                  <span className="hidden">
                    <ChevronLeft />
                    <ChevronRight />
                  </span>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default TeacherWallet;
