import { useState } from "react";
import { Check, Link2, Loader2, RefreshCw, ShieldCheck, UserRound, X } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import cookieService from "@/utils/cookieService";
import {
  useGetStudentParentLinks,
  useRespondToStudentParentLink,
  useUnlinkStudentParent,
} from "@/lib/react-query/student/parentLinks";

const StudentParentLinks = () => {
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const ar = language === "ar";
  const [busyFamilyId, setBusyFamilyId] = useState<number | null>(null);
  const query = useGetStudentParentLinks(token, !!token);
  const respond = useRespondToStudentParentLink();
  const unlink = useUnlinkStudentParent();
  const links = query.data?.data?.links ?? [];
  const pending = links.filter((link) => link.status === "pending");
  const active = links.filter((link) => link.status === "active");

  const text = ar
    ? {
        title: "روابط وليّ الأمر",
        description: "وافق فقط على طلبات الربط التي تعرف أصحابها. الموافقة تسمح لوليّ الأمر بمتابعة بياناتك التعليمية والحجوزات والموقع.",
        pending: "طلبات تحتاج موافقتك",
        active: "أولياء الأمور المرتبطون",
        accept: "موافقة",
        reject: "رفض",
        unlink: "إلغاء الربط",
        unlinkTitle: "إلغاء ربط وليّ الأمر؟",
        unlinkConfirm: "بعد الإلغاء لن يتمكن من الوصول إلى بياناتك الخاصة عبر هذا الارتباط.",
        cancel: "إلغاء",
        none: "لا توجد روابط أو طلبات حالية.",
        retry: "إعادة المحاولة",
        failed: "تعذر تحديث الربط.",
      }
    : {
        title: "Parent links",
        description: "Approve only requests from people you recognize. Approval allows a parent to view your learning details, bookings and location.",
        pending: "Requests needing your approval",
        active: "Linked parents",
        accept: "Accept",
        reject: "Reject",
        unlink: "Unlink",
        unlinkTitle: "Unlink this parent?",
        unlinkConfirm: "They will no longer be able to access your private information through this link.",
        cancel: "Cancel",
        none: "There are no current links or requests.",
        retry: "Try again",
        failed: "Could not update the link.",
      };

  const decide = async (familyId: number, decision: "accept" | "reject") => {
    setBusyFamilyId(familyId);
    try {
      const result = await respond.mutateAsync({ token, familyId, decision });
      if (!result.status) toast.error(result.message || text.failed);
      else toast.success(result.message || (ar ? "تم تحديث الربط." : "Link updated."));
    } catch {
      toast.error(text.failed);
    } finally {
      setBusyFamilyId(null);
    }
  };

  const revoke = async (familyId: number) => {
    const confirmation = await Swal.fire({
      title: text.unlinkTitle,
      text: text.unlinkConfirm,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: text.unlink,
      cancelButtonText: text.cancel,
      reverseButtons: ar,
      focusCancel: true,
    });
    if (!confirmation.isConfirmed) return;

    setBusyFamilyId(familyId);
    try {
      const result = await unlink.mutateAsync({ token, familyId });
      if (!result.status) toast.error(result.message || text.failed);
      else toast.success(result.message || (ar ? "تم إلغاء الربط." : "Link revoked."));
    } catch {
      toast.error(text.failed);
    } finally {
      setBusyFamilyId(null);
    }
  };

  return (
    <section id="parent-links" className="mt-8 scroll-mt-24 rounded-xl border border-gray-100 bg-[#FAFCFB] p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-main/10 text-main">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-sora text-xl font-bold text-black-blue md:text-2xl">{text.title}</h3>
          <p className="mt-1 text-sm leading-6 text-black-blue/70">{text.description}</p>
        </div>
      </div>

      {query.isLoading ? (
        <div className="flex items-center gap-2 py-5 text-sm text-black-blue/60" role="status">
          <Loader2 className="h-4 w-4 animate-spin" />{text.title}
        </div>
      ) : query.isError ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4" role="alert">
          <p>{text.failed}</p>
          <Button type="button" variant="outline" className="mt-3" onClick={() => void query.refetch()}>
            <RefreshCw className="me-2 h-4 w-4" />{text.retry}
          </Button>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-3 font-sora font-bold text-black-blue">{text.pending}</h4>
              <div className="space-y-3">
                {pending.map((link) => (
                  <article key={link.id} className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {link.profile_image ? (
                        <img src={link.profile_image} alt="" className="h-11 w-11 rounded-full border object-cover" />
                      ) : (
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-main"><UserRound className="h-5 w-5" /></span>
                      )}
                      <p className="break-words font-semibold text-black-blue">{link.name}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" disabled={busyFamilyId === link.id} onClick={() => void decide(link.id, "accept")}>
                        {busyFamilyId === link.id ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <Check className="me-2 h-4 w-4" />}
                        {text.accept}
                      </Button>
                      <Button type="button" variant="outline" disabled={busyFamilyId === link.id} onClick={() => void decide(link.id, "reject")}>
                        <X className="me-2 h-4 w-4" />{text.reject}
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {active.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-3 font-sora font-bold text-black-blue">{text.active}</h4>
              <div className="space-y-3">
                {active.map((link) => (
                  <article key={link.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {link.profile_image ? (
                        <img src={link.profile_image} alt="" className="h-11 w-11 rounded-full border object-cover" />
                      ) : (
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-main/10 text-main"><UserRound className="h-5 w-5" /></span>
                      )}
                      <p className="break-words font-semibold text-black-blue">{link.name}</p>
                    </div>
                    <Button type="button" variant="outline" disabled={busyFamilyId === link.id} onClick={() => void revoke(link.id)}>
                      {busyFamilyId === link.id ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <Link2 className="me-2 h-4 w-4" />}
                      {text.unlink}
                    </Button>
                  </article>
                ))}
              </div>
            </div>
          )}

          {!links.length && (
            <p className="mt-4 rounded-lg border border-dashed border-gray-300 p-4 text-sm text-black-blue/70">{text.none}</p>
          )}
        </>
      )}
    </section>
  );
};

export default StudentParentLinks;
