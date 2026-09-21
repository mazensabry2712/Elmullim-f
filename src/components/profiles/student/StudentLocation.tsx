import { Button } from "@/components/ui/button";
import LocationPicker from "@/components/shared/LocationPicker";
import { useUpdateStudentLocation } from "@/lib/react-query/student/location";
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

const StudentLocation = ({ student }: IProps) => {
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const isArabic = language === "ar";
  const [address, setAddress] = useState(student.address || "");
  const [latitude, setLatitude] = useState<number | null>(student.latitude != null ? Number(student.latitude) : null);
  const [longitude, setLongitude] = useState<number | null>(student.longitude != null ? Number(student.longitude) : null);
  const mutation = useUpdateStudentLocation();

  useEffect(() => {
    setAddress(student.address || "");
    setLatitude(student.latitude != null ? Number(student.latitude) : null);
    setLongitude(student.longitude != null ? Number(student.longitude) : null);
  }, [student.address, student.latitude, student.longitude]);

  const text = isArabic
    ? {
        title: "موقعي للدروس الحضورية",
        hint: "اختر مكانك من البحث أو استخدم موقعك الحالي. لن تحتاج لإدخال إحداثيات يدويًا.",
        save: "حفظ الموقع",
        saved: "تم تحديث موقعك.",
        invalid: "اختر موقعًا صحيحًا قبل الحفظ.",
      }
    : {
        title: "My offline lesson location",
        hint: "Search for your place or use your current location. You do not need to enter coordinates manually.",
        save: "Save location",
        saved: "Your location was updated.",
        invalid: "Choose a valid location before saving.",
      };

  const save = async () => {
    if (!address.trim() || latitude == null || longitude == null) {
      toast.error(text.invalid);
      return;
    }

    try {
      await mutation.mutateAsync({
        token,
        payload: { address: address.trim(), latitude, longitude },
      });
      toast.success(text.saved);
    } catch (error) {
      handleResError(error);
    }
  };

  return (
    <div className="mt-8 rounded-lg border border-main/30 bg-main/5 p-5">
      <div className="flex items-start gap-3">
        <MapPin className="mt-1 h-5 w-5 shrink-0 text-main" />
        <div>
          <h3 className="text-xl font-bold text-black-blue">{text.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{text.hint}</p>
        </div>
      </div>

      <div className="mt-5">
        <LocationPicker
          value={address}
          latitude={latitude}
          longitude={longitude}
          disabled={mutation.isPending}
          onChange={({ address: nextAddress, latitude: nextLatitude, longitude: nextLongitude }) => {
            setAddress(nextAddress);
            setLatitude(nextLatitude);
            setLongitude(nextLongitude);
          }}
        />
      </div>

      <div className="mt-4">
        <Button type="button" onClick={save} disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          {text.save}
        </Button>
      </div>
    </div>
  );
};

export default StudentLocation;
