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

const ServiceAreas = () => {
  const { language } = useI18n();
  const ar = language === "ar";
  const token = cookieService.getToken() || "";
  const { data, isLoading, isError } = useGetTeacherServiceAreas(token, !!token);
  const create = useCreateTeacherServiceArea();
  const update = useUpdateTeacherServiceArea();
  const remove = useDeleteTeacherServiceArea();

  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const text = ar
    ? {
        title: "مناطق الخدمة",
        description: "حدد المناطق التي يمكنك التدريس فيها عند ذهابك إلى منزل الطالب.",
        placeholder: "مثال: مدينة نصر",
        add: "إضافة منطقة",
        save: "حفظ",
        cancel: "إلغاء",
        empty: "لم تتم إضافة مناطق خدمة بعد.",
        loadError: "تعذر تحميل مناطق الخدمة.",
        invalid: "اكتب اسم المنطقة أولًا.",
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
        placeholder: "e.g. Nasr City",
        add: "Add area",
        save: "Save",
        cancel: "Cancel",
        empty: "No service areas added yet.",
        loadError: "Could not load service areas.",
        invalid: "Enter an area name first.",
        addError: "Could not add the area.",
        updateError: "Could not update the area.",
        deleteError: "Could not delete the area.",
        active: "Active",
        inactive: "Inactive",
        edit: "Edit",
        remove: "Delete",
      };

  const submitCreate = async () => {
    if (!value.trim()) {
      toast.error(text.invalid);
      return;
    }
    try {
      await create.mutateAsync({ token, areaName: value });
      setValue("");
    } catch {
      toast.error(text.addError);
    }
  };

  const submitUpdate = async () => {
    if (!editingId || !editingValue.trim()) {
      toast.error(text.invalid);
      return;
    }
    setBusyId(editingId);
    try {
      await update.mutateAsync({
        token,
        areaId: editingId,
        areaName: editingValue,
        isActive: data?.data?.find((item) => item.id === editingId)?.is_active ?? true,
      });
      setEditingId(null);
      setEditingValue("");
    } catch {
      toast.error(text.updateError);
    } finally {
      setBusyId(null);
    }
  };

  const toggle = async (id: number, isActive: boolean, areaName: string) => {
    setBusyId(id);
    try {
      await update.mutateAsync({ token, areaId: id, areaName, isActive: !isActive });
    } catch {
      toast.error(text.updateError);
    } finally {
      setBusyId(null);
    }
  };

  const destroy = async (id: number) => {
    setBusyId(id);
    try {
      await remove.mutateAsync({ token, areaId: id });
    } catch {
      toast.error(text.deleteError);
    } finally {
      setBusyId(null);
    }
  };

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

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void submitCreate()}
              placeholder={text.placeholder}
              className="h-11 flex-1 rounded-md border border-input px-3 outline-none focus:border-main"
            />
            <button
              type="button"
              onClick={() => void submitCreate()}
              disabled={create.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-main px-5 py-2 font-semibold text-white disabled:opacity-50"
            >
              {create.isPending ? <Loader2 size={17} className="animate-spin" /> : <Plus size={17} />}
              {text.add}
            </button>
          </div>

          {isLoading && <div className="py-10 text-center font-sora text-[#4D5756]">...</div>}
          {isError && <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">{text.loadError}</div>}

          {!isLoading && !isError && (
            <div className="mt-6 space-y-3">
              {data?.data?.length ? data.data.map((area) => (
                <div key={area.id} className="rounded-lg border border-gray-200 p-4">
                  {editingId === area.id ? (
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="h-10 flex-1 rounded-md border border-input px-3 outline-none focus:border-main"
                        autoFocus
                      />
                      <button type="button" onClick={() => void submitUpdate()} disabled={busyId === area.id} className="rounded-md bg-main px-4 py-2 text-sm font-semibold text-white">{text.save}</button>
                      <button type="button" onClick={() => { setEditingId(null); setEditingValue(""); }} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold">{text.cancel}</button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-semibold text-black-blue">{area.area_name}</div>
                        <div className="mt-1 text-xs text-gray-500">{area.is_active ? text.active : text.inactive}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => { setEditingId(area.id); setEditingValue(area.area_name); }} className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm"><Pencil size={14} />{text.edit}</button>
                        <button type="button" onClick={() => void toggle(area.id, area.is_active, area.area_name)} disabled={busyId === area.id} className="rounded-md border border-main/30 px-3 py-1.5 text-sm text-main">
                          {area.is_active ? text.inactive : text.active}
                        </button>
                        <button type="button" onClick={() => void destroy(area.id)} disabled={busyId === area.id} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600"><Trash2 size={14} />{text.remove}</button>
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
