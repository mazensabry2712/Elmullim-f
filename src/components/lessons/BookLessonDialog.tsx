import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import axiosAPI from "@/config/axios.config";
import cookieService from "@/utils/cookieService";
import { useCreateBooking } from "@/lib/react-query/booking";
import { BookingStatus } from "@/interfaces/bookings/booking";

interface IProps {
  lessonId: number;
  bookingType: "private" | "group";
  price: string | number;
  language: "ar" | "en";
}

interface IStudentOption {
  id: number;
  name: string;
}

interface IProfileResponse {
  data?: {
    id?: number;
    students?: IStudentOption[];
  };
}

const statusCopy: Record<BookingStatus, { ar: string; en: string }> = {
  booking_requested: { ar: "تم إرسال طلب الحجز", en: "Booking requested" },
  pending_teacher_approval: { ar: "في انتظار موافقة المدرس", en: "Pending teacher approval" },
  accepted: { ar: "تم قبول الحجز", en: "Booking accepted" },
  confirmed: { ar: "تم تأكيد الحجز", en: "Booking confirmed" },
  upcoming: { ar: "الحجز قادم", en: "Upcoming" },
  in_progress: { ar: "الحصة جارية", en: "In progress" },
  completed: { ar: "اكتملت الحصة", en: "Completed" },
  cancelled: { ar: "تم إلغاء الحجز", en: "Cancelled" },
  rejected: { ar: "تم رفض الحجز", en: "Rejected" },
  rescheduled: { ar: "تمت إعادة جدولة الحجز", en: "Rescheduled" },
  no_show: { ar: "لم يحضر الطالب", en: "No show" },
  disputed: { ar: "الحجز محل نزاع", en: "Disputed" },
};

const BookLessonDialog = ({ lessonId, bookingType, price, language }: IProps) => {
  const token = cookieService.getToken() || "";
  const role = cookieService.getRole();
  const [open, setOpen] = useState(false);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [students, setStudents] = useState<IStudentOption[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [requestedStartAt, setRequestedStartAt] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const { mutateAsync, isPending } = useCreateBooking();

  useEffect(() => {
    if (!open || !token || (role !== "student" && role !== "parent")) return;

    setLoadingStudents(true);
    const endpoint = role === "student" ? "/student/me" : "/parent/me";

    axiosAPI
      .get<IProfileResponse>(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        if (role === "student") {
          if (data.data?.id) setStudentId(data.data.id);
          return;
        }

        const linkedStudents = data.data?.students ?? [];
        setStudents(linkedStudents);
        setStudentId(linkedStudents[0]?.id ?? null);
      })
      .catch(() => {
        toast.error(language === "ar" ? "تعذر تحميل بيانات الحجز" : "Could not load booking data");
      })
      .finally(() => setLoadingStudents(false));
  }, [open, role, token, language]);

  const copy = language === "ar"
    ? {
        book: "احجز الآن",
        title: "حجز الدرس",
        student: "الطالب",
        chooseStudent: "اختر الطالب",
        noStudents: "لا يوجد أبناء مرتبطون بهذا الحساب.",
        date: "التاريخ والوقت المطلوب",
        note: "ملاحظة (اختياري)",
        confirm: "تأكيد طلب الحجز",
        cancel: "إلغاء",
        login: "يجب تسجيل الدخول كطالب أو ولي أمر للحجز.",
        success: "تم إنشاء الحجز بنجاح",
        failed: "تعذر إنشاء الحجز",
        loading: "جاري تحميل بيانات الحجز...",
      }
    : {
        book: "Book now",
        title: "Book lesson",
        student: "Student",
        chooseStudent: "Choose student",
        noStudents: "No linked students were found for this parent account.",
        date: "Requested date & time",
        note: "Note (optional)",
        confirm: "Submit booking",
        cancel: "Cancel",
        login: "You must be signed in as a student or parent to book.",
        success: "Booking created successfully",
        failed: "Could not create booking",
        loading: "Loading booking data...",
      };

  const submit = async () => {
    if (role !== "student" && role !== "parent") {
      toast.info(copy.login);
      return;
    }
    if (!studentId || !requestedStartAt) {
      toast.error(language === "ar" ? "اختر الطالب والموعد" : "Select a student and booking time");
      return;
    }

    try {
      const response = await mutateAsync({
        token,
        lessonId,
        booking: {
          student_id: studentId,
          requested_start_at: new Date(requestedStartAt).toISOString(),
          ...(customerNote.trim() ? { customer_note: customerNote.trim() } : {}),
        },
      });

      if (!response.status) {
        toast.error(response.message || copy.failed);
        return;
      }

      const status = response.data.status;
      const statusText = statusCopy[status]?.[language] || status;
      toast.success(`${copy.success}: ${statusText}`);
      setOpen(false);
      setRequestedStartAt("");
      setCustomerNote("");
    } catch {
      toast.error(copy.failed);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-fit lg:w-full xl:w-fit bg-main hover:bg-main/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm px-6 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
      >
        {copy.book}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="book-lesson-title"
        >
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <h2 id="book-lesson-title" className="text-2xl font-bold text-black-blue">
                {copy.title}
              </h2>
              <button type="button" onClick={() => setOpen(false)} aria-label={copy.cancel}>
                <X />
              </button>
            </div>

            <div className="mt-6 space-y-4 font-sora">
              <div className="rounded-lg bg-[#F0F1F1] p-4 text-sm">
                {bookingType === "private"
                  ? language === "ar" ? "هذا درس خاص وسيحتاج موافقة المدرس." : "This private lesson requires teacher approval."
                  : language === "ar" ? "هذا درس جماعي وسيبدأ بطلب حجز." : "This group lesson starts with a booking request."}
                <div className="mt-2 font-semibold">
                  {language === "ar" ? "السعر" : "Price"}: {price}
                </div>
              </div>

              {role === "parent" && (
                <label className="block text-sm font-medium">
                  {copy.student}
                  {loadingStudents ? (
                    <div className="mt-2 rounded-md bg-gray-100 px-3 py-2 text-gray-600" role="status">
                      {copy.loading}
                    </div>
                  ) : students.length === 0 ? (
                    <div className="mt-2 rounded-md border border-dashed border-gray-300 px-3 py-3 text-gray-600">
                      {copy.noStudents}
                    </div>
                  ) : (
                    <select
                      aria-label={copy.chooseStudent}
                      value={studentId ?? ""}
                      onChange={(event) => setStudentId(Number(event.target.value))}
                      className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-main"
                    >
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                  )}
                </label>
              )}

              <label className="block text-sm font-medium">
                {copy.date}
                <input
                  type="datetime-local"
                  value={requestedStartAt}
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={(event) => setRequestedStartAt(event.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-main"
                />
              </label>

              <label className="block text-sm font-medium">
                {copy.note}
                <textarea
                  value={customerNote}
                  onChange={(event) => setCustomerNote(event.target.value)}
                  rows={4}
                  maxLength={5000}
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-main"
                />
              </label>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-gray-300 px-5 py-2"
                >
                  {copy.cancel}
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={isPending || loadingStudents || (role === "parent" && students.length === 0)}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-main px-5 py-2 text-white disabled:opacity-60"
                >
                  {isPending && <Loader2 className="animate-spin" size={18} />}
                  {copy.confirm}
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
