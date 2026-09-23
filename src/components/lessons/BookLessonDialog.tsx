import { useEffect, useMemo, useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import axiosAPI from "@/config/axios.config";
import cookieService from "@/utils/cookieService";
import { useCreateBooking } from "@/lib/react-query/booking";
import { BookingStatus } from "@/interfaces/bookings/booking";
import {
  useGetLessonAvailability,
  useGetLessonBookingOptions,
} from "@/lib/react-query/lessons/lessons";
import { ILessonAvailabilitySlot } from "@/interfaces/lessons/availability";
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

interface IProfileResponse {
  data?: IStudentOption & {
    students?: IStudentOption[];
  };
}

const isoWeekdayFromDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return weekday === 0 ? 7 : weekday;
};

const getTimeZoneOffsetMs = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
  );
  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );
  return asUtc - date.getTime();
};

const zonedTimeToIso = (date: string, time: string, timeZone: string) => {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const naiveUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const offset = getTimeZoneOffsetMs(naiveUtc, timeZone);
  return new Date(naiveUtc.getTime() - offset).toISOString();
};

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

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
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const { data: availability, isLoading: loadingAvailability, isError: availabilityError } = useGetLessonAvailability(lessonId);
  const { data: bookingOptions, isLoading: loadingBookingOptions } = useGetLessonBookingOptions(
    lessonId,
    bookingType === "group" ? selectedDate : undefined
  );
  const { mutateAsync, isPending } = useCreateBooking();

  useEffect(() => {
    if (!open || !token || (role !== "student" && role !== "parent")) return;

    setLoadingStudents(true);
    const endpoint = role === "student" ? "/student/me" : "/parent/me";
    axiosAPI
      .get<IProfileResponse>(endpoint, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        if (role === "student") {
          if (data.data?.id) {
            setStudentId(data.data.id);
            setSelfStudent({
              id: data.data.id,
              name: data.data.name ?? "",
              address: data.data.address ?? null,
              latitude: data.data.latitude ?? null,
              longitude: data.data.longitude ?? null,
            });
          }
          return;
        }
        const linkedStudents = data.data?.students ?? [];
        setStudents(linkedStudents);
        setStudentId(linkedStudents[0]?.id ?? null);
        setSelfStudent(null);
      })
      .catch(() => toast.error(bookingCopy.failed))
      .finally(() => setLoadingStudents(false));
  }, [open, role, token, language, bookingCopy.failed]);

  const availableSlots = useMemo(() => availability?.data ?? [], [availability?.data]);
  const minimumDate = getTodayInputValue();

  const timesForDate = useMemo(() => {
    if (!selectedDate || durationMinutes <= 0) return [];

    if (bookingType === "group" && bookingOptions?.data) {
      return bookingOptions.data
        .filter((option) => option.is_available)
        .sort((a, b) => a.requested_start_at.localeCompare(b.requested_start_at))
        .map((option) => ({
          value: option.requested_start_at,
          label: \`\${option.local_time} (\${option.timezone}) — \${option.available_seats ?? 0} \${option.available_seats === 1 ? "seat" : "seats"}\`,
        }));
    }

    const weekday = isoWeekdayFromDate(selectedDate);
    const candidates: Array<{ value: string; label: string }> = [];

    availableSlots
      .filter((slot: ILessonAvailabilitySlot) => slot.is_active && slot.day_of_week === weekday)
      .forEach((slot) => {
        const start = timeToMinutes(slot.start_time.slice(0, 5));
        const end = timeToMinutes(slot.end_time.slice(0, 5));
        for (let cursor = start; cursor + durationMinutes <= end; cursor += durationMinutes) {
          const time = \`\${String(Math.floor(cursor / 60)).padStart(2, "0")}:\${String(cursor % 60).padStart(2, "0")}\`;
          candidates.push({ value: \`\${time}|\${slot.timezone}\`, label: \`\${time} (\${slot.timezone})\` });
        }
      });

    return Array.from(new Map(candidates.map((item) => [item.value, item])).values())
      .sort((a, b) => a.value.localeCompare(b.value));
  }, [availableSlots, bookingOptions?.data, bookingType, selectedDate, durationMinutes]);

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
        selectedStudentBeforeRequest?.longitude == null
      )
    {
      toast.error(bookingCopy.studentLocationRequired);
      return;
    }

    const selectedBookingOption =
      bookingType === "group"
        ? bookingOptions?.data.find((option) => option.requested_start_at === selectedTime)
        : undefined;

    const requestedStartAt = selectedBookingOption?.requested_start_at
      ?? (() => {
        const [time, timezone] = selectedTime.split("|");
        return zonedTimeToIso(selectedDate, time, timezone);
      })();

    const selectedStudent =
      role === "student"
        ? selfStudent
        : students.find((student) => student.id === studentId);

    try {
      const response = await mutateAsync({
        token,
        lessonId,
        booking: {
          student_id: studentId,
          requested_start_at: requestedStartAt,
          ...(customerNote.trim() ? { customer_note: customerNote.trim() } : {}),
          ...(needsStudentLocation && selectedStudent?.address
            ? { student_location: selectedStudent.address }
            : {}),
        },
      });

      if (!response.status) {
        toast.error(response.message || bookingCopy.failed);
        return;
      }

      const status = response.data.status as BookingStatus;
      const statusText = bookingCopy.statuses[status] ?? status;
      toast.success(`${bookingCopy.success}: ${statusText}`);
      setOpen(false);
      setSelectedDate("");
      setSelectedTime("");
      setCustomerNote("");
    } catch {
      toast.error(bookingCopy.failed);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="block w-fit lg:w-full xl:w-fit bg-main hover:bg-main/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm px-6 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2">
        {copy.book}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" role="dialog" aria-modal="true" aria-labelledby="book-lesson-title">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <h2 id="book-lesson-title" className="text-2xl font-bold text-black-blue">{bookingCopy.title}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label={bookingCopy.cancel}><X /></button>
            </div>

            <div className="mt-6 space-y-4 font-sora">
              <div className="rounded-lg bg-[#F0F1F1] p-4 text-sm">
                {bookingType === "private" ? bookingCopy.privateRequiresApproval : bookingCopy.groupBookingRequest}
                <div className="mt-2 font-semibold">{copy.price}: {price} {copy.currency}</div>
                <div className="mt-1 text-xs text-gray-600">{bookingCopy.lessonDuration}: {durationMinutes} {copy.durationUnit}</div>
              </div>

              {role === "parent" && (
                <label className="block text-sm font-medium">
                  {bookingCopy.student}
                  {loadingStudents ? <div className="mt-2 rounded-md bg-gray-100 px-3 py-2 text-gray-600" role="status">{bookingCopy.loading}</div> : students.length === 0 ? <div className="mt-2 rounded-md border border-dashed border-gray-300 px-3 py-3 text-gray-600">{bookingCopy.noStudents}</div> : <select aria-label={bookingCopy.chooseStudent} value={studentId ?? ""} onChange={(event) => setStudentId(Number(event.target.value))} className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-main">{students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}</select>}
                </label>
              )}

              {loadingAvailability || (bookingType === "group" && !!selectedDate && loadingBookingOptions) ? (
                <div className="rounded-md bg-gray-100 px-3 py-3 text-gray-600" role="status">{bookingCopy.availabilityLoading}</div>
              ) : availabilityError ? (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-3 text-red-700" role="alert">{bookingCopy.availabilityError}</div>
              ) : availableSlots.length === 0 ? (
                <div className="rounded-md border border-dashed border-gray-300 px-3 py-3 text-gray-600">{bookingCopy.noTimes}</div>
              ) : (
                <>
                  <label className="block text-sm font-medium">
                    {bookingCopy.date}
                    <input type="date" min={minimumDate} value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-main" />
                  </label>
                  <label className="block text-sm font-medium">
                    {bookingCopy.time}
                    <select aria-label={bookingCopy.time} disabled={!selectedDate || timesForDate.length === 0} value={selectedTime} onChange={(event) => setSelectedTime(event.target.value)} className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-main">
                      <option value="">{bookingCopy.time}</option>
                      {timesForDate.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                    {selectedDate && timesForDate.length === 0 && <p className="mt-1 text-sm text-gray-600">{bookingCopy.noTimes}</p>}
                  </label>
                </>
              )}

              {deliveryMode === "offline" && offlineVisitType === "teacher_to_student" && (
                <label className="block text-sm font-medium">
                  {bookingCopy.studentLocation}
                  <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-700">
                    {(role === "student" ? selfStudent : students.find((student) => student.id === studentId))?.address
                      || bookingCopy.studentLocationPlaceholder}
                  </div>>
                </label>
              )}

              <label className="block text-sm font-medium">
                {bookingCopy.note}
                <textarea value={customerNote} onChange={(event) => setCustomerNote(event.target.value)} rows={4} maxLength={5000} className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-main" />
              </label>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-gray-300 px-5 py-2">{bookingCopy.cancel}</button>
                <button type="button" onClick={submit} disabled={isPending || loadingStudents || loadingAvailability || availableSlots.length === 0 || (role === "parent" && students.length === 0) || !selectedDate || !selectedTime || (deliveryMode === "offline" && offlineVisitType === "teacher_goes_to_student" && !studentLocation.trim())} className="inline-flex items-center justify-center gap-2 rounded-md bg-main px-5 py-2 text-white disabled:opacity-60">
                  {isPending && <Loader2 className="animate-spin" size={18} />}
                  {bookingCopy.confirm}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookLessonDialog;
