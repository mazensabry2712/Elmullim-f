import { Button } from "@/components/ui/button";
import LocationPicker from "@/components/shared/LocationPicker";
import { useUpdateParentStudentLocation } from "@/lib/react-query/parent/studentLocation";
import { IStudentProfile } from "@/interfaces/students/studentProfile";
import cookieService from "@/utils/cookieService";
import handleResError from "@/utils/handleResponseError";
import { Loader2, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n";

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

  useEffect(() => {
    setAddress(student.address || "");
    setLatitude(student.latitude != null ? Number(student.latitude) : null);
    setLongitude(student.longitude != null ? Number(student.longitude) : null);
  }, [student.address, student.latitude, student.longitude]);

  const text = isArabic
    ? {
        location: "موقع الطالب",
        hint: "اختر موقع الطالب من البحث أو استخدم موقعك الحالي. لن تحتاج لإدخال إحداثيات يدويًا.",
        save: "حفظ موقع الطالب",
        saved: "تم تحديث موقع الطالب.",
        invalid: "اختر موقعًا صحيحًا قبل الحفظ.",
        unavailable: "معرّف الطالب غير متوفر.",
      }
    : {
        location: "Student location",
        hint: "Search for the student's place or use your current location. You do not need to enter coordinates manually.",
        save: "Save student location",
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
          onChange={({ address: nextAddress, latitude: nextLatitude, longitude: nextLongitude }) => {
            setAddress(nextAddress);
            setLatitude(nextLatitude);
            setLongitude(nextLongitude);
          }}
        />
      </div>

      <Button type="button" onClick={save} disabled={!student.id || mutation.isPending} className="mt-4">
        {mutation.isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
        {text.save}
      </Button>
    </div>
  );
};

export default ParentStudentLocation;
