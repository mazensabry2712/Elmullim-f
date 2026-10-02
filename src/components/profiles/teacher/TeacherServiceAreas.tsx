import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LocationPicker from "@/components/shared/LocationPicker";
import {
  useCreateTeacherServiceArea,
  useDeleteTeacherServiceArea,
  useGetTeacherServiceAreas,
  useUpdateTeacherServiceArea,
} from "@/lib/react-query/teacher/serviceAreas";
import { IServiceArea, IServiceAreaInput } from "@/interfaces/teacher/serviceAreas";
import cookieService from "@/utils/cookieService";
import { Check, Loader2, MapPin, Pencil, Plus, Radius, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n";

interface IServiceAreaForm {
  name: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  radius_km: string;
  is_active: boolean;
}

const emptyForm: IServiceAreaForm = {
  name: "",
  location: "",
  latitude: null,
  longitude: null,
  radius_km: "10",
  is_active: true,
};

const TeacherServiceAreas = () => {
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const isArabic = language === "ar";
  const [form, setForm] = useState<IServiceAreaForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data, isLoading } = useGetTeacherServiceAreas(token);
  const createMutation = useCreateTeacherServiceArea();
  const updateMutation = useUpdateTeacherServiceArea();
  const deleteMutation = useDeleteTeacherServiceArea();
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const areas = useMemo(() => data?.data || [], [data]);

  const text = isArabic
    ? {
        eyebrow: "الدروس الحضورية",
        title: "مناطق الخدمة",
        subtitle: "حدد المناطق التي يمكن للمعلم الوصول إليها لتقديم الدروس الحضورية.",
        location: "الموقع",
        radius: "نطاق الخدمة",
        radiusSuffix: "كم",
        active: "تفعيل المنطقة",
        create: "إضافة منطقة",
        save: "حفظ التعديل",
        cancel: "إلغاء",
        edit: "تعديل",
        delete: "حذف",
        noAreas: "لا توجد مناطق خدمة مضافة حتى الآن.",
        confirmDelete: "هل تريد حذف منطقة الخدمة؟",
        invalid: "اختر موقعًا صحيحًا وأدخل نطاقًا أكبر من صفر.",
        saved: "تم حفظ منطقة الخدمة.",
        updated: "تم تحديث منطقة الخدمة.",
        deleted: "تم حذف منطقة الخدمة.",
        activeLabel: "نشطة",
        inactiveLabel: "غير نشطة",
        locationRequired: "اختر موقعًا من البحث أو استخدم موقعك الحالي.",
        emptyHint: "أضف المناطق التي تستطيع الوصول إليها حتى تظهر عند إعداد الدروس الحضورية.",
      }
    : {
        eyebrow: "Offline lessons",
        title: "Service Areas",
        subtitle: "Define the locations where the teacher can travel for offline lessons.",
        location: "Location",
        radius: "Service radius",
        radiusSuffix: "km",
        active: "Active area",
        create: "Add area",
        save: "Save changes",
        cancel: "Cancel",
        edit: "Edit",
        delete: "Delete",
        noAreas: "No service areas added yet.",
        confirmDelete: "Delete this service area?",
        invalid: "Select a valid location and enter a radius greater than zero.",
        saved: "Service area saved.",
        updated: "Service area updated.",
        deleted: "Service area deleted.",
        activeLabel: "Active",
        inactiveLabel: "Inactive",
        locationRequired: "Search for a location or use your current location.",
        emptyHint: "Add the areas you can reach so they can be used when setting up offline lessons.",
      };

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const save = async () => {
    const radius = Number(form.radius_km);

    if (
      !form.name.trim() ||
      form.latitude == null ||
      form.longitude == null ||
      !Number.isFinite(radius) ||
      radius <= 0
    ) {
      toast.error(text.invalid);
      return;
    }

    const payload: IServiceAreaInput = {
      name: form.name.trim(),
      latitude: form.latitude,
      longitude: form.longitude,
      radius_km: radius,
      is_active: form.is_active,
    };

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ token, id: editingId, payload });
        toast.success(text.updated);
      } else {
        await createMutation.mutateAsync({ token, payload });
        toast.success(text.saved);
      }
      reset();
    } catch {
      toast.error(isArabic ? "تعذر حفظ منطقة الخدمة." : "Could not save the service area.");
    }
  };

  const startEdit = (area: IServiceArea) => {
    setEditingId(area.id);
    setForm({
      name: area.name,
      location: area.name,
      latitude: Number(area.latitude),
      longitude: Number(area.longitude),
      radius_km: String(area.radius_km),
      is_active: area.is_active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id: number) => {
    if (!window.confirm(text.confirmDelete)) return;

    try {
      await deleteMutation.mutateAsync({ token, id });
      toast.success(text.deleted);
      if (editingId === id) reset();
    } catch {
      toast.error(isArabic ? "تعذر حذف منطقة الخدمة." : "Could not delete the service area.");
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-black-blue/[0.06] bg-white shadow-[0_18px_55px_rgba(33,55,75,0.06)]">
      <div className="border-b border-black-blue/[0.06] bg-[linear-gradient(135deg,#F8FCFB_0%,#FFFFFF_58%,#F0FAF7_100%)] px-5 py-5 md:px-8 md:py-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-main/10 text-main md:h-14 md:w-14">
            <MapPin className="h-6 w-6 md:h-7 md:w-7" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-main">{text.eyebrow}</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-black-blue md:text-3xl">{text.title}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-black-blue/55 md:text-base">{text.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-8">
        <div className="rounded-2xl border border-main/15 bg-main/[0.035] p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
            <div className="min-w-0">
              <label className="mb-2 block text-xs font-extrabold text-black-blue">{text.location}</label>
              <LocationPicker
                value={form.location}
                latitude={form.latitude}
                longitude={form.longitude}
                disabled={isSaving}
                onChange={({ address, latitude, longitude }) =>
                  setForm((current) => ({
                    ...current,
                    name: address,
                    location: address,
                    latitude,
                    longitude,
                  }))
                }
                placeholder={text.location}
              />
              {form.latitude == null || form.longitude == null ? (
                <p className="mt-2 text-xs font-medium text-amber-600">{text.locationRequired}</p>
              ) : null}
            </div>

            <label className="text-xs font-extrabold text-black-blue">
              {text.radius}
              <div className="relative mt-2">
                <Radius className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-main" />
                <Input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={form.radius_km}
                  onChange={(event) => setForm({ ...form, radius_km: event.target.value })}
                  className="h-11 rounded-xl border-black-blue/10 bg-white ps-10 pe-12"
                  disabled={isSaving}
                />
                <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs font-bold text-black-blue/40">
                  {text.radiusSuffix}
                </span>
              </div>
            </label>
          </div>

          <div className="mt-4 flex flex-col gap-4 border-t border-black-blue/[0.07] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-2.5 text-sm font-bold text-black-blue">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => setForm({ ...form, is_active: event.target.checked })}
                className="h-4 w-4 rounded accent-main"
                disabled={isSaving}
              />
              {text.active}
            </label>

            <div className="flex flex-col gap-2 sm:flex-row">
              {editingId ? (
                <Button type="button" variant="outline" onClick={reset} disabled={isSaving} className="h-11 rounded-xl px-5">
                  <X className="me-2 h-4 w-4" />
                  {text.cancel}
                </Button>
              ) : null}
              <Button
                type="button"
                onClick={() => void save()}
                disabled={isSaving}
                className="h-11 rounded-xl bg-main px-5 font-bold shadow-[0_8px_20px_rgba(10,185,157,0.16)] hover:bg-main/90"
              >
                {isSaving ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : editingId ? <Check className="me-2 h-4 w-4" /> : <Plus className="me-2 h-4 w-4" />}
                {editingId ? text.save : text.create}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex min-h-44 items-center justify-center rounded-2xl bg-[#FBFDFC]">
              <Loader2 className="h-7 w-7 animate-spin text-main" />
            </div>
          ) : areas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black-blue/[0.1] bg-[#FBFDFC] px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-main/10 text-main">
                <MapPin className="h-6 w-6" />
              </div>
              <p className="mt-4 text-base font-extrabold text-black-blue">{text.noAreas}</p>
              <p className="mx-auto mt-1 max-w-lg text-sm leading-6 text-black-blue/50">{text.emptyHint}</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {areas.map((area) => (
                <article
                  key={area.id}
                  className="rounded-2xl border border-black-blue/[0.08] bg-white p-4 transition hover:-translate-y-0.5 hover:border-main/20 hover:shadow-[0_12px_30px_rgba(33,55,75,0.07)] sm:p-5"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="min-w-0 break-words text-sm font-extrabold text-black-blue sm:text-base">{area.name}</h3>
                        <span
                          className={
                            area.is_active
                              ? "rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700"
                              : "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-extrabold text-slate-600"
                          }
                        >
                          {area.is_active ? text.activeLabel : text.inactiveLabel}
                        </span>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#FBFDFC] px-2.5 py-1.5 text-xs font-bold text-black-blue/55">
                        <Radius className="h-3.5 w-3.5 text-main" />
                        {area.radius_km} {text.radiusSuffix}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(area)}
                      disabled={isSaving || deleteMutation.isPending}
                      className="h-10 rounded-xl border-black-blue/10 font-bold"
                    >
                      <Pencil className="me-2 h-4 w-4" />
                      {text.edit}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void remove(area.id)}
                      disabled={isSaving || deleteMutation.isPending}
                      className="h-10 rounded-xl border-red-200 font-bold text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="me-2 h-4 w-4" />
                      {text.delete}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeacherServiceAreas;
