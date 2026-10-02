import { useEffect, useState } from "react";
import { CalendarClock, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";
import { formatDateTime } from "@/utils/dateTime";
import {
  useCreateTeacherAvailabilityBlock,
  useDeleteTeacherAvailabilityBlock,
  useGetTeacherAvailabilityBlocks,
} from "@/lib/react-query/teacher/availabilityBlocks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TeacherAvailabilityBlocks = () => {
  const { language } = useI18n();
  const token = cookieService.getToken() || "";
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [reason, setReason] = useState("");

  const copy =
    language === "ar"
      ? {
          eyebrow: "إدارة التوافر",
          title: "فترات عدم التوفر",
          desc: "أضف الفترات التي لا تريد استقبال حجوزات خلالها على أي من دروسك.",
          start: "وقت البداية",
          end: "وقت النهاية",
          reason: "السبب (اختياري)",
          add: "إضافة فترة",
          empty: "لا توجد فترات عدم توفر.",
          remove: "حذف",
          error: "تعذر تحميل أو حفظ فترة عدم التوفر.",
          saved: "تمت إضافة فترة عدم التوفر.",
          deleted: "تم حذف فترة عدم التوفر.",
          invalid: "يجب أن يكون وقت النهاية بعد وقت البداية.",
        }
      : {
          eyebrow: "Availability",
          title: "Unavailable periods",
          desc: "Block periods when students should not be able to book any of your lessons.",
          start: "Start time",
          end: "End time",
          reason: "Reason (optional)",
          add: "Add period",
          empty: "No unavailable periods.",
          remove: "Remove",
          error: "Could not load or save the unavailable period.",
          saved: "Unavailable period added.",
          deleted: "Unavailable period removed.",
          invalid: "End time must be after start time.",
        };

  const { data, isLoading, isError } = useGetTeacherAvailabilityBlocks(token);
  const createMutation = useCreateTeacherAvailabilityBlock();
  const deleteMutation = useDeleteTeacherAvailabilityBlock();
  const blocks = data?.data ?? [];
  const saving = createMutation.isPending;

  useEffect(() => {
    if (isError) toast.error(copy.error);
  }, [isError, copy.error]);

  const addBlock = async () => {
    const start = new Date(startsAt);
    const end = new Date(endsAt);

    if (
      !startsAt ||
      !endsAt ||
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      toast.error(copy.invalid);
      return;
    }

    try {
      await createMutation.mutateAsync({
        token,
        startsAt: start.toISOString(),
        endsAt: end.toISOString(),
        reason: reason.trim(),
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
    <section className="overflow-hidden rounded-3xl border border-black-blue/[0.06] bg-white shadow-[0_18px_55px_rgba(33,55,75,0.06)]">
      <div className="border-b border-black-blue/[0.06] px-5 py-5 md:px-7 md:py-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 md:h-12 md:w-12">
            <CalendarClock className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-main">{copy.eyebrow}</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-black-blue md:text-2xl">{copy.title}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-black-blue/50">{copy.desc}</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-7">
        <div className="rounded-2xl border border-amber-200/70 bg-amber-50/55 p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-3">
            <label className="text-xs font-extrabold text-black-blue">
              {copy.start}
              <Input
                type="datetime-local"
                value={startsAt}
                onChange={(event) => setStartsAt(event.target.value)}
                className="mt-2 h-11 rounded-xl bg-white"
                disabled={saving}
              />
            </label>

            <label className="text-xs font-extrabold text-black-blue">
              {copy.end}
              <Input
                type="datetime-local"
                value={endsAt}
                onChange={(event) => setEndsAt(event.target.value)}
                className="mt-2 h-11 rounded-xl bg-white"
                disabled={saving}
              />
            </label>

            <label className="text-xs font-extrabold text-black-blue">
              {copy.reason}
              <Input
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="mt-2 h-11 rounded-xl bg-white"
                disabled={saving}
              />
            </label>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              onClick={() => void addBlock()}
              disabled={saving || !startsAt || !endsAt}
              className="h-11 w-full rounded-xl bg-main px-5 font-bold shadow-[0_8px_20px_rgba(10,185,157,0.15)] hover:bg-main/90 sm:w-auto"
            >
              {saving ? (
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="me-2 h-4 w-4" />
              )}
              {copy.add}
            </Button>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {isLoading ? (
            <div className="flex min-h-32 items-center justify-center rounded-2xl bg-[#FBFDFC]">
              <Loader2 className="h-6 w-6 animate-spin text-main" />
            </div>
          ) : blocks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black-blue/[0.1] bg-[#FBFDFC] px-5 py-9 text-center">
              <CalendarClock className="mx-auto h-7 w-7 text-main/70" />
              <p className="mt-3 text-sm font-bold text-black-blue/60">{copy.empty}</p>
            </div>
          ) : (
            blocks.map((block) => (
              <article
                key={block.id}
                className="flex flex-col gap-4 rounded-2xl border border-black-blue/[0.08] bg-white p-4 transition hover:border-main/15 hover:shadow-[0_10px_26px_rgba(33,55,75,0.06)] sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="min-w-0">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
                      <CalendarClock className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="break-words text-sm font-extrabold leading-6 text-black-blue">
                        {formatDateTime(block.starts_at, language)}
                        <span className="mx-2 text-main/60">→</span>
                        {formatDateTime(block.ends_at, language)}
                      </p>
                      {block.reason ? (
                        <p className="mt-1 break-words text-xs leading-5 text-black-blue/50">{block.reason}</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void removeBlock(block.id)}
                  aria-label={copy.remove + ": " + block.id}
                  title={copy.remove}
                  disabled={deleteMutation.isPending}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/40 px-4 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50 sm:w-auto"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sm:hidden">{copy.remove}</span>
                </button>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default TeacherAvailabilityBlocks;
