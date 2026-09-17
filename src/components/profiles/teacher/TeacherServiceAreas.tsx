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
import { Check, Loader2, MapPin, Pencil, Plus, Trash2, X } from "lucide-react";
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
        title: "مناطق الخدمة",
        subtitle: "حدد المناطق التي يمكن للمعلم الوصول إليها في الدروس الحضورية.",
        name: "اسم المنطقة / الموقع",
        radius: "نطاق الخدمة بالكيلومتر",
        active: "منطقة نشطة",
        create: "إضافة منطقة",
        save: "حفظ التعديل",
        cancel: "إلغاء",
        edit: "تعديل",
        delete: "حذف",
        noAreas: "لا توجد مناطق خدمة بعد.",
        confirmDelete: "هل تريد حذف منطقة الخدمة؟",
        invalid: "اختر موقعًا صحيحًا وأدخل نطاقًا أكبر من صفر.",
        saved: "تم حفظ منطقة الخدمة.",
        updated: "تم تحديث منطقة الخدمة.",
        deleted: "تم حذف منطقة الخدمة.",
        activeLabel: "نشطة",
        inactiveLabel: "غير نشطة",
        locationRequired: "اختر الموقع من البحث أو استخدم موقعك الحالي.",
      }
    : {
        title: "Service Areas",
        subtitle: "Define the areas where the teacher can travel for offline lessons.",
        name: "Area name / location",
        radius: "Service radius (km)",
        active: "Active area",
        create: "Add area",
        save: "Save changes",
        cancel: "Cancel",
        edit: "Edit",
        delete: "Delete",
        noAreas: "No service areas yet.",
        confirmDelete: "Delete this service area?",
        invalid: "Select a valid location and enter a radius greater than zero.",
        saved: "Service area created.",
        updated: "Service area updated.",
        deleted: "Service area deleted.",
        activeLabel: "Active",
        inactiveLabel: "Inactive",
        locationRequired: "Search for a location or use your current location.",
      };

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const save = async () => {
    const radius = Number(form.radius_km);

    if (!form.name.trim() || form.latitude == null || form.longitude == null ||
        !Number.isFinite(radius) || radius <= 0) {
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
          <div className="md:col-span-2">
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
              placeholder={text.name}
            />
            {form.latitude == null || form.longitude == null ? (
              <p className="mt-1 text-xs text-amber-600">{text.locationRequired}</p>
            ) : null}
          </div>

          <label className="text-sm font-medium text-black-blue">
            {text.radius}
            <Input
              type="number"
              min="0.1"
              step="0.1"
              value={form.radius_km}
              onChange={(event) => setForm({ ...form, radius_km: event.target.value })}
              className="mt-2"
              disabled={isSaving}
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm font-medium text-black-blue">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) => setForm({ ...form, is_active: event.target.checked })}
              className="h-4 w-4 accent-main"
              disabled={isSaving}
            />
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
                <p className="mt-2 text-sm text-muted-foreground">{area.radius_km} km</p>
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
