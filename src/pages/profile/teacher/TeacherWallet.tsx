import { useState, type FormEvent } from "react";
import {
  ArrowDownToLine,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Loader,
  WalletCards,
  X,
} from "lucide-react";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";
import {
  useCreateTeacherPayout,
  useGetTeacherPayouts,
  useGetTeacherWallet,
} from "@/lib/react-query/teacherWallet";
import type {
  CreateTeacherPayoutPayload,
  TeacherPayoutMethod,
} from "@/services/teacherWallet";
import { formatDateTime } from "@/utils/dateTime";

const extractMessage = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) return value;
  if (Array.isArray(value)) {
    return value
      .map(extractMessage)
      .filter((message): message is string => Boolean(message))
      .join(" ");
  }
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
      .map(extractMessage)
      .filter((message): message is string => Boolean(message))
      .join(" ");
  }
  return null;
};

const getRequestError = (error: unknown, fallback: string): string => {
  if (error && typeof error === "object") {
    const candidate = error as {
      message?: unknown;
      response?: { data?: { message?: unknown; errors?: unknown } };
    };
    const body = candidate.response?.data;
    const responseMessage = extractMessage(body?.message) ?? extractMessage(body?.errors);
    if (responseMessage) return responseMessage;

    if (
      typeof candidate.message === "string" &&
      candidate.message &&
      !candidate.message.startsWith("Request failed with status code")
    ) {
      return candidate.message;
    }
  }
  return fallback;
};

const TeacherWallet = () => {
  const { language } = useI18n();
  const ar = language === "ar";
  const token = cookieService.getToken() || "";
  const [page, setPage] = useState(1);
  const [payoutFormOpen, setPayoutFormOpen] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<TeacherPayoutMethod>("wallet");
  const [walletIssuer, setWalletIssuer] = useState<CreateTeacherPayoutPayload["wallet_issuer"]>("vodafone");
  const [amount, setAmount] = useState("");
  const [walletNumber, setWalletNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [bankAccountOrCard, setBankAccountOrCard] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const wallet = useGetTeacherWallet({ token, enabled: !!token });
  const payouts = useGetTeacherPayouts({ token, page, enabled: !!token });
  const createPayout = useCreateTeacherPayout();

  const walletData = wallet.data?.data;
  const payoutItems = payouts.data?.data ?? [];
  const pagination = payouts.data?.meta;
  const reservedBalance = Number(walletData?.reserved ?? 0);
  const availableBalance = Number(
    walletData?.available_balance ??
      Math.max(0, Number(walletData?.total ?? 0) - Number(walletData?.withdrawn ?? 0) - reservedBalance),
  );
  const payoutsEnabled = walletData?.payouts_enabled !== false;
  const minimumAmount = payoutMethod === "instant_bank" ? 112 : 5;

  const copy = ar
    ? {
        eyebrow: "الحساب المالي",
        title: "المحفظة والأرباح",
        description: "تابع أرباحك ورصيدك المتاح للسحب وطلبات التحويل من مكان واحد.",
        total: "إجمالي الأرباح",
        available: "الرصيد المتاح للسحب",
        reserved: "رصيد محجوز لطلبات معلقة",
        withdrawn: "إجمالي المسحوب",
        lessonEnrollments: "حجوزات الدروس",
        courseEnrollments: "اشتراكات الكورسات",
        payouts: "سجل طلبات السحب",
        noPayouts: "لا توجد عمليات سحب حتى الآن.",
        payoutsLoadError: "تعذر تحميل سجل السحب.",
        amount: "المبلغ",
        method: "طريقة الاستلام",
        status: "الحالة",
        date: "التاريخ",
        wallet: "محفظة إلكترونية",
        bankCard: "بطاقة / حساب بنكي",
        instantBank: "تحويل بنكي فوري",
        postal: "تحويل بريدي",
        unknownMethod: "وسيلة استلام",
        pending: "قيد التنفيذ",
        success: "تم التحويل",
        failed: "فشل التحويل",
        cancelled: "ملغي",
        previous: "السابق",
        next: "التالي",
        page: "صفحة",
        of: "من",
        loading: "جاري تحميل البيانات...",
        error: "تعذر تحميل بيانات المحفظة.",
        requestPayout: "طلب سحب",
        close: "إغلاق",
        formTitle: "طلب سحب الأرباح",
        formDescription: "أدخل بيانات استلام هذا الطلب والمبلغ المطلوب تحويله.",
        payoutMethod: "طريقة استلام الأرباح",
        selectWallet: "نوع المحفظة",
        vodafone: "فودافون كاش",
        etisalat: "اتصالات كاش",
        orange: "أورنج كاش",
        bankWallet: "محفظة بنكية",
        walletNumber: "رقم المحفظة المستلمة",
        fullName: "الاسم الكامل للمستلم",
        bankCode: "كود البنك",
        bankAccountOrCard: "رقم الحساب أو البطاقة حسب وسيلة التحويل",
        nationalId: "الرقم القومي",
        amountInput: "مبلغ السحب (جنيه)",
        minimumHint: "الحد الأدنى لهذه الوسيلة هو",
        maximumHint: "الرصيد المتاح",
        personalDataHint: "بيانات الاستلام مطلوبة لتنفيذ الطلب ولا تظهر في سجل السحب.",
        submit: "إرسال طلب السحب",
        submitting: "جاري إرسال الطلب...",
        cancel: "إلغاء",
        submitted: "تم إرسال طلب السحب. راجع الحالة في سجل الطلبات بالأسفل.",
        requestError: "تعذر إرسال طلب السحب. راجع البيانات وحاول مرة أخرى.",
        amountInvalid: "أدخل مبلغًا صحيحًا لا يقل عن الحد الأدنى لهذه الوسيلة.",
        amountPrecision: "المبلغ يجب ألا يزيد عن منزلتين عشريتين.",
        insufficientBalance: "المبلغ أكبر من رصيدك المتاح للسحب.",
        walletInvalid: "أدخل رقم محفظة مصريًا صحيحًا مكونًا من 11 رقمًا ويبدأ بـ 010 أو 011 أو 012 أو 015.",
        fullNameRequired: "أدخل الاسم الكامل للمستلم.",
        bankCodeInvalid: "أدخل كود البنك الصحيح.",
        bankAccountInvalid: "أدخل رقم حساب أو بطاقة صحيحًا.",
        nationalIdInvalid: "أدخل رقمًا قوميًّا صحيحًا مكونًا من 14 رقمًا.",
        payoutUnavailable: "طلبات السحب غير متاحة حاليًا؛ إعدادات التحويلات لدى المنصة لم تكتمل أو تم إيقافها.",
        noBalance: "لا يوجد رصيد متاح كافٍ لطلب سحب. الحد الأدنى 5 جنيهات.",
      }
    : {
        eyebrow: "Financial account",
        title: "Wallet & Earnings",
        description: "Track earnings, available balance and payout requests in one place.",
        total: "Total earnings",
        available: "Available to withdraw",
        reserved: "Reserved for pending payouts",
        withdrawn: "Total withdrawn",
        lessonEnrollments: "Lesson bookings",
        courseEnrollments: "Course enrollments",
        payouts: "Payout history",
        noPayouts: "No payouts yet.",
        payoutsLoadError: "Could not load payout history.",
        amount: "Amount",
        method: "Payout method",
        status: "Status",
        date: "Date",
        wallet: "E-wallet",
        bankCard: "Bank card / account",
        instantBank: "Instant bank transfer",
        postal: "Postal transfer",
        unknownMethod: "Payout method",
        pending: "Pending",
        success: "Transferred",
        failed: "Failed",
        cancelled: "Cancelled",
        previous: "Previous",
        next: "Next",
        page: "Page",
        of: "of",
        loading: "Loading financial data...",
        error: "Could not load wallet data.",
        requestPayout: "Request payout",
        close: "Close",
        formTitle: "Withdraw earnings",
        formDescription: "Enter the recipient details and amount for this payout request.",
        payoutMethod: "Payout method",
        selectWallet: "Wallet provider",
        vodafone: "Vodafone Cash",
        etisalat: "Etisalat Cash",
        orange: "Orange Cash",
        bankWallet: "Bank wallet",
        walletNumber: "Destination wallet number",
        fullName: "Recipient full name",
        bankCode: "Bank code",
        bankAccountOrCard: "Account or card number for this transfer method",
        nationalId: "National ID",
        amountInput: "Payout amount (EGP)",
        minimumHint: "Minimum for this method:",
        maximumHint: "Available balance",
        personalDataHint: "Recipient details are required for this request and are not shown in payout history.",
        submit: "Submit payout request",
        submitting: "Submitting request...",
        cancel: "Cancel",
        submitted: "Payout request submitted. Check its status in the history below.",
        requestError: "Could not submit the payout request. Check the details and try again.",
        amountInvalid: "Enter a valid amount at least equal to this method's minimum.",
        amountPrecision: "Amount cannot have more than two decimal places.",
        insufficientBalance: "The amount exceeds your available balance.",
        walletInvalid: "Enter a valid 11-digit Egyptian wallet number starting with 010, 011, 012 or 015.",
        fullNameRequired: "Enter the recipient's full name.",
        bankCodeInvalid: "Enter a valid bank code.",
        bankAccountInvalid: "Enter a valid account or card number.",
        nationalIdInvalid: "Enter a valid 14-digit national ID.",
        payoutUnavailable: "Payouts are unavailable because platform transfer settings are incomplete or disabled.",
        noBalance: "There is not enough available balance to request a payout. The minimum is EGP 5.",
      };

  const money = (value: number | string | null | undefined) =>
    Number(value ?? 0).toLocaleString(ar ? "ar-EG" : "en-EG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const methodLabel = (method?: string) => {
    switch (method) {
      case "wallet":
        return copy.wallet;
      case "bank_card":
        return copy.bankCard;
      case "instant_bank":
        return copy.instantBank;
      case "post":
        return copy.postal;
      default:
        return copy.unknownMethod;
    }
  };

  const statusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
      case "successful":
        return copy.success;
      case "failed":
      case "failure":
        return copy.failed;
      case "cancelled":
        return copy.cancelled;
      default:
        return copy.pending;
    }
  };

  const statusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
      case "successful":
        return "bg-emerald-50 text-emerald-700";
      case "failed":
      case "failure":
      case "cancelled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-amber-50 text-amber-800";
    }
  };

  const resetPayoutFields = () => {
    setAmount("");
    setWalletNumber("");
    setFullName("");
    setBankCode("");
    setBankAccountOrCard("");
    setNationalId("");
    setWalletIssuer("vodafone");
    setPayoutMethod("wallet");
  };

  const handlePayoutSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setNotice("");

    if (!token) {
      setFormError(copy.requestError);
      return;
    }
    if (!payoutsEnabled) {
      setFormError(copy.payoutUnavailable);
      return;
    }

    const requestedAmount = Number(amount);
    if (!Number.isFinite(requestedAmount) || requestedAmount < minimumAmount) {
      setFormError(copy.amountInvalid);
      return;
    }
    if (Math.abs(requestedAmount * 100 - Math.round(requestedAmount * 100)) > 0.0001) {
      setFormError(copy.amountPrecision);
      return;
    }
    if (requestedAmount > availableBalance) {
      setFormError(copy.insufficientBalance);
      return;
    }

    const payload: CreateTeacherPayoutPayload = {
      amount: Math.round(requestedAmount * 100) / 100,
      payout_method: payoutMethod,
    };

    if (payoutMethod === "wallet") {
      if (!/^01[0125][0-9]{8}$/.test(walletNumber.trim())) {
        setFormError(copy.walletInvalid);
        return;
      }
      payload.wallet_issuer = walletIssuer ?? "vodafone";
      payload.wallet_number = walletNumber.trim();

      if (walletIssuer === "bank_wallet") {
        if (fullName.trim().length < 3) {
          setFormError(copy.fullNameRequired);
          return;
        }
        payload.full_name = fullName.trim();
      }
    } else if (payoutMethod === "bank_card" || payoutMethod === "instant_bank") {
      if (fullName.trim().length < 3) {
        setFormError(copy.fullNameRequired);
        return;
      }
      if (!/^[A-Za-z0-9_-]{2,20}$/.test(bankCode.trim())) {
        setFormError(copy.bankCodeInvalid);
        return;
      }
      if (!/^[A-Za-z0-9 -]{8,34}$/.test(bankAccountOrCard.trim())) {
        setFormError(copy.bankAccountInvalid);
        return;
      }

      payload.full_name = fullName.trim();
      payload.bank_code = bankCode.trim().toUpperCase();
      payload.bank_card_number = bankAccountOrCard.trim();
    } else {
      if (fullName.trim().length < 3) {
        setFormError(copy.fullNameRequired);
        return;
      }
      if (!/^[0-9]{14}$/.test(nationalId.trim())) {
        setFormError(copy.nationalIdInvalid);
        return;
      }
      payload.full_name = fullName.trim();
      payload.national_id = nationalId.trim();
    }

    try {
      const response = await createPayout.mutateAsync({ token, payload });
      if (!response?.status) {
        setFormError(extractMessage(response?.message) ?? copy.requestError);
        return;
      }

      setPage(1);
      resetPayoutFields();
      setPayoutFormOpen(false);
      setNotice(copy.submitted);
    } catch (error) {
      setFormError(getRequestError(error, copy.requestError));
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F8FA] py-8 md:py-12">
      <div className="container">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-sora text-xs font-semibold uppercase tracking-[0.18em] text-main">
              {copy.eyebrow}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-main/10 text-main">
                <WalletCards className="h-5 w-5" />
              </span>
              <div>
                <h1 className="font-epilogue text-3xl font-bold text-black-blue md:text-4xl">
                  {copy.title}
                </h1>
                <p className="mt-2 max-w-2xl font-sora text-sm leading-6 text-black-blue/55 md:text-base">
                  {copy.description}
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setPayoutFormOpen((open) => !open);
              setFormError("");
              setNotice("");
            }}
            disabled={wallet.isLoading || wallet.isError}
            aria-expanded={payoutFormOpen}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-main px-5 py-3 font-sora text-sm font-semibold text-white transition hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowDownToLine size={18} />
            {payoutFormOpen ? copy.close : copy.requestPayout}
          </button>
        </div>

        {!payoutsEnabled && !wallet.isLoading && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900" role="alert">
            {copy.payoutUnavailable}
          </div>
        )}
        {notice && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800" role="status" aria-live="polite">
            <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
            <span>{notice}</span>
          </div>
        )}

        {payoutFormOpen && (
          <section className="mb-7 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-7" aria-labelledby="payout-form-title">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 id="payout-form-title" className="font-sora text-xl font-bold text-black-blue">
                  {copy.formTitle}
                </h2>
                <p className="mt-1 font-sora text-sm leading-6 text-black-blue/55">
                  {copy.formDescription}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPayoutFormOpen(false);
                  setFormError("");
                }}
                aria-label={copy.close}
                className="rounded-lg p-2 text-black-blue/55 hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <form noValidate onSubmit={handlePayoutSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="payout-method" className="mb-2 block text-sm font-semibold text-black-blue">
                    {copy.payoutMethod}
                  </label>
                  <select
                    id="payout-method"
                    name="payout_method"
                    value={payoutMethod}
                    onChange={(event) => {
                      setPayoutMethod(event.target.value as TeacherPayoutMethod);
                      setFormError("");
                    }}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black-blue outline-none transition focus:border-main focus:ring-2 focus:ring-main/15"
                  >
                    <option value="wallet">{copy.wallet}</option>
                    <option value="bank_card">{copy.bankCard}</option>
                    <option value="instant_bank">{copy.instantBank}</option>
                    <option value="post">{copy.postal}</option>
                  </select>
                </div>

                {payoutMethod === "wallet" && (
                  <div>
                    <label htmlFor="wallet-issuer" className="mb-2 block text-sm font-semibold text-black-blue">
                      {copy.selectWallet}
                    </label>
                    <select
                      id="wallet-issuer"
                      name="wallet_issuer"
                      value={walletIssuer}
                      onChange={(event) => {
                        setWalletIssuer(event.target.value as CreateTeacherPayoutPayload["wallet_issuer"]);
                        setFormError("");
                      }}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black-blue outline-none transition focus:border-main focus:ring-2 focus:ring-main/15"
                    >
                      <option value="vodafone">{copy.vodafone}</option>
                      <option value="etisalat">{copy.etisalat}</option>
                      <option value="orange">{copy.orange}</option>
                      <option value="bank_wallet">{copy.bankWallet}</option>
                    </select>
                  </div>
                )}

                {(payoutMethod === "bank_card" || payoutMethod === "instant_bank" || payoutMethod === "post" || (payoutMethod === "wallet" && walletIssuer === "bank_wallet")) && (
                  <div>
                    <label htmlFor="payout-full-name" className="mb-2 block text-sm font-semibold text-black-blue">
                      {copy.fullName}
                    </label>
                    <input
                      id="payout-full-name"
                      name="full_name"
                      autoComplete="name"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      required
                      minLength={3}
                      maxLength={150}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black-blue outline-none transition focus:border-main focus:ring-2 focus:ring-main/15"
                    />
                  </div>
                )}

                {payoutMethod === "wallet" && (
                  <div>
                    <label htmlFor="payout-wallet-number" className="mb-2 block text-sm font-semibold text-black-blue">
                      {copy.walletNumber}
                    </label>
                    <input
                      id="payout-wallet-number"
                      name="wallet_number"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      value={walletNumber}
                      onChange={(event) => setWalletNumber(event.target.value.replace(/\s/g, ""))}
                      placeholder="010XXXXXXXX"
                      maxLength={11}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black-blue outline-none transition focus:border-main focus:ring-2 focus:ring-main/15"
                    />
                  </div>
                )}

                {(payoutMethod === "bank_card" || payoutMethod === "instant_bank") && (
                  <>
                    <div>
                      <label htmlFor="payout-bank-code" className="mb-2 block text-sm font-semibold text-black-blue">
                        {copy.bankCode}
                      </label>
                      <input
                        id="payout-bank-code"
                        name="bank_code"
                        autoComplete="organization"
                        value={bankCode}
                        onChange={(event) => setBankCode(event.target.value)}
                        placeholder="CIB"
                        maxLength={20}
                        required
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black-blue uppercase outline-none transition focus:border-main focus:ring-2 focus:ring-main/15"
                      />
                    </div>
                    <div>
                      <label htmlFor="payout-bank-account" className="mb-2 block text-sm font-semibold text-black-blue">
                        {copy.bankAccountOrCard}
                      </label>
                      <input
                        id="payout-bank-account"
                        name="bank_card_number"
                        autoComplete="off"
                        inputMode="text"
                        value={bankAccountOrCard}
                        onChange={(event) => setBankAccountOrCard(event.target.value)}
                        minLength={8}
                        maxLength={34}
                        required
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black-blue outline-none transition focus:border-main focus:ring-2 focus:ring-main/15"
                      />
                    </div>
                  </>
                )}

                {payoutMethod === "post" && (
                  <div>
                    <label htmlFor="payout-national-id" className="mb-2 block text-sm font-semibold text-black-blue">
                      {copy.nationalId}
                    </label>
                    <input
                      id="payout-national-id"
                      name="national_id"
                      inputMode="numeric"
                      autoComplete="off"
                      value={nationalId}
                      onChange={(event) => setNationalId(event.target.value.replace(/\D/g, ""))}
                      minLength={14}
                      maxLength={14}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black-blue outline-none transition focus:border-main focus:ring-2 focus:ring-main/15"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="payout-amount" className="mb-2 block text-sm font-semibold text-black-blue">
                    {copy.amountInput}
                  </label>
                  <input
                    id="payout-amount"
                    name="amount"
                    type="number"
                    inputMode="decimal"
                    min={minimumAmount}
                    max={Math.max(0, availableBalance)}
                    step="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black-blue outline-none transition focus:border-main focus:ring-2 focus:ring-main/15"
                  />
                  <p className="mt-2 text-xs leading-5 text-black-blue/55">
                    {copy.minimumHint} {money(minimumAmount)} {ar ? "ج.م" : "EGP"} · {copy.maximumHint}: {money(availableBalance)} {ar ? "ج.م" : "EGP"}
                  </p>
                </div>
              </div>

              <p className="text-xs leading-5 text-black-blue/50">{copy.personalDataHint}</p>

              {availableBalance < minimumAmount && (
                <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800" role="status">
                  {copy.noBalance}
                </p>
              )}
              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700" role="alert">
                  {formError}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setPayoutFormOpen(false);
                    setFormError("");
                  }}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-black-blue transition hover:bg-gray-50"
                >
                  {copy.cancel}
                </button>
                <button
                  type="submit"
                  disabled={createPayout.isPending || !payoutsEnabled || availableBalance < minimumAmount}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-main px-5 py-3 text-sm font-semibold text-white transition hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createPayout.isPending && <Loader size={17} className="animate-spin" />}
                  {createPayout.isPending ? copy.submitting : copy.submit}
                </button>
              </div>
            </form>
          </section>
        )}

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
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-main/10 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-main">
                  <WalletCards size={18} />
                  <span className="font-sora text-xs font-semibold">{copy.total}</span>
                </div>
                <p className="mt-4 text-2xl font-bold text-black-blue">{money(walletData?.total)} {ar ? "ج.م" : "EGP"}</p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700">
                  <ArrowDownToLine size={18} />
                  <span className="font-sora text-xs font-semibold">{copy.available}</span>
                </div>
                <p className="mt-4 text-2xl font-bold text-black-blue">{money(availableBalance)} {ar ? "ج.م" : "EGP"}</p>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-amber-700">
                  <WalletCards size={18} />
                  <span className="font-sora text-xs font-semibold">{copy.reserved}</span>
                </div>
                <p className="mt-4 text-2xl font-bold text-black-blue">{money(reservedBalance)} {ar ? "ج.م" : "EGP"}</p>
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

              {payouts.isError ? (
                <div className="p-8 text-center font-sora text-sm text-red-600" role="alert">{copy.payoutsLoadError}</div>
              ) : payoutItems.length === 0 ? (
                <div className="p-10 text-center font-sora text-sm text-black-blue/50">{copy.noPayouts}</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {payoutItems.map((payout) => (
                    <div key={payout.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:px-6">
                      <div>
                        <p className="font-semibold text-black-blue">{money(payout.amount)} {ar ? "ج.م" : "EGP"}</p>
                        <p className="mt-1 text-xs text-black-blue/45">{formatDateTime(payout.created_at, language)}</p>
                        <p className="mt-1 text-xs text-black-blue/55">{copy.method}: {methodLabel(payout.payout_method)}</p>
                      </div>
                      <span className={"w-fit rounded-full px-3 py-1 text-xs font-semibold " + statusClass(payout.status)}>
                        {statusLabel(payout.status)}
                      </span>
                      <span className="text-xs font-mono text-black-blue/40">#{payout.id}</span>
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
