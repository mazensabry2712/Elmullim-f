import { useState, type FormEvent } from "react";
import { Loader2, Link2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import cookieService from "@/utils/cookieService";
import type { IStudentProfile } from "@/interfaces/students/studentProfile";
import {
  useGetParentStudentLinkRequests,
  useRequestParentStudentLink,
  useUnlinkParentStudent,
} from "@/lib/react-query/parent/studentLinks";

interface Props {
  students: IStudentProfile[];
}

const ParentStudentLinks = ({ students }: Props) => {
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const ar = language === "ar";
  const [studentPhone, setStudentPhone] = useState("");
  const requests = useGetParentStudentLinkRequests(token, !!token);
  const requestLink = useRequestParentStudentLink();
  const unlinkLink = useUnlinkParentStudent();

  const text = ar
    ? {
        title: "ربط طالب بالحساب",
        description: "أدخل رقم هاتف الطالب لإرسال طلب ربط. لن تظهر بياناته أو موقعه قبل موافقته.",
        placeholder: "رقم هاتف الطالب",
        submit: "إرسال طلب الربط",
        alreadyLinked: "هذا الطالب مرتبط بحسابك بالفعل.",
        sent: "تم إرسال الطلب إن كان هناك حساب مطابق. يجب أن يوافق الطالب قبل تفعيل الربط.",
        failed: "تعذر إرسال الطلب. حاول مرة أخرى.",
        pending: "طلبات تنتظر موافقة الطلاب",
        cancelRequest: "إلغاء الطلب",
        cancelRequestTitle: "إلغاء طلب الربط؟",
        cancelRequestBody: "لن يتمكن الطالب من قبول هذا الطلب بعد إلغائه. يمكنك إرسال طلب جديد لاحقًا.",
        cancelled: "تم إلغاء طلب الربط.",
        cancelFailed: "تعذر إلغاء طلب الربط.",
        none: "لا توجد طلبات ربط معلقة.",
        retry: "إعادة المحاولة",
        invalid: "أدخل رقم هاتف مكونًا من 10 إلى 20 رقمًا.",
      }
    : {
        title: "Link a student",
        description: "Enter the student's phone number to send a link request. Their information and location stay private until they approve it.",
        placeholder: "Student phone number",
        submit: "Send link request",
        alreadyLinked: "This student is already linked to your account.",
        sent: "A request was sent if a matching account exists. The student must approve it before the link becomes active.",
        failed: "Could not send the request. Please try again.",
        pending: "Requests awaiting student approval",
        cancelRequest: "Cancel request",
        cancelRequestTitle: "Cancel link request?",
        cancelRequestBody: "The student will no longer be able to accept this request. You can send a new request later.",
        cancelled: "The link request was cancelled.",
        cancelFailed: "Could not cancel the link request.",
        none: "No pending link requests.",
        retry: "Try again",
        invalid: "Enter a phone number containing 10 to 20 digits.",
      };

  const cancelRequest = async (studentId: number) => {
    const confirmation = await Swal.fire({
      title: text.cancelRequestTitle,
      text: text.cancelRequestBody,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: text.cancelRequest,
      cancelButtonText: ar ? "إلغاء" : "Cancel",
      reverseButtons: ar,
      focusCancel: true,
    });
    if (!confirmation.isConfirmed) return;

    try {
      const response = await unlinkLink.mutateAsync({ token, studentId });
      if (response.status) {
        toast.success(text.cancelled);
        void requests.refetch();
      } else {
        toast.error(response.message || text.cancelFailed);
      }
    } catch {
      toast.error(text.cancelFailed);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const phone = studentPhone.trim();
    if (!/^\d{10,20}$/.test(phone)) {
      toast.error(text.invalid);
      return;
    }
    if (students.some((student) => student.phone === phone)) {
      toast.info(text.alreadyLinked);
      return;
    }

    try {
      const response = await requestLink.mutateAsync({ token, studentPhone: phone });
      if (response.status) {
        toast.info(text.sent);
        setStudentPhone("");
        void requests.refetch();
      } else {
        toast.error(response.message || text.failed);
      }
    } catch {
      toast.error(text.failed);
    }
  };

  return (
    <section className="my-4 rounded-xl border border-main/20 bg-main/5 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-main">
          <Link2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-sora text-base font-bold text-black-blue sm:text-lg">{text.title}</h3>
          <p className="mt-1 text-sm leading-6 text-black-blue/70">{text.description}</p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="off"
          value={studentPhone}
          onChange={(event) => setStudentPhone(event.target.value)}
          placeholder={text.placeholder}
          aria-label={text.placeholder}
          required
          pattern="[0-9]{10,20}"
          maxLength={20}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-3 text-start text-sm outline-none transition focus:border-main focus:ring-2 focus:ring-main/15"
        />
        <Button type="submit" disabled={!token || requestLink.isPending} className="sm:w-auto">
          {requestLink.isPending ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <Link2 className="me-2 h-4 w-4" />}
          {text.submit}
        </Button>
      </form>

      <div className="mt-4 border-t border-main/10 pt-3 text-sm text-black-blue/75">
        {requests.isLoading ? (
          <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />{text.pending}</span>
        ) : requests.isError ? (
          <button type="button" className="inline-flex items-center gap-2 font-semibold text-main" onClick={() => void requests.refetch()}>
            <RefreshCw className="h-4 w-4" />{text.retry}
          </button>
        ) : (requests.data?.data?.pending_count ?? 0) > 0 ? (
          <div>
            <p className="font-semibold">{text.pending}: <strong>{requests.data?.data.pending_count}</strong></p>
            <div className="mt-3 space-y-2">
              {requests.data?.data.requests.map((item) => (
                <div key={item.student_id} className="flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    {ar ? "طالب ينتهي رقمه بـ" : "Student ending in"}{" "}
                    <strong dir="ltr">{item.phone_suffix}</strong>
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={unlinkLink.isPending}
                    onClick={() => void cancelRequest(item.student_id)}
                  >
                    {unlinkLink.isPending ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : null}
                    {text.cancelRequest}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>{text.none}</p>
        )}
      </div>
    </section>
  );
};

export default ParentStudentLinks;
