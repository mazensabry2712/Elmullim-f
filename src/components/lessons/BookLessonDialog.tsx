import { useEffect, useMemo, useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import axiosAPI from "@/config/axios.config";
import cookieService from "@/utils/cookieService";
import { useCreateBooking } from "@/lib/react-query/booking";
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

interface IProfileResponse {
  data?: IStudentOption & {
    students?: IStudentOption[];
  };
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
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const {
    data: bookingOptions,
    isLoading: loadingBookingOptions,
    isError: bookingOptionsError,
  } = useGetLessonBookingOptions(lessonId, selectedDate);
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

  const minimumDate = getTodayInputValue();

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
        selectedStudentBeforeRequest?.longitude == null
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

              <label className="block text-sm font-medium">
                {bookingCopy.date}
                <input type="date" min={minimumDate} value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-main" />
              </label>
              <label className="block text-sm font-medium">
                {bookingCopy.time}
                <select aria-label={bookingCopy.time} disabled={!selectedDate || timesForDate.length === 0 || loadingBookingOptions || bookingOptionsError} value={selectedTime} onChange={(event) => setSelectedTime(event.target.value)} className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-main">
                  <option value="">{bookingCopy.time}</option>
                  {timesForDate.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                {selectedDate && loadingBookingOptions && <p className="mt-1 text-sm text-gray-600" role="status">{bookingCopy.availabilityLoading}</p>}
                {selectedDate && bookingOptionsError && <p className="mt-1 text-sm text-red-700" role="alert">{bookingCopy.availabilityError}</p>}
                {selectedDate && !loadingBookingOptions && !bookingOptionsError && timesForDate.length === 0 && <p className="mt-1 text-sm text-gray-600">{bookingCopy.noTimes}</p>}
              </label>

              {deliveryMode === "offline" && offlineVisitType === "teacher_to_student" && (
                <label className="block text-sm font-medium">
                  {bookingCopy.studentLocation}
                  <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-700">
                    {(role === "student" ? selfStudent : students.find((student) => student.id === studentId))?.address
                      || bookingCopy.studentLocationPlaceholder}
                  </div>
                </label>
              )}

              <label className="block text-sm font-medium">
                {bookingCopy.note}
                <textarea value={customerNote} onChange={(event) => setCustomerNote(event.target.value)} rows={4} maxLength={5000} className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-main" />
              </label>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-gray-300 px-5 py-2">{bookingCopy.cancel}</button>
                <button type="button" onClick={submit} disabled={
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
                        (role === "student" ? selfStudent : students.find((student) => student.id === studentId))?.latitude == null ||
                        (role === "student" ? selfStudent : students.find((student) => student.id === studentId))?.longitude == null
                      )
                    )
                  } className="inline-flex items-center justify-center gap-2 rounded-md bg-main px-5 py-2 text-white disabled:opacity-60">
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
