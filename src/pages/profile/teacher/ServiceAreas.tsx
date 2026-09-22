import { useState } from "react";
import { Loader2, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";
import {
  useCreateTeacherServiceArea,
  useDeleteTeacherServiceArea,
  useGetTeacherServiceAreas,
  useUpdateTeacherServiceArea,
} from "@/lib/react-query/teacher/serviceAreas";
import type { IServiceArea } from "@/interfaces/teacher/serviceAreas";

const DEFAULT_FORM = {
  name: "",
  latitude: "",
  longitude: "",
  radius_km: "10",
};

const toNumber = (value: string) => Number(value);

const ServiceAreas = () => {
  const { language } = useI18n();
  const ar = language === "ar";
  const token = cookieService.getToken() || "";
  const { data, isLoading, isError } = useGetTeacherServiceAreas(token);
  const create = useCreateTeacherServiceArea();
  const update = useUpdateTeacherServiceArea();
  const remove = useDeleteTeacherServiceArea();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingForm, setEditingForm] = useState(DEFAULT_FORM);
  const [busyId, setBusyId] = useState<number | null>(null);

  const text = ar
    ? {
        title: "مناطق الخدمة",
        description: "حدد المناطق التي يمكنك التدريس فيها عند ذهابك إلى منزل الطالب.",
        name: "اسم المنطقة",
        latitude: "خط العرض",
        longitude: "خط الطول",
        radius: "نصف القطر (كم)",
        namePlaceholder: "مثال: دمنهور",
        coordinatePlaceholder: "مثال: 31.0341",
        radiusPlaceholder: "مثال: 10",
        add: "إضافة منطقة",
        save: "حفظ",
        cancel: "إلغاء",
        empty: "لم تتم إضافة مناطق خدمة بعد.",
        loadError: "تعذر تحميل مناطق الخدمة.",
        invalid: "راجع اسم المنطقة والإحداثيات ونصف القطر.",
        addError: "تعذر إضافة المنطقة.",
        updateError: "تعذر تحديث المنطقة.",
        deleteError: "تعذر حذف المنطقة.",
        active: "نشطة",
        inactive: "غير نشطة",
        edit: "تعديل",
        remove: "حذف",
      }
    : {
        title: "Service Areas",
        description: "Define the areas where you can teach when you go to the student's location.",
        name: "Area name",
        latitude: "Latitude",
        longitude: "Longitude",
        radius: "Radius (km)",
        namePlaceholder: "e.g. Damanhur",
        coordinatePlaceholder: "e.g. 31.0341",
        radiusPlaceholder: "e.g. 10",
        add: "Add area",
        save: "Save",
        cancel: "Cancel",
        empty: "No service areas added yet.",
        loadError: "Could not load service areas.",
        invalid: "Check the area name, coordinates, and radius.",
        addError: "Could not add the area.",
        updateError: "Could not update the area.",
        deleteError: "Could not delete the area.",
        active: "Active",
        inactive: "Inactive",
        edit: "Edit",
        remove: "Delete",
      };

  const validateForm = (value: typeof DEFAULT_FORM) => {
    const latitude = toNumber(value.latitude);
    const longitude = toNumber(value.longitude);
    const radius = toNumber(value.radius_km);

    return (
      !!value.name.trim() &&
      Number.isFinite(latitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      Number.isFinite(longitude) &&
      longitude >= -180 &&
      longitude <= 180 &&
      Number.isFinite(radius) &&
      radius > 0
    );
  };

  const submitCreate = async () => {
    if (!validateForm(form)) {
      toast.error(text.invalid);
      return;
    }

    try {
      await create.mutateAsync({
        token,
        payload: {
          name: form.name.trim(),
          latitude: toNumber(form.latitude),
          longitude: toNumber(form.longitude),
          radius_km: toNumber(form.radius_km),
          is_active: true,
        },
      });
      setForm(DEFAULT_FORM);
    } catch {
      toast.error(text.addError);
    }
  };

  const startEdit = (area: IServiceArea) => {
    setEditingId(area.id);
    setEditingForm({
      name: area.name,
      latitude: String(area.latitude),
      longitude: String(area.longitude),
      radius_km: String(area.radius_km),
    });
  };

  const submitUpdate = async () => {
    if (!editingId || !validateForm(editingForm)) {
      toast.error(text.invalid);
      return;
    }

    const area = data?.data?.find((item) => item.id === editingId);
    if (!area) {
      toast.error(text.updateError);
      return;
    }

    setBusyId(editingId);
    try {
      await update.mutateAsync({
        token,
        id: editingId,
        payload: {
          name: editingForm.name.trim(),
          latitude: toNumber(editingForm.latitude),
          longitude: toNumber(editingForm.longitude),
          radius_km: toNumber(editingForm.radius_km),
          is_active: area.is_active,
        },
      });
      setEditingId(null);
      setEditingForm(DEFAULT_FORM);
    } catch {
      toast.error(text.updateError);
    } finally {
      setBusyId(null);
    }
  };

  const toggle = async (area: IServiceArea) => {
    setBusyId(area.id);
    try {
      await update.mutateAsync({
        token,
        id: area.id,
        payload: {
          name: area.name,
          latitude: toNumber(String(area.latitude)),
          longitude: toNumber(String(area.longitude)),
          radius_km: toNumber(String(area.radius_km)),
          is_active: !area.is_active,
        },
      });
    } catch {
      toast.error(text.updateError);
    } finally {
      setBusyId(null);
    }
  };

  const destroy = async (id: number) => {
    setBusyId(id);
    try {
      await remove.mutateAsync({ token, id });
    } catch {
      toast.error(text.deleteError);
    } finally {
      setBusyId(null);
    }
  };

  const renderForm = (
    value: typeof DEFAULT_FORM,
    setValue: (next: typeof DEFAULT_FORM) => void,
    submit: () => void,
    submitLabel: string,
    isPending: boolean
  ) => (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-semibold text-black-blue">{text.name}</label>
        <input
          value={value.name}
          onChange={(e) => setValue({ ...value, name: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && void submit()}
          placeholder={text.namePlaceholder}
          className="h-11 w-full rounded-md border border-input px-3 outline-none focus:border-main"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-black-blue">{text.latitude}</label>
        <input
          value={value.latitude}
          onChange={(e) => setValue({ ...value, latitude: e.target.value })}
          inputMode="decimal"
          placeholder={text.coordinatePlaceholder}
          className="h-11 w-full rounded-md border border-input px-3 outline-none focus:border-main"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-black-blue">{text.longitude}</label>
        <input
          value={value.longitude}
          onChange={(e) => setValue({ ...value, longitude: e.target.value })}
          inputMode="decimal"
          placeholder={text.coordinatePlaceholder}
          className="h-11 w-full rounded-md border border-input px-3 outline-none focus:border-main"
        />
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-semibold text-black-blue">{text.radius}</label>
        <input
          value={value.radius_km}
          onChange={(e) => setValue({ ...value, radius_km: e.target.value })}
          inputMode="decimal"
          placeholder={text.radiusPlaceholder}
          className="h-11 w-full rounded-md border border-input px-3 outline-none focus:border-main"
        />
      </div>
      <div className="md:col-span-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void submit()}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-main px-5 py-2 font-semibold text-white disabled:opacity-50"
        >
          {isPending ? <Loader2 size={17} className="animate-spin" /> : <Plus size={17} />}
          {submitLabel}
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F0F1F1] py-10 md:py-16">
      <div className="container max-w-4xl">
        <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 shrink-0 text-main" />
            <div>
              <h1 className="text-2xl font-bold text-black-blue md:text-4xl">{text.title}</h1>
              <p className="mt-2 font-sora text-sm leading-6 text-[#4D5756]">{text.description}</p>
            </div>
          </div>

          <div className="mt-8">
            {renderForm(form, setForm, submitCreate, text.add, create.isPending)}
          </div>

          {isLoading && <div className="py-10 text-center font-sora text-[#4D5756]">...</div>}
          {isError && <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">{text.loadError}</div>}

          {!isLoading && !isError && (
            <div className="mt-6 space-y-3">
              {data?.data?.length ? data.data.map((area) => (
                <div key={area.id} className="rounded-lg border border-gray-200 p-4">
                  {editingId === area.id ? (
                    <div className="space-y-3">
                      {renderForm(editingForm, setEditingForm, submitUpdate, text.save, busyId === area.id)}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditingForm(DEFAULT_FORM);
                        }}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold"
                      >
                        {text.cancel}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-semibold text-black-blue">{area.name}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          {area.latitude}, {area.longitude} · {area.radius_km} km · {area.is_active ? text.active : text.inactive}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(area)}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                        >
                          <Pencil size={14} />
                          {text.edit}
                        </button>
                        <button
                          type="button"
                          onClick={() => void toggle(area)}
                          disabled={busyId === area.id}
                          className="rounded-md border border-main/30 px-3 py-1.5 text-sm text-main"
                        >
                          {area.is_active ? text.inactive : text.active}
                        </button>
                        <button
                          type="button"
                          onClick={() => void destroy(area.id)}
                          disabled={busyId === area.id}
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600"
                        >
                          <Trash2 size={14} />
                          {text.remove}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )) : (
                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center font-sora text-[#4D5756]">{text.empty}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ServiceAreas;
