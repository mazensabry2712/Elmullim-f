import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, Loader2, MapPin, UsersRound, X } from "lucide-react";
import { toast } from "react-toastify";
import cookieService from "@/utils/cookieService";
import { useCreateBooking } from "@/lib/react-query/booking";
import { useGetStudentProfile } from "@/lib/react-query/student/studentProfile";
import { useGetParentProfile } from "@/lib/react-query/parent/parentProfile";
import { BookingStatus } from "@/interfaces/bookings/booking";
import { useGetLessonBookingOptions } from "@/lib/react-query/lessons/lessons";
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
  const [successStatus, setSuccessStatus] = useState<BookingStatus | null>(null);
  const {
    data: bookingOptions,
    isLoading: loadingBookingOptions,
    isError: bookingOptionsError,
  } = useGetLessonBookingOptions(lessonId, selectedDate);
  const studentProfileQuery = useGetStudentProfile(token, open && role === "student");
  const parentProfileQuery = useGetParentProfile(token, open && role === "parent");
  const { mutateAsync, isPending } = useCreateBooking();

  const loadingStudents =
    (role === "student" && studentProfileQuery.isLoading) ||
    (role === "parent" && parentProfileQuery.isLoading);

  useEffect(() => {
    if (!open || !token || (role !== "student" && role !== "parent")) return;

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
    if (!open || !token) return;
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
  const isFree = Number(price) <= 0;
  const bookingNotice =
    bookingType === "private"
      ? isFree
        ? bookingCopy.freePrivateApproval
        : bookingCopy.privateRequiresApproval
      : isFree
        ? bookingCopy.freeGroupInstant
        : bookingCopy.groupBookingRequest;
  const confirmLabel =
    bookingType === "private"
      ? bookingCopy.confirmRequest
      : isFree
        ? bookingCopy.confirmFree
        : bookingCopy.confirmRequest;

  const closeDialog = () => {
    setOpen(false);
    setSuccessStatus(null);
    setSelectedDate("");
    setSelectedTime("");
    setCustomerNote("");
  };

  const timesForDate = useMemo(() => {
    if (!selectedDate || !bookingOptions?.data) return [];

    const now = Date.now();

    return bookingOptions.data
      .filter((option) => option.is_available && new Date(option.requested_start_at).getTime() > now)
      .sort((a, b) => a.requested_start_at.localeCompare(b.requested_start_at))
      .map((option) => ({
        value: option.requested_start_at,
        label:
          bookingType === "group"
            ? option.local_time + " (" + option.timezone + ") — " +
              (option.available_seats ?? 0) + " " +
              (option.available_seats === 1 ? bookingCopy.availableSeat : bookingCopy.availableSeats)
            : option.local_time + " (" + option.timezone + ")",
      }));
  }, [bookingOptions?.data, bookingType, selectedDate, bookingCopy.availableSeat, bookingCopy.availableSeats]);

  useEffect(() => {
    if (!timesForDate.some((item) => item.value === selectedTime)) setSelectedTime("");
  }, [timesForDate, selectedTime]);

  const submit = async () => {
    if (role !== "student" && role !== "parent") {
      toast.info(bookingCopy.login);
      return;
    }
    if (!studentId || !selectedDate || !selectedTime) {
      toast.error(bookingCopy.selectStudentDateTime);
      return;
    }

    const needsStudentLocation =
      deliveryMode === "offline" && offlineVisitType === "teacher_to_student";

    const selectedStudentBeforeRequest =
      role === "student"
        ? selfStudent
        : students.find((student) => student.id === studentId);

    if (
      needsStudentLocation &&
      (
        selectedStudentBeforeRequest?.latitude == null ||
        selectedStudentBeforeRequest?.longitude == null ||
        !selectedStudentBeforeRequest?.address?.trim()
      )
    ) {
      toast.error(bookingCopy.studentLocationRequired);
      return;
    }

    const selectedBookingOption = bookingOptions?.data.find(
      (option) => option.requested_start_at === selectedTime
    );

    if (!selectedBookingOption?.is_available) {
      toast.error(bookingCopy.noTimes);
      return;
    }

    const requestedStartAt = selectedBookingOption.requested_start_at;

    try {
      const response = await mutateAsync({
        token,
        lessonId,
        booking: {
          student_id: studentId,
          requested_start_at: requestedStartAt,
          ...(customerNote.trim() ? { customer_note: customerNote.trim() } : {}),
        },
      });

      if (!response.status) {
        toast.error(response.message || bookingCopy.failed);
        return;
      }

      const status = response.data.status as BookingStatus;
      const statusText = bookingCopy.statuses[status] ?? status;
      toast.success(`${bookingCopy.success}: ${statusText}`);
      setSuccessStatus(status);
    } catch {
      toast.error(bookingCopy.failed);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
        setSuccessStatus(null);
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
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-black-blue/[0.07] bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-main">
                    {language === "ar" ? "الحجز الذكي" : "Smart booking"}
                  </p>
                  <h2 id="book-lesson-title" className="mt-1 text-2xl font-black text-black-blue">
                    {bookingCopy.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={bookingCopy.cancel}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black-blue/[0.07] text-black-blue/55 transition hover:bg-slate-50 hover:text-black-blue"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {successStatus ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center px-5 py-8 text-center sm:px-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-main/10 text-main">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="mt-6 text-2xl font-black text-black-blue">
                  {bookingCopy.success}
                </h3>
                <p className="mt-2 text-sm font-bold text-main">
                  {bookingCopy.statuses[successStatus] ?? successStatus}
                </p>
                <p className="mt-2 max-w-md text-sm leading-6 text-black-blue/55">
                  {successStatus === "confirmed"
                    ? language === "ar"
                      ? "تم تأكيد حجزك بنجاح، وأصبحت الحصة متاحة ضمن حجوزاتك."
                      : "Your booking is confirmed and is now available in your bookings."
                    : language === "ar"
                      ? "تم إرسال طلب الحجز ويمكنك متابعة حالته من حجوزاتك."
                      : "Your booking request was sent. You can follow its status from your bookings."}
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
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-main/[0.055] p-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-wide text-black-blue/35">{copy.price}</p>
                    <p className="mt-1 text-lg font-black text-main">
                      {isFree ? copy.free : Number(price).toFixed(2) + " " + copy.currency}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-wide text-black-blue/35">{bookingCopy.lessonDuration}</p>
                    <p className="mt-1 text-lg font-black text-black-blue">{durationMinutes} {copy.durationUnit}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-wide text-black-blue/35">{copy.bookingType}</p>
                    <p className="mt-1 text-lg font-black text-black-blue">{bookingType === "group" ? copy.group : copy.private}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-main/10 bg-main/[0.035] p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-main" />
                    <div>
                      <p className="text-sm font-extrabold text-black-blue">{bookingNotice}</p>
                      {isFree && (
                        <p className="mt-1 text-xs font-semibold leading-5 text-black-blue/50">
                          {bookingCopy.freeNoPayment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              {role === "student" && (
                <div className="rounded-2xl border border-black-blue/[0.07] bg-white px-4 py-3 text-sm font-semibold text-black-blue/60">
                  <span className="font-extrabold text-black-blue">{bookingCopy.student}:</span> {selfStudent?.name || "..."}
                </div>
              )}

              {role === "parent" && (
                <section className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UsersRound className="h-4 w-4 text-main" />
                    <label className="text-sm font-extrabold text-black-blue">{bookingCopy.student}</label>
                  </div>
                  {loadingStudents ? (
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-black-blue/55" role="status">
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
                      onChange={(event) => setStudentId(Number(event.target.value))}
                      className="h-12 w-full rounded-2xl border border-black-blue/10 bg-white px-4 text-sm font-semibold text-black-blue outline-none transition focus:border-main focus:ring-2 focus:ring-main/10"
                    >
                      {students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}
                    </select>
                  )}
                </section>
              )}

              <section className="space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-main" />
                    <label className="text-sm font-extrabold text-black-blue" htmlFor="lesson-booking-date">
                      {bookingCopy.date}
                    </label>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-black-blue/45">{bookingCopy.chooseDateHint}</p>
                </div>
                <input
                  id="lesson-booking-date"
                  type="date"
                  min={minimumDate}
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-black-blue/10 bg-white px-4 text-sm font-semibold text-black-blue outline-none transition focus:border-main focus:ring-2 focus:ring-main/10"
                />
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-main" />
                      <p className="text-sm font-extrabold text-black-blue">{bookingCopy.time}</p>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-black-blue/45">{bookingCopy.chooseTimeHint}</p>
                  </div>
                  {selectedDate && timesForDate.length > 0 && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-black-blue/35">
                      {timesForDate.length} {language === "ar" ? "موعد متاح" : "available"}
                    </span>
                  )}
                </div>

                {selectedDate && loadingBookingOptions ? (
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-black-blue/55" role="status">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {bookingCopy.availabilityLoading}
                  </div>
                ) : selectedDate && bookingOptionsError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700" role="alert">
                    {bookingCopy.availabilityError}
                  </div>
                ) : selectedDate && timesForDate.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-black-blue/10 px-4 py-4 text-sm text-black-blue/55">
                    {bookingCopy.noTimes}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {timesForDate.map((item) => {
                      const selected = selectedTime === item.value;
                      return (
                        <button
                          key={item.value}
                          type="button"
                          aria-label={item.label}
                          aria-pressed={selectedTime === item.value}
                          onClick={() => setSelectedTime(item.value)}
                          className={`rounded-2xl border px-3 py-3 text-start transition ${
                            selected
                              ? "border-main bg-main/[0.07] ring-2 ring-main/10"
                              : "border-black-blue/[0.07] bg-white hover:border-main/30 hover:bg-main/[0.025]"
                          }`}
                        >
                          <span className="block text-sm font-black text-black-blue" dir="ltr">{item.label.split(" (")[0]}</span>
                          <span className="mt-1 block truncate text-[10px] font-semibold text-black-blue/40" dir="ltr">
                            {item.label.includes("—") ? item.label.split(" — ")[0].split(" (")[1]?.replace(")", "") : ""}
                          </span>
                          {bookingType === "group" && (
                            <span className={`mt-2 inline-flex items-center gap-1 text-[10px] font-extrabold ${selected ? "text-main" : "text-black-blue/45"}`}>
                              {selected ? <CheckCircle2 className="h-3 w-3" /> : <UsersRound className="h-3 w-3" />}
                              {item.label.split("—").pop()?.trim()}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {selectedDate && selectedTime && (
                  <div className="rounded-2xl border border-main/10 bg-main/[0.045] p-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-wide text-main">
                      {bookingCopy.selectedBooking}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-black text-black-blue" dir="ltr">
                      <span>{selectedDate}</span>
                      <span className="text-black-blue/25">•</span>
                      <span>{timesForDate.find((item) => item.value === selectedTime)?.local_time || ""}</span>
                    </div>
                  </div>
                )}
              </section>

              {deliveryMode === "offline" && offlineVisitType === "teacher_to_student" && (
                <section className="rounded-2xl border border-main/10 bg-main/[0.035] p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-main" />
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-black-blue">
                        {language === "ar" ? "موقع الحصة" : "Lesson location"}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-black-blue/55">
                        {language === "ar"
                          ? "سيتم استخدام موقع الطالب المحفوظ في ملفه الشخصي تلقائيًا. لا يوجد عنوان يُكتب داخل الحجز."
                          : "The student's saved profile location is used automatically. No address is entered in the booking."}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              <label className="block text-sm font-extrabold text-black-blue">
                {bookingCopy.note}
                <textarea
                  value={customerNote}
                  onChange={(event) => setCustomerNote(event.target.value)}
                  rows={4}
                  maxLength={5000}
                  className="mt-2 w-full resize-none rounded-2xl border border-black-blue/10 bg-white px-4 py-3 text-sm font-medium text-black-blue outline-none transition focus:border-main focus:ring-2 focus:ring-main/10"
                />
              </label>

              <div className="flex flex-col gap-3 border-t border-black-blue/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs font-semibold text-black-blue/45">
                  {!selectedDate
                    ? bookingCopy.selectStudentDateTime
                    : !selectedTime
                      ? bookingCopy.time
                      : confirmLabel}
                </div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  <button type="button" onClick={() => setOpen(false)} className="min-h-11 rounded-xl border border-black-blue/10 bg-white px-5 py-2 text-sm font-extrabold text-black-blue/65 transition hover:bg-slate-50">
                    {bookingCopy.cancel}
                  </button>
                  <button
                    type="button"
                    onClick={submit}
                    disabled={
                      isPending ||
                      loadingStudents ||
                      loadingBookingOptions ||
                      (role === "parent" && students.length === 0) ||
                      !selectedDate ||
                      !selectedTime ||
                      (
                        deliveryMode === "offline" &&
                        offlineVisitType === "teacher_to_student" &&
                        (
                          !(role === "student" ? selfStudent : students.find((student) => student.id === studentId))?.address?.trim() ||
                          (role === "student" ? selfStudent : students.find((student) => student.id === studentId))?.latitude == null ||
                          (role === "student" ? selfStudent : students.find((student) => student.id === studentId))?.longitude == null
                        )
                      )
                    }
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-main px-6 py-2 text-sm font-extrabold text-white transition hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {confirmLabel}
                  </button>
                </div>
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
