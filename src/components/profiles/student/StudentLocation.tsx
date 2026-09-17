import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [latitude, setLatitude] = useState(student.latitude != null ? String(student.latitude) : "");
  const [longitude, setLongitude] = useState(student.longitude != null ? String(student.longitude) : "");
  const mutation = useUpdateStudentLocation();

  useEffect(() => {
    setAddress(student.address || "");
    setLatitude(student.latitude != null ? String(student.latitude) : "");
    setLongitude(student.longitude != null ? String(student.longitude) : "");
  }, [student.address, student.latitude, student.longitude]);

  const text = isArabic
    ? {
        title: "موقعي للدروس الحضورية",
        hint: "يستخدم هذا الموقع للتحقق من إمكانية وصول المعلم إلى عنوانك في الدروس الحضورية.",
        address: "العنوان",
        latitude: "خط العرض",
        longitude: "خط الطول",
        useLocation: "استخدام موقعي الحالي",
        save: "حفظ الموقع",
        saved: "تم تحديث موقعك.",
        locationError: "تعذر الحصول على موقعك الحالي.",
        invalid: "أدخل العنوان وخط العرض وخط الطول بشكل صحيح.",
      }
    : {
        title: "My offline lesson location",
        hint: "This location is used to check whether a teacher can travel to you for offline lessons.",
        address: "Address",
        latitude: "Latitude",
        longitude: "Longitude",
        useLocation: "Use my current location",
        save: "Save location",
        saved: "Your location was updated.",
        locationError: "Could not get your current location.",
        invalid: "Enter an address and valid latitude/longitude.",
      };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error(text.locationError);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(7));
        setLongitude(position.coords.longitude.toFixed(7));
      },
      () => toast.error(text.locationError),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const save = async () => {
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!address.trim() || !Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lng) || lng < -180 || lng > 180) {
      toast.error(text.invalid);
      return;
    }

    try {
      await mutation.mutateAsync({ token, payload: { address: address.trim(), latitude: lat, longitude: lng } });
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

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label className="text-sm font-medium text-black-blue md:col-span-3">
          {text.address}
          <Input value={address} onChange={(event) => setAddress(event.target.value)} className="mt-2" />
        </label>
        <label className="text-sm font-medium text-black-blue">
          {text.latitude}
          <Input type="number" min="-90" max="90" step="0.0000001" value={latitude} onChange={(event) => setLatitude(event.target.value)} className="mt-2" />
        </label>
        <label className="text-sm font-medium text-black-blue">
          {text.longitude}
          <Input type="number" min="-180" max="180" step="0.0000001" value={longitude} onChange={(event) => setLongitude(event.target.value)} className="mt-2" />
        </label>
        <div className="flex items-end">
          <Button type="button" variant="outline" className="w-full" onClick={useCurrentLocation} disabled={mutation.isPending}>
            <MapPin className="me-2 h-4 w-4" />
            {text.useLocation}
          </Button>
        </div>
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
