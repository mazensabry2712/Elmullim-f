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
import {
  Activity,
  Check,
  CheckCircle2,
  CircleDot,
  Loader2,
  MapPin,
  Navigation,
  Pencil,
  Plus,
  Radius,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
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

const radiusPresets = [5, 10, 15, 25, 50];

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
  const isBusy = isSaving || deleteMutation.isPending;

  const areas = useMemo(() => data?.data || [], [data]);
  const activeAreas = useMemo(
    () => areas.filter((area) => area.is_active),
    [areas]
  );
  const inactiveAreas = useMemo(
    () => areas.filter((area) => !area.is_active),
    [areas]
  );

  const text = isArabic
    ? {
        eyebrow: "الدروس الحضورية",
        title: "مناطق الخدمة",
        subtitle:
          "حدد الأماكن التي يستطيع المعلم الوصول إليها لتقديم الدروس الحضورية، مع تحديد نطاق الخدمة لكل منطقة.",
        total: "إجمالي المناطق",
        active: "المناطق النشطة",
        paused: "المناطق المتوقفة",
        addTitle: "أضف منطقة خدمة",
        editTitle: "تعديل منطقة الخدمة",
        location: "موقع المنطقة",
        locationHint:
          "ابحث عن مدينة أو منطقة أو عنوان محدد، ثم اختر النتيجة الصحيحة من القائمة.",
        radius: "نطاق الخدمة",
        radiusSuffix: "كم",
        radiusHint: "اختر نطاقًا سريعًا أو اكتب قيمة مخصصة.",
        presets: "اقتراحات",
        activeArea: "المنطقة نشطة",
        create: "إضافة منطقة",
        save: "حفظ التعديلات",
        cancel: "إلغاء التعديل",
        reset: "تفريغ الحقول",
        edit: "تعديل",
        delete: "حذف",
        current: "محددة للتعديل",
        noAreas: "لا توجد مناطق خدمة مضافة حتى الآن.",
        emptyHint:
          "أضف مناطق الوصول الخاصة بك حتى تستطيع استخدامها عند إنشاء الدروس الحضورية.",
        confirmDelete: "حذف منطقة الخدمة؟",
        confirmDeleteText:
          "سيتم حذف المنطقة من قائمة مناطقك، ولن تكون متاحة لاختيارها في الدروس بعد ذلك.",
        confirm: "نعم، احذفها",
        keep: "إلغاء",
        invalid:
          "اختر موقعًا صحيحًا وأدخل نطاق خدمة من 0.1 إلى 1000 كم.",
        saved: "تم حفظ منطقة الخدمة بنجاح.",
        updated: "تم تحديث منطقة الخدمة بنجاح.",
        deleted: "تم حذف منطقة الخدمة.",
        saveError: "تعذر حفظ منطقة الخدمة. راجع البيانات وحاول مرة أخرى.",
        deleteError: "تعذر حذف منطقة الخدمة الآن.",
        activeLabel: "نشطة",
        inactiveLabel: "متوقفة",
        coordinates: "الإحداثيات",
        areaCount: "منطقة",
      }
    : {
        eyebrow: "Offline lessons",
        title: "Service Areas",
        subtitle:
          "Define where you can travel for offline lessons and set a service radius for every area.",
        total: "Total areas",
        active: "Active areas",
        paused: "Paused areas",
        addTitle: "Add service area",
        editTitle: "Edit service area",
        location: "Service location",
        locationHint:
          "Search for a city, area, or exact address, then choose the correct result.",
        radius: "Service radius",
        radiusSuffix: "km",
        radiusHint: "Pick a quick radius or enter a custom value.",
        presets: "Quick options",
        activeArea: "Area is active",
        create: "Add area",
        save: "Save changes",
        cancel: "Cancel edit",
        reset: "Clear fields",
        edit: "Edit",
        delete: "Delete",
        current: "Editing",
        noAreas: "No service areas added yet.",
        emptyHint:
          "Add the areas you can reach so you can reuse them when creating offline lessons.",
        confirmDelete: "Delete this service area?",
        confirmDeleteText:
          "The area will be removed from your service-area list and can no longer be selected for lessons.",
        confirm: "Yes, delete it",
        keep: "Cancel",
        invalid: "Select a valid location and enter a radius between 0.1 and 1,000 km.",
        saved: "Service area saved successfully.",
        updated: "Service area updated successfully.",
        deleted: "Service area deleted.",
        saveError: "Could not save the service area. Check the details and try again.",
        deleteError: "Could not delete the service area right now.",
        activeLabel: "Active",
        inactiveLabel: "Paused",
        coordinates: "Coordinates",
        areaCount: "areas",
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
      radius < 0.1 ||
      radius > 1000
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
      if (editingId !== null) {
        await updateMutation.mutateAsync({
          token,
          id: editingId,
          payload,
        });
        toast.success(text.updated);
      } else {
        await createMutation.mutateAsync({ token, payload });
        toast.success(text.saved);
      }

      reset();
    } catch {
      toast.error(text.saveError);
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
    const result = await Swal.fire({
      title: text.confirmDelete,
      text: text.confirmDeleteText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: text.confirm,
      cancelButtonText: text.keep,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#21374B",
      reverseButtons: isArabic,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteMutation.mutateAsync({ token, id });
      toast.success(text.deleted);

      if (editingId === id) reset();
    } catch {
      toast.error(text.deleteError);
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-black-blue/[0.06] bg-white shadow-[0_18px_55px_rgba(33,55,75,0.06)]">
      <div className="border-b border-black-blue/[0.06] bg-[linear-gradient(135deg,#F8FCFB_0%,#FFFFFF_55%,#F0FAF7_100%)] px-5 py-6 sm:px-6 md:px-8 md:py-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-main/10 text-main sm:h-14 sm:w-14">
              <MapPin className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-main sm:text-xs">
                {text.eyebrow}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-black-blue sm:text-3xl">
                {text.title}
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-black-blue/55 sm:text-base">
                {text.subtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:min-w-[330px]">
            {[
              {
                label: text.total,
                value: areas.length,
                icon: CircleDot,
              },
              {
                label: text.active,
                value: activeAreas.length,
                icon: CheckCircle2,
              },
              {
                label: text.paused,
                value: inactiveAreas.length,
                icon: Activity,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-black-blue/[0.06] bg-white/90 p-3 text-center shadow-sm sm:p-4"
              >
                <Icon className="mx-auto h-4 w-4 text-main sm:h-5 sm:w-5" />
                <p className="mt-1 text-lg font-extrabold text-black-blue sm:text-xl">
                  {value}
                </p>
                <p className="text-[10px] font-bold leading-4 text-black-blue/45 sm:text-[11px]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-8">
        <div className="overflow-hidden rounded-3xl border border-main/15 bg-main/[0.035]">
          <div className="border-b border-main/10 bg-white/70 px-4 py-4 sm:px-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
                  {editingId !== null ? (
                    <Pencil className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-extrabold text-black-blue sm:text-lg">
                    {editingId !== null ? text.editTitle : text.addTitle}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-black-blue/50 sm:text-sm">
                    {editingId !== null
                      ? text.current
                      : text.locationHint}
                  </p>
                </div>
              </div>

              {editingId !== null ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={reset}
                  disabled={isBusy}
                  className="shrink-0 rounded-xl text-black-blue/60 hover:bg-white hover:text-black-blue"
                >
                  <X className="me-2 h-4 w-4" />
                  <span className="hidden sm:inline">{text.cancel}</span>
                </Button>
              ) : null}
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.8fr)]">
              <div className="min-w-0 rounded-2xl border border-white bg-white p-3 shadow-sm sm:p-4">
                <LocationPicker
                  value={form.location}
                  latitude={form.latitude}
                  longitude={form.longitude}
                  disabled={isBusy}
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
              </div>

              <div className="min-w-0 space-y-4">
                <div className="rounded-2xl border border-white bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
                      <Radius className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-black-blue">
                        {text.radius}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-black-blue/50">
                        {text.radiusHint}
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-4">
                    <Radius className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-main" />
                    <Input
                      type="number"
                      min="0.1"
                      max="1000"
                      step="0.1"
                      inputMode="decimal"
                      value={form.radius_km}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          radius_km: event.target.value,
                        }))
                      }
                      className="h-12 rounded-xl border-black-blue/10 bg-[#FAFCFB] ps-10 pe-14 text-base font-bold text-black-blue"
                      disabled={isBusy}
                    />
                    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs font-bold text-black-blue/40">
                      {text.radiusSuffix}
                    </span>
                  </div>

                  <div className="mt-3">
                    <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-black-blue/40">
                      {text.presets}
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 xl:grid-cols-3">
                      {radiusPresets.map((radius) => {
                        const selected =
                          Number(form.radius_km) === radius;

                        return (
                          <button
                            key={radius}
                            type="button"
                            disabled={isBusy}
                            aria-pressed={selected}
                            onClick={() =>
                              setForm((current) => ({
                                ...current,
                                radius_km: String(radius),
                              }))
                            }
                            className={
                              selected
                                ? "h-10 rounded-xl border border-main bg-main px-2 text-xs font-extrabold text-white transition"
                                : "h-10 rounded-xl border border-black-blue/10 bg-white px-2 text-xs font-bold text-black-blue/65 transition hover:border-main/30 hover:bg-main/5"
                            }
                          >
                            {radius} {text.radiusSuffix}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white bg-white p-4 shadow-sm">
                  <span className="flex min-w-0 items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-extrabold text-black-blue">
                        {text.activeArea}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-black-blue/45">
                        {form.is_active ? text.activeLabel : text.inactiveLabel}
                      </span>
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        is_active: event.target.checked,
                      }))
                    }
                    className="h-5 w-5 shrink-0 accent-main"
                    disabled={isBusy}
                  />
                </label>

                <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
                  <Button
                    type="button"
                    onClick={() => void save()}
                    disabled={isBusy}
                    className="h-12 w-full rounded-xl bg-main px-5 font-extrabold text-white shadow-[0_10px_24px_rgba(10,185,157,0.16)] hover:bg-main/90"
                  >
                    {isSaving ? (
                      <Loader2 className="me-2 h-5 w-5 animate-spin" />
                    ) : editingId !== null ? (
                      <Check className="me-2 h-5 w-5" />
                    ) : (
                      <Plus className="me-2 h-5 w-5" />
                    )}
                    {editingId !== null ? text.save : text.create}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={reset}
                    disabled={isBusy}
                    className="h-12 w-full rounded-xl border-black-blue/10 bg-white font-bold text-black-blue hover:bg-black-blue/[0.03]"
                  >
                    <RotateCcw className="me-2 h-4 w-4" />
                    {text.reset}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-main">
                {text.title}
              </p>
              <h3 className="mt-1 text-xl font-extrabold text-black-blue sm:text-2xl">
                {areas.length} {text.areaCount}
              </h3>
            </div>
            {activeAreas.length > 0 ? (
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
                <Navigation className="h-3.5 w-3.5" />
                {activeAreas.length} {text.activeLabel}
              </div>
            ) : null}
          </div>

          {isLoading ? (
            <div className="flex min-h-52 items-center justify-center rounded-2xl border border-black-blue/[0.06] bg-[#FBFDFC]">
              <Loader2 className="h-7 w-7 animate-spin text-main" />
            </div>
          ) : areas.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-black-blue/[0.1] bg-[#FBFDFC] px-5 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-main/10 text-main">
                <MapPin className="h-7 w-7" />
              </div>
              <p className="mt-4 text-base font-extrabold text-black-blue sm:text-lg">
                {text.noAreas}
              </p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-black-blue/50">
                {text.emptyHint}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {areas.map((area) => {
                const isEditing = editingId === area.id;
                const latitude = Number(area.latitude);
                const longitude = Number(area.longitude);

                return (
                  <article
                    key={area.id}
                    className={
                      isEditing
                        ? "rounded-3xl border border-main/30 bg-main/[0.025] p-4 shadow-[0_12px_30px_rgba(10,185,157,0.08)] ring-2 ring-main/10 sm:p-5"
                        : "rounded-3xl border border-black-blue/[0.08] bg-white p-4 transition hover:-translate-y-0.5 hover:border-main/20 hover:shadow-[0_12px_30px_rgba(33,55,75,0.07)] sm:p-5"
                    }
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
                        <MapPin className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="min-w-0 break-words text-sm font-extrabold text-black-blue sm:text-base">
                            {area.name}
                          </h4>

                          <span
                            className={
                              area.is_active
                                ? "rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700"
                                : "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-extrabold text-slate-600"
                            }
                          >
                            {area.is_active
                              ? text.activeLabel
                              : text.inactiveLabel}
                          </span>

                          {isEditing ? (
                            <span className="rounded-full bg-main/10 px-2.5 py-1 text-[11px] font-extrabold text-main">
                              {text.current}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-main/5 px-2.5 py-1.5 text-xs font-extrabold text-black-blue/60">
                            <Radius className="h-3.5 w-3.5 text-main" />
                            {area.radius_km} {text.radiusSuffix}
                          </span>

                          {Number.isFinite(latitude) &&
                          Number.isFinite(longitude) ? (
                            <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[#FBFDFC] px-2.5 py-1.5 text-[10px] font-bold text-black-blue/45 sm:text-xs">
                              <Navigation className="h-3.5 w-3.5 shrink-0 text-main" />
                              <span className="truncate" dir="ltr">
                                {latitude.toFixed(5)}, {longitude.toFixed(5)}
                              </span>
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => startEdit(area)}
                        disabled={isBusy}
                        className="h-10 rounded-xl border-black-blue/10 font-bold"
                      >
                        <Pencil className="me-2 h-4 w-4" />
                        {text.edit}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => void remove(area.id)}
                        disabled={isBusy}
                        className="h-10 rounded-xl border-red-200 font-bold text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="me-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="me-2 h-4 w-4" />
                        )}
                        {text.delete}
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeacherServiceAreas;
