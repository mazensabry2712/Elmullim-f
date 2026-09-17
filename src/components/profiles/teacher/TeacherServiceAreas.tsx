import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCreateTeacherServiceArea,
  useDeleteTeacherServiceArea,
  useGetTeacherServiceAreas,
  useUpdateTeacherServiceArea,
} from "@/lib/react-query/teacher/serviceAreas";
import { IServiceArea, IServiceAreaInput } from "@/interfaces/teacher/serviceAreas";
import cookieService from "@/utils/cookieService";
import { Check, Loader2, MapPin, Pencil, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n";

interface IServiceAreaForm {
  name: string;
  latitude: string;
  longitude: string;
  radius_km: string;
  is_active: boolean;
}

const emptyForm: IServiceAreaForm = {
  name: "",
  latitude: "",
  longitude: "",
  radius_km: "10",
  is_active: true,
};

const toForm = (area: IServiceArea): IServiceAreaForm => ({
  name: area.name,
  latitude: String(area.latitude),
  longitude: String(area.longitude),
  radius_km: String(area.radius_km),
  is_active: area.is_active,
});

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
        title: "مناطق الخدمة",
        subtitle: "حدد المناطق التي يمكن للمعلم الوصول إليها في الدروس الحضورية.",
        name: "اسم المنطقة",
        latitude: "خط العرض",
        longitude: "خط الطول",
        radius: "نطاق الخدمة بالكيلومتر",
        active: "منطقة نشطة",
        create: "إضافة منطقة",
        save: "حفظ التعديل",
        cancel: "إلغاء",
        edit: "تعديل",
        delete: "حذف",
        useLocation: "استخدام موقعي الحالي",
        noAreas: "لا توجد مناطق خدمة بعد.",
        confirmDelete: "هل تريد حذف منطقة الخدمة؟",
        invalid: "أدخل اسمًا وإحداثيات صحيحة ونطاقًا أكبر من صفر.",
        locationError: "تعذر الحصول على موقعك الحالي.",
        saved: "تم حفظ منطقة الخدمة.",
        updated: "تم تحديث منطقة الخدمة.",
        deleted: "تم حذف منطقة الخدمة.",
        activeLabel: "نشطة",
        inactiveLabel: "غير نشطة",
      }
    : {
        title: "Service Areas",
        subtitle: "Define the areas where the teacher can travel for offline lessons.",
        name: "Area name",
        latitude: "Latitude",
        longitude: "Longitude",
        radius: "Service radius (km)",
        active: "Active area",
        create: "Add area",
        save: "Save changes",
        cancel: "Cancel",
        edit: "Edit",
        delete: "Delete",
        useLocation: "Use my current location",
        noAreas: "No service areas yet.",
        confirmDelete: "Delete this service area?",
        invalid: "Enter a name, valid coordinates, and a radius greater than zero.",
        locationError: "Could not get your current location.",
        saved: "Service area created.",
        updated: "Service area updated.",
        deleted: "Service area deleted.",
        activeLabel: "Active",
        inactiveLabel: "Inactive",
      };

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error(text.locationError);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          latitude: position.coords.latitude.toFixed(7),
          longitude: position.coords.longitude.toFixed(7),
        }));
      },
      () => toast.error(text.locationError),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const save = async () => {
    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);
    const radius = Number(form.radius_km);

    if (!form.name.trim() || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
        !Number.isFinite(longitude) || longitude < -180 || longitude > 180 ||
        !Number.isFinite(radius) || radius <= 0) {
      toast.error(text.invalid);
      return;
    }

    const payload: IServiceAreaInput = {
      name: form.name.trim(),
      latitude,
      longitude,
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
    setForm(toForm(area));
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
    <div className="mt-6 rounded-lg bg-white p-4 shadow-md md:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black-blue">{text.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{text.subtitle}</p>
        </div>
        <MapPin className="h-6 w-6 text-main" />
      </div>

      <div className="rounded-lg border border-dashed border-main/40 bg-main/5 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-black-blue">
            {text.name}
            <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2" placeholder={isArabic ? "مثال: دمنهور" : "e.g. Damanhur"} />
          </label>
          <label className="text-sm font-medium text-black-blue">
            {text.radius}
            <Input type="number" min="0.1" step="0.1" value={form.radius_km} onChange={(event) => setForm({ ...form, radius_km: event.target.value })} className="mt-2" />
          </label>
          <label className="text-sm font-medium text-black-blue">
            {text.latitude}
            <Input type="number" min="-90" max="90" step="0.0000001" value={form.latitude} onChange={(event) => setForm({ ...form, latitude: event.target.value })} className="mt-2" />
          </label>
          <label className="text-sm font-medium text-black-blue">
            {text.longitude}
            <Input type="number" min="-180" max="180" step="0.0000001" value={form.longitude} onChange={(event) => setForm({ ...form, longitude: event.target.value })} className="mt-2" />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" onClick={useCurrentLocation}>
            <MapPin className="me-2 h-4 w-4" />
            {text.useLocation}
          </Button>
          <label className="inline-flex items-center gap-2 text-sm font-medium text-black-blue">
            <input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} className="h-4 w-4 accent-main" />
            {text.active}
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" onClick={save} disabled={isSaving}>
            {isSaving ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : editingId ? <Check className="me-2 h-4 w-4" /> : <Plus className="me-2 h-4 w-4" />}
            {editingId ? text.save : text.create}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={reset} disabled={isSaving}>
              <X className="me-2 h-4 w-4" />
              {text.cancel}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-main" /></div>
        ) : areas.length === 0 ? (
          <p className="rounded-md bg-muted/40 p-5 text-center text-sm text-muted-foreground">{text.noAreas}</p>
        ) : (
          areas.map((area) => (
            <div key={area.id} className="flex flex-wrap items-center justify-between gap-4 rounded-md border p-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-black-blue">{area.name}</h3>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${area.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {area.is_active ? text.activeLabel : text.inactiveLabel}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {Number(area.latitude).toFixed(5)}, {Number(area.longitude).toFixed(5)} · {area.radius_km} km
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => startEdit(area)} disabled={isSaving || deleteMutation.isPending}>
                  <Pencil className="me-2 h-4 w-4" />{text.edit}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => remove(area.id)} disabled={isSaving || deleteMutation.isPending}>
                  <Trash2 className="me-2 h-4 w-4 text-red-600" />{text.delete}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherServiceAreas;
