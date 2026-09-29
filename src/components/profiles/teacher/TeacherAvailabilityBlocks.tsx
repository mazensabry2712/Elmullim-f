import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";
import {
  useCreateTeacherAvailabilityBlock,
  useDeleteTeacherAvailabilityBlock,
  useGetTeacherAvailabilityBlocks,
} from "@/lib/react-query/teacher/availabilityBlocks";

const TeacherAvailabilityBlocks = () => {
  const { language } = useI18n();
  const token = cookieService.getToken() || "";
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [reason, setReason] = useState("");

  const copy = language === "ar"
    ? { title: "فترات عدم التوفر", desc: "أضف فترات تمنع الحجز خلالها على جميع دروسك.", start: "البداية", end: "النهاية", reason: "السبب (اختياري)", add: "إضافة فترة", empty: "لا توجد فترات عدم توفر.", remove: "حذف", error: "تعذر تحميل فترات عدم التوفر", saved: "تمت إضافة فترة عدم التوفر", deleted: "تم حذف فترة عدم التوفر" }
    : { title: "Unavailable periods", desc: "Add periods when students must not book any of your lessons.", start: "Starts", end: "Ends", reason: "Reason (optional)", add: "Add period", empty: "No unavailable periods.", remove: "Remove", error: "Could not load unavailable periods", saved: "Unavailable period added", deleted: "Unavailable period removed" };

  const { data, isLoading, isError } = useGetTeacherAvailabilityBlocks(token);
  const createMutation = useCreateTeacherAvailabilityBlock();
  const deleteMutation = useDeleteTeacherAvailabilityBlock();
  const blocks = data?.data ?? [];
  const saving = createMutation.isPending;
  
  useEffect(() => {
    if (isError) toast.error(copy.error);
  }, [isError, copy.error]);

  const addBlock = async () => {
    if (!startsAt || !endsAt) return;

    try {
      await createMutation.mutateAsync({
        token,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
        reason,
      });
      setStartsAt("");
      setEndsAt("");
      setReason("");
      toast.success(copy.saved);
    } catch {
      toast.error(copy.error);
    }
  };

  const removeBlock = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ token, id });
      toast.success(copy.deleted);
    } catch {
      toast.error(copy.error);
    }
  };

  return (
    <section className="mt-10 rounded-lg border bg-white p-5">
      <h2 className="text-xl font-bold text-black-blue">{copy.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{copy.desc}</p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label className="text-sm font-medium text-black-blue">{copy.start}<input type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} className="mt-2 block h-11 w-full rounded-md border border-input px-3" /></label>
        <label className="text-sm font-medium text-black-blue">{copy.end}<input type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} className="mt-2 block h-11 w-full rounded-md border border-input px-3" /></label>
        <label className="text-sm font-medium text-black-blue">{copy.reason}<input value={reason} onChange={(event) => setReason(event.target.value)} className="mt-2 block h-11 w-full rounded-md border border-input px-3" /></label>
      </div>

      <button type="button" onClick={addBlock} disabled={saving || !startsAt || !endsAt} className="mt-4 inline-flex items-center gap-2 rounded-md bg-main px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        {copy.add}
      </button>

      <div className="mt-6 space-y-3">
        {isLoading ? <div className="flex items-center justify-center py-5"><Loader2 className="h-5 w-5 animate-spin" /></div> : blocks.length === 0 ? <p className="rounded-md border border-dashed px-4 py-5 text-sm text-muted-foreground">{copy.empty}</p> : blocks.map((block) => (
          <div key={block.id} className="flex flex-col gap-3 rounded-md border p-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-black-blue"><div className="font-semibold">{new Date(block.starts_at).toLocaleString()} → {new Date(block.ends_at).toLocaleString()}</div>{block.reason && <div className="mt-1 text-muted-foreground">{block.reason}</div>}</div>
            <button type="button" onClick={() => void removeBlock(block.id)} aria-label={`${copy.remove}: ${block.id}`} title={copy.remove} disabled={deleteMutation.isPending} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-red-200 text-red-600 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeacherAvailabilityBlocks;
