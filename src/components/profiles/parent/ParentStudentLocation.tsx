import { Button } from "@/components/ui/button";
import LocationPicker from "@/components/shared/LocationPicker";
import { useUpdateParentStudentLocation } from "@/lib/react-query/parent/studentLocation";
import { useUnlinkParentStudent } from "@/lib/react-query/parent/studentLinks";
import { IStudentProfile } from "@/interfaces/students/studentProfile";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import { Loader2, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n";
import Swal from "sweetalert2";

interface IProps {
  student: IStudentProfile;
}

const ParentStudentLocation = ({ student }: IProps) => {
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const isArabic = language === "ar";
  const [address, setAddress] = useState(student.address || "");
  const [latitude, setLatitude] = useState<number | null>(student.latitude != null ? Number(student.latitude) : null);
  const [longitude, setLongitude] = useState<number | null>(student.longitude != null ? Number(student.longitude) : null);
  const mutation = useUpdateParentStudentLocation();
  const unlinkMutation = useUnlinkParentStudent();

  useEffect(() => {
    setAddress(student.address || "");
    setLatitude(student.latitude != null ? Number(student.latitude) : null);
    setLongitude(student.longitude != null ? Number(student.longitude) : null);
  }, [student.address, student.latitude, student.longitude]);

  const text = isArabic
    ? {
        location: "موقع الطالب",
        hint: "اختر موقع الطالب من البحث. لا تستخدم موقع جهازك إلا إذا كنت موجودًا فعليًا في عنوان الطالب.",
        save: "حفظ موقع الطالب",
        unlink: "إلغاء ربط الطالب",
        unlinkConfirm: "هل تريد إلغاء ربط هذا الطالب؟ لن تتمكن من رؤية بياناته بعد ذلك.",
        saved: "تم تحديث موقع الطالب.",
        invalid: "اختر موقعًا صحيحًا قبل الحفظ.",
        unavailable: "معرّف الطالب غير متوفر.",
      }
    : {
        location: "Student location",
        hint: "Search for the student's place. Do not use your device location unless you are physically at the student's address.",
        save: "Save student location",
        unlink: "Unlink student",
        unlinkConfirm: "Unlink this student? Their private information will no longer be available to this account.",
        saved: "Student location was updated.",
        invalid: "Choose a valid location before saving.",
        unavailable: "Student id is unavailable.",
      };

  const save = async () => {
    if (!student.id) {
      toast.error(text.unavailable);
      return;
    }
    if (!address.trim() || latitude == null || longitude == null) {
      toast.error(text.invalid);
      return;
    }

    try {
      await mutation.mutateAsync({
        token,
        studentId: student.id,
        payload: { address: address.trim(), latitude, longitude },
      });
      toast.success(text.saved);
    } catch (error) {
      handleResError(error);
    }
  };

  return (
    <div className="mt-5 rounded-lg border border-main/20 bg-main/5 p-4">
      <div className="flex items-start gap-3">
        <MapPin className="mt-1 h-5 w-5 shrink-0 text-main" />
        <div>
          <h3 className="font-bold text-black-blue">{text.location}: {student.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{text.hint}</p>
        </div>
      </div>

      <div className="mt-4">
        <LocationPicker
          value={address}
          latitude={latitude}
          longitude={longitude}
          disabled={!student.id || mutation.isPending}
          allowCurrentLocation={false}
          onChange={({ address: nextAddress, latitude: nextLatitude, longitude: nextLongitude }) => {
            setAddress(nextAddress);
            setLatitude(nextLatitude);
            setLongitude(nextLongitude);
          }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" onClick={save} disabled={!student.id || mutation.isPending}>
          {mutation.isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          {text.save}
        </Button>
        <Button type="button" variant="outline" disabled={!student.id || unlinkMutation.isPending} onClick={async () => {
          const confirmation = await Swal.fire({
            title: text.unlink,
            text: text.unlinkConfirm,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: text.unlink,
            cancelButtonText: isArabic ? "إلغاء" : "Cancel",
            reverseButtons: isArabic,
            focusCancel: true,
          });
          if (!confirmation.isConfirmed || !student.id) return;
          try {
            await unlinkMutation.mutateAsync({ token, studentId: student.id });
            toast.success(isArabic ? "تم إلغاء الربط." : "Student link revoked.");
          } catch {
            toast.error(isArabic ? "تعذر إلغاء الربط." : "Could not revoke the student link.");
          }
        }}>
          {unlinkMutation.isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          {text.unlink}
        </Button>
      </div>
    </div>
  );
};

export default ParentStudentLocation;
