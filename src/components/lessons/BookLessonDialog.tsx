import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  ShieldCheck,
  UsersRound,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import cookieService from "@/utils/cookieService";
import {
  useCreateBooking,
  useInitiateBookingPayment,
} from "@/lib/react-query/booking";
import { useGetStudentProfile } from "@/lib/react-query/student/studentProfile";
import { useGetParentProfile } from "@/lib/react-query/parent/parentProfile";
import { BookingStatus } from "@/interfaces/bookings/booking";
import type { PaymentMethod } from "@/interfaces/payment/payment";
import { useGetLessonBookingOptions } from "@/lib/react-query/lessons/lessons";
import PaymentMethodSelector from "@/components/payments/PaymentMethodSelector";
import { getLessonsCopy } from "@/pages/lessons/lessonCopy";

interface IProps {
  lessonId: number;
  bookingType: "private" | "group";
  deliveryMode?: "online" | "offline";
  offlineVisitType?: string | null;
  price: string | number;
  durationMinutes: number;
  language: "ar" | "en";
}

interface IStudentOption {
  id: number;
  name: string;
  address?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
}

const getTodayInputValue = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

const BookLessonDialog = ({
  lessonId,
  bookingType,
  deliveryMode,
  offlineVisitType,
  price,
  durationMinutes,
  language,
}: IProps) => {
  const token = cookieService.getToken() || "";
  const role = cookieService.getRole();
  const copy = getLessonsCopy(language);
  const bookingCopy = copy.booking;

  const [open, setOpen] = useState(false);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [students, setStudents] = useState<IStudentOption[]>([]);
  const [selfStudent, setSelfStudent] = useState<IStudentOption | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [successStatus, setSuccessStatus] = useState<BookingStatus | null>(null);
  const [paymentInitializationFailed, setPaymentInitializationFailed] = useState(false);

  const {
    data: bookingOptions,
    isLoading: loadingBookingOptions,
    isError: bookingOptionsError,
  } = useGetLessonBookingOptions(lessonId, selectedDate);

  const studentProfileQuery = useGetStudentProfile(
    token,
    open && role === "student"
  );
  const parentProfileQuery = useGetParentProfile(
    token,
    open && role === "parent"
  );

  const { mutateAsync: createBooking, isPending: isCreatingBooking } =
    useCreateBooking();

  const { mutateAsync: initiatePayment, isPending: isInitializingPayment } =
    useInitiateBookingPayment();

  const loadingStudents =
    (role === "student" && studentProfileQuery.isLoading) ||
    (role === "parent" && parentProfileQuery.isLoading);

  const isFree = Number(price) <= 0;
  const isGroup = bookingType === "group";
  const isPaidGroup = !isFree && isGroup;
  const requiresApproval = bookingType === "private";
  const isSubmitting = isCreatingBooking || isInitializingPayment;

  const bookingFlow = requiresApproval
    ? isFree
      ? bookingCopy.freePrivateApproval
      : bookingCopy.privatePaidApproval
    : isFree
      ? bookingCopy.freeGroupInstant
      : bookingCopy.paidGroupCheckout;

  const confirmLabel = requiresApproval
    ? bookingCopy.confirmRequest
    : isFree
      ? bookingCopy.confirmFree
      : bookingCopy.continueToPayment;

  useEffect(() => {
    if (!open || !token || (role !== "student" && role !== "parent")) {
      return;
    }

    if (role === "student" && studentProfileQuery.data?.data) {
      const profile = studentProfileQuery.data.data;

      if (typeof profile.id !== "number") {
        setStudentId(null);
        setSelfStudent(null);
        setStudents([]);
        return;
      }

      setStudentId(profile.id);
      setSelfStudent({
        id: profile.id,
        name: profile.name ?? "",
        address: profile.address ?? null,
        latitude: profile.latitude ?? null,
        longitude: profile.longitude ?? null,
      });
      setStudents([]);
      return;
    }

    if (role === "parent" && parentProfileQuery.data?.data) {
      const linkedStudents = (parentProfileQuery.data.data.students ?? []).flatMap(
        (student) =>
          typeof student.id === "number"
            ? [
                {
                  id: student.id,
                  name: student.name ?? "",
                  address: student.address ?? null,
                  latitude: student.latitude ?? null,
                  longitude: student.longitude ?? null,
                },
              ]
            : []
      );

      setStudents(linkedStudents);
      setStudentId(linkedStudents[0]?.id ?? null);
      setSelfStudent(null);
    }
  }, [
    open,
    role,
    token,
    studentProfileQuery.data,
    parentProfileQuery.data,
  ]);

  useEffect(() => {
    if (!open || !token) {
      return;
    }

    if (
      (role === "student" && studentProfileQuery.isError) ||
      (role === "parent" && parentProfileQuery.isError)
    ) {
      toast.error(bookingCopy.failed);
    }
  }, [
    open,
    role,
    token,
    studentProfileQuery.isError,
    parentProfileQuery.isError,
    bookingCopy.failed,
  ]);

  const minimumDate = getTodayInputValue();

  const closeDialog = () => {
    setOpen(false);
    setSuccessStatus(null);
    setPaymentInitializationFailed(false);
    setSelectedDate("");
    setSelectedTime("");
    setCustomerNote("");
    setPaymentMethod("card");
  };

  const timesForDate = useMemo(() => {
    if (!selectedDate || !bookingOptions?.data) {
      return [];
    }

    const now = Date.now();

    return bookingOptions.data
      .filter(
        (option) =>
          option.is_available &&
          new Date(option.requested_start_at).getTime() > now
      )
      .sort((a, b) =>
        a.requested_start_at.localeCompare(b.requested_start_at)
      );
  }, [bookingOptions?.data, selectedDate]);

  useEffect(() => {
    if (!timesForDate.some((item) => item.requested_start_at === selectedTime)) {
      setSelectedTime("");
    }
  }, [timesForDate, selectedTime]);

  const selectedBookingOption = timesForDate.find(
    (option) => option.requested_start_at === selectedTime
  );

  const selectedStudent =
    role === "student"
      ? selfStudent
      : students.find((student) => student.id === studentId);

  const needsStudentLocation =
    deliveryMode === "offline" && offlineVisitType === "teacher_to_student";

  const submit = async () => {
    if (role !== "student" && role !== "parent") {
      toast.info(bookingCopy.login);
      return;
    }

    if (!studentId || !selectedDate || !selectedTime) {
      toast.error(bookingCopy.selectStudentDateTime);
      return;
    }

    if (needsStudentLocation) {
      if (
        selectedStudent?.latitude == null ||
        selectedStudent?.longitude == null ||
        !selectedStudent?.address?.trim()
      ) {
        toast.error(bookingCopy.studentLocationRequired);
        return;
      }
    }

    if (!selectedBookingOption?.is_available) {
      toast.error(bookingCopy.noTimes);
      return;
    }

    setPaymentInitializationFailed(false);

    try {
      const response = await createBooking({
        token,
        lessonId,
        booking: {
          student_id: studentId,
          requested_start_at: selectedBookingOption.requested_start_at,
          ...(customerNote.trim()
            ? { customer_note: customerNote.trim() }
            : {}),
        },
      });

      if (!response.status || !response.data?.id) {
        toast.error(response.message || bookingCopy.failed);
        return;
      }

      const status = response.data.status as BookingStatus;

      if (isPaidGroup) {
        const paymentResponse = await initiatePayment({
          token,
          bookingId: response.data.id,
          paymentMethod,
          isParent: role === "parent",
        });

        if (!paymentResponse.status || !paymentResponse.data?.redirect_url) {
          setPaymentInitializationFailed(true);
          setSuccessStatus(status);
          return;
        }

        window.location.assign(paymentResponse.data.redirect_url);
        return;
      }

      const statusText = bookingCopy.statuses[status] ?? status;
      toast.success(`${bookingCopy.success}: ${statusText}`);
      setSuccessStatus(status);
    } catch {
      toast.error(bookingCopy.failed);
    }
  };

  const selectionHint = !studentId
    ? bookingCopy.chooseStudent
    : !selectedDate
      ? bookingCopy.date
      : !selectedTime
        ? bookingCopy.time
        : isPaidGroup
          ? bookingCopy.reviewAndPay
          : bookingCopy.confirm;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSuccessStatus(null);
          setPaymentInitializationFailed(false);
          setOpen(true);
        }}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-main px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 lg:w-auto"
      >
        {copy.book}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="book-lesson-title"
        >
          <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-black-blue/[0.07] bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-main">
                    {language === "ar" ? "الحجز الذكي" : "Smart booking"}
                  </p>
                  <h2
                    id="book-lesson-title"
                    className="mt-1 text-2xl font-black text-black-blue"
                  >
                    {bookingCopy.title}
                  </h2>
                  <p className="mt-1 text-xs font-semibold text-black-blue/45">
                    {bookingFlow}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeDialog}
                  aria-label={bookingCopy.cancel}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black-blue/[0.07] text-black-blue/55 transition hover:bg-slate-50 hover:text-black-blue"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {successStatus ? (
              <div className="flex min-h-[390px] flex-col items-center justify-center px-5 py-8 text-center sm:px-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-main/10 text-main">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <h3 className="mt-6 text-2xl font-black text-black-blue">
                  {paymentInitializationFailed
                    ? bookingCopy.paymentInitializationFailed
                    : bookingCopy.success}
                </h3>

                <p className="mt-2 text-sm font-bold text-main">
                  {bookingCopy.statuses[successStatus] ?? successStatus}
                </p>

                <p className="mt-3 max-w-md text-sm leading-6 text-black-blue/55">
                  {paymentInitializationFailed
                    ? bookingCopy.paymentInitializationFailedHint
                    : successStatus === "confirmed"
                      ? language === "ar"
                        ? "تم تأكيد حجزك بنجاح، وأصبحت الحصة متاحة ضمن حجوزاتك."
                        : "Your booking is confirmed and is now available in your bookings."
                      : requiresApproval
                        ? bookingCopy.privateApprovalAfterSubmit
                        : bookingCopy.paymentLater}
                </p>

                <div className="mt-7 flex w-full max-w-sm flex-col gap-2 sm:flex-row">
                  <Link
                    to="/bookings"
                    onClick={() => setSuccessStatus(null)}
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-main px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
                  >
                    {language === "ar" ? "عرض حجوزاتي" : "View my bookings"}
                  </Link>

                  <button
                    type="button"
                    onClick={closeDialog}
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-black-blue/10 bg-white px-5 py-2.5 text-sm font-extrabold text-black-blue/65 transition hover:bg-slate-50"
                  >
                    {bookingCopy.cancel}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
                <section className="rounded-3xl border border-black-blue/[0.07] bg-[#FBFDFC] p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-main/10 px-3 py-1.5 text-xs font-black text-main">
                      {isFree ? copy.free : bookingCopy.paid}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-black-blue/65 ring-1 ring-black-blue/[0.06]">
                      {isGroup ? copy.group : copy.private}
                    </span>
                    {deliveryMode ? (
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-black-blue/65 ring-1 ring-black-blue/[0.06]">
                        {deliveryMode === "offline" ? copy.offline : copy.online}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-black-blue/35">
                        {copy.price}
                      </p>
                      <p className="mt-1 text-3xl font-black text-main">
                        {isFree
                          ? copy.free
                          : `${Number(price).toFixed(2)} ${copy.currency}`}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:min-w-[290px]">
                      <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-black-blue/[0.05]">
                        <p className="text-[10px] font-extrabold uppercase tracking-wide text-black-blue/35">
                          {bookingCopy.lessonDuration}
                        </p>
                        <p className="mt-1 text-sm font-black text-black-blue">
                          {durationMinutes} {copy.durationUnit}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-black-blue/[0.05]">
                        <p className="text-[10px] font-extrabold uppercase tracking-wide text-black-blue/35">
                          {copy.bookingType}
                        </p>
                        <p className="mt-1 text-sm font-black text-black-blue">
                          {isGroup ? copy.group : copy.private}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-main/10 bg-main/[0.045] p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-main" />
                      <div>
                        <p className="text-sm font-extrabold text-black-blue">
                          {bookingFlow}
                        </p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-black-blue/50">
                          {isFree
                            ? bookingCopy.freeNoPayment
                            : requiresApproval
                              ? bookingCopy.privatePaidApprovalHint
                              : bookingCopy.groupPaidPaymentHint}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {role === "student" && (
                  <div className="rounded-2xl border border-black-blue/[0.07] bg-white px-4 py-3 text-sm font-semibold text-black-blue/60">
                    <span className="font-extrabold text-black-blue">
                      {bookingCopy.student}:
                    </span>{" "}
                    {selfStudent?.name || "..."}
                  </div>
                )}

                {role === "parent" && (
                  <section className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UsersRound className="h-4 w-4 text-main" />
                      <label className="text-sm font-extrabold text-black-blue">
                        {bookingCopy.student}
                      </label>
                    </div>

                    {loadingStudents ? (
                      <div
                        className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-black-blue/55"
                        role="status"
                      >
                        {bookingCopy.loading}
                      </div>
                    ) : students.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-black-blue/10 px-4 py-4 text-sm text-black-blue/55">
                        {bookingCopy.noStudents}
                      </div>
                    ) : (
                      <select
                        aria-label={bookingCopy.chooseStudent}
                        value={studentId ?? ""}
                        onChange={(event) =>
                          setStudentId(Number(event.target.value))
                        }
                        disabled={isSubmitting}
                        className="h-12 w-full rounded-2xl border border-black-blue/10 bg-white px-4 text-sm font-semibold text-black-blue outline-none transition focus:border-main focus:ring-2 focus:ring-main/10 disabled:opacity-60"
                      >
                        {students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </section>
                )}

                <section className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-main" />
                    <div>
                      <label
                        className="text-sm font-extrabold text-black-blue"
                        htmlFor="lesson-booking-date"
                      >
                        {bookingCopy.date}
                      </label>
                      <p className="mt-1 text-xs leading-5 text-black-blue/45">
                        {bookingCopy.chooseDateHint}
                      </p>
                    </div>
                  </div>

                  <input
                    id="lesson-booking-date"
                    type="date"
                    min={minimumDate}
                    value={selectedDate}
                    disabled={isSubmitting}
                    onChange={(event) => {
                      setSelectedDate(event.target.value);
                      setSelectedTime("");
                    }}
                    className="h-12 w-full rounded-2xl border border-black-blue/10 bg-white px-4 text-sm font-semibold text-black-blue outline-none transition focus:border-main focus:ring-2 focus:ring-main/10 disabled:opacity-60"
                  />
                </section>

                <section className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-main" />
                        <p className="text-sm font-extrabold text-black-blue">
                          {bookingCopy.time}
                        </p>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-black-blue/45">
                        {bookingCopy.chooseTimeHint}
                      </p>
                    </div>

                    {selectedDate && timesForDate.length > 0 ? (
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-black-blue/35">
                        {timesForDate.length}{" "}
                        {language === "ar" ? "موعد متاح" : "available"}
                      </span>
                    ) : null}
                  </div>

                  {selectedDate && loadingBookingOptions ? (
                    <div
                      className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-black-blue/55"
                      role="status"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {bookingCopy.availabilityLoading}
                    </div>
                  ) : selectedDate && bookingOptionsError ? (
                    <div
                      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
                      role="alert"
                    >
                      {bookingCopy.availabilityError}
                    </div>
                  ) : selectedDate && timesForDate.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-black-blue/10 px-4 py-4 text-sm text-black-blue/55">
                      {bookingCopy.noTimes}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {timesForDate.map((option) => {
                        const selected =
                          option.requested_start_at === selectedTime;
                        const seats =
                          typeof option.available_seats === "number"
                            ? option.available_seats
                            : null;

                        return (
                          <button
                            key={option.requested_start_at}
                            type="button"
                            aria-label={
                              isGroup && seats !== null
                                ? `${option.local_time} (${seats} ${seats === 1 ? bookingCopy.availableSeat : bookingCopy.availableSeats})`
                                : option.local_time
                            }
                            aria-pressed={selected}
                            disabled={isSubmitting}
                            onClick={() =>
                              setSelectedTime(option.requested_start_at)
                            }
                            className={`rounded-2xl border px-3 py-3 text-start transition disabled:opacity-60 ${
                              selected
                                ? "border-main bg-main/[0.07] ring-2 ring-main/10"
                                : "border-black-blue/[0.07] bg-white hover:border-main/30 hover:bg-main/[0.025]"
                            }`}
                          >
                            <span
                              className="block text-sm font-black text-black-blue"
                              dir="ltr"
                            >
                              {option.local_time}
                            </span>
                            <span
                              className="mt-1 block truncate text-[10px] font-semibold text-black-blue/40"
                              dir="ltr"
                            >
                              {option.timezone}
                            </span>

                            {isGroup && seats !== null ? (
                              <span
                                className={`mt-2 inline-flex items-center gap-1 text-[10px] font-extrabold ${
                                  selected ? "text-main" : "text-black-blue/45"
                                }`}
                              >
                                {selected ? (
                                  <CheckCircle2 className="h-3 w-3" />
                                ) : (
                                  <UsersRound className="h-3 w-3" />
                                )}
                                {seats}{" "}
                                {seats === 1
                                  ? bookingCopy.availableSeat
                                  : bookingCopy.availableSeats}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {selectedBookingOption ? (
                    <div className="rounded-2xl border border-main/10 bg-main/[0.045] p-4">
                      <p className="text-[10px] font-extrabold uppercase tracking-wide text-main">
                        {bookingCopy.selectedBooking}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-black text-black-blue">
                        <span dir="ltr">{selectedDate}</span>
                        <span className="text-black-blue/25">•</span>
                        <span dir="ltr">{selectedBookingOption.local_time}</span>
                        <span className="text-black-blue/25">•</span>
                        <span>{isGroup ? copy.group : copy.private}</span>
                      </div>

                      {isGroup &&
                      selectedBookingOption.available_seats !== null ? (
                        <p className="mt-2 text-xs font-bold text-main">
                          {selectedBookingOption.available_seats}{" "}
                          {selectedBookingOption.available_seats === 1
                            ? bookingCopy.availableSeat
                            : bookingCopy.availableSeats}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </section>

                {isPaidGroup ? (
                  <section className="rounded-3xl border border-[#DFE8E6] bg-white p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-black-blue">
                          {bookingCopy.paymentMethods}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-black-blue/50">
                          {bookingCopy.groupPaidPaymentHint}
                        </p>
                      </div>
                      <ShieldCheck
                        className="mt-0.5 shrink-0 text-main"
                        size={22}
                        aria-hidden="true"
                      />
                    </div>

                    <PaymentMethodSelector
                      value={paymentMethod}
                      onChange={setPaymentMethod}
                      disabled={isSubmitting}
                      labels={{
                        paymentMethods: bookingCopy.paymentMethods,
                        cardPayment: bookingCopy.cardPayment,
                        cardPaymentDescription:
                          bookingCopy.cardPaymentDescription,
                        fawryPayment: bookingCopy.fawryPayment,
                        fawryPaymentDescription:
                          bookingCopy.fawryPaymentDescription,
                        walletPayment: bookingCopy.walletPayment,
                        walletPaymentDescription:
                          bookingCopy.walletPaymentDescription,
                      }}
                    />

                    <div className="mt-4 rounded-2xl border border-black-blue/[0.07] bg-[#FBFDFC] px-4">
                      <div className="flex items-center justify-between gap-4 border-b border-[#E8EEEC] py-3 text-sm">
                        <span className="text-[#697572]">
                          {bookingCopy.lessonPrice}
                        </span>
                        <span className="font-bold text-black-blue">
                          {Number(price).toFixed(2)} {copy.currency}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 py-4">
                        <span className="text-base font-black text-black-blue">
                          {bookingCopy.total}
                        </span>
                        <span className="text-xl font-black text-main">
                          {Number(price).toFixed(2)} {copy.currency}
                        </span>
                      </div>
                    </div>
                  </section>
                ) : null}

                {needsStudentLocation ? (
                  <section className="rounded-2xl border border-main/10 bg-main/[0.035] p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-main" />
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-black-blue">
                          {language === "ar"
                            ? "موقع الحصة"
                            : "Lesson location"}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-black-blue/55">
                          {language === "ar"
                            ? "سيتم استخدام موقع الطالب المحفوظ في ملفه الشخصي تلقائيًا. لا يوجد عنوان يُكتب داخل الحجز."
                            : "The student's saved profile location is used automatically. No address is entered in the booking."}
                        </p>
                      </div>
                    </div>
                  </section>
                ) : null}

                <details className="group rounded-2xl border border-black-blue/[0.07] bg-white">
                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-extrabold text-black-blue">
                    <span className="flex items-center justify-between gap-3">
                      <span>{bookingCopy.note}</span>
                      <span className="text-xs font-semibold text-black-blue/35 transition group-open:rotate-180">
                        ⌄
                      </span>
                    </span>
                  </summary>

                  <div className="px-4 pb-4">
                    <textarea
                      value={customerNote}
                      onChange={(event) => setCustomerNote(event.target.value)}
                      rows={3}
                      maxLength={5000}
                      disabled={isSubmitting}
                      placeholder={
                        language === "ar"
                          ? "أضف أي ملاحظة للمعلم إذا لزم الأمر..."
                          : "Add a note for the teacher if needed..."
                      }
                      className="w-full resize-none rounded-2xl border border-black-blue/10 bg-white px-4 py-3 text-sm font-medium text-black-blue outline-none transition focus:border-main focus:ring-2 focus:ring-main/10 disabled:opacity-60"
                    />
                  </div>
                </details>

                <div className="flex flex-col gap-3 border-t border-black-blue/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs font-semibold text-black-blue/45">
                    {selectionHint}
                  </div>

                  <div className="flex flex-col-reverse gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={closeDialog}
                      disabled={isSubmitting}
                      className="min-h-11 rounded-xl border border-black-blue/10 bg-white px-5 py-2 text-sm font-extrabold text-black-blue/65 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      {bookingCopy.cancel}
                    </button>

                    <button
                      type="button"
                      onClick={submit}
                      disabled={
                        isSubmitting ||
                        loadingStudents ||
                        loadingBookingOptions ||
                        (role === "parent" && students.length === 0) ||
                        !studentId ||
                        !selectedDate ||
                        !selectedTime ||
                        (needsStudentLocation &&
                          (!selectedStudent?.address?.trim() ||
                            selectedStudent.latitude == null ||
                            selectedStudent.longitude == null))
                      }
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-main px-6 py-2 text-sm font-extrabold text-white transition hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      {isInitializingPayment
                        ? bookingCopy.paymentRedirecting
                        : confirmLabel}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BookLessonDialog;
