import Loader from "@/components/Loader";
import { useGetTeacherProfile, useGetTeacherRatings } from "@/lib/react-query/teacher/teacherProfile";
import cookieService from "@/utils/cookieService";
import { Award, BookOpen, BriefcaseBusiness, FileText, Mail, MapPin, Pencil, Phone, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StudentRating from "../student/StudentRating";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";

const TeacherMainProfile = () => {
  const token = cookieService.getToken() || "";
  const navigate = useNavigate();
  const { language } = useI18n();
  const isArabic = language === "ar";
  const { data: teacher, isLoading, isError, refetch } = useGetTeacherProfile(token);
  const { data: ratings, isLoading: isRatingsLoading } = useGetTeacherRatings(token);
  const profile = teacher?.data;

  const text = isArabic
    ? {
        edit: "تعديل الملف الشخصي",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        address: "العنوان",
        about: "نبذة عني",
        qualification: "المؤهلات",
        experience: "الخبرة",
        years: "سنوات",
        cv: "السيرة الذاتية",
        openCv: "فتح السيرة الذاتية",
        subjects: "موادي الدراسية",
        ratings: "تقييمات الطلاب",
        noSubjects: "لا توجد مواد دراسية مضافة بعد",
        noRatings: "لا توجد تقييمات بعد",
        unavailable: "غير متوفر",
        retry: "حاول مرة أخرى",
      }
    : {
        edit: "Edit Profile",
        email: "Email",
        phone: "Phone",
        address: "Address",
        about: "About me",
        qualification: "Qualifications",
        experience: "Experience",
        years: "years",
        cv: "Curriculum Vitae",
        openCv: "Open CV",
        subjects: "Teaching subjects",
        ratings: "Student ratings",
        noSubjects: "No teaching subjects added yet",
        noRatings: "No ratings yet",
        unavailable: "Not provided",
        retry: "Try again",
      };

  if (isLoading) {
    return <div className="mt-4 flex min-h-[360px] items-center justify-center rounded-lg bg-white"><Loader /></div>;
  }

  if (isError || !profile) {
    return (
      <div className="mt-4 rounded-lg bg-white px-5 py-20 text-center text-black-blue">
        <p className="font-sora text-lg">{isArabic ? "تعذر تحميل بيانات الملف الشخصي." : "Unable to load profile information."}</p>
        <Button type="button" onClick={() => void refetch()} className="mt-5 bg-main text-white hover:bg-main/90">{text.retry}</Button>
      </div>
    );
  }

  const ratingsData = ratings?.data || [];
  const subjects = profile.subjects || [];
  const hasDescription = Boolean(profile.description?.trim());
  const hasQualification = Boolean(profile.qualification?.trim());
  const hasExperience = profile.experince !== null && profile.experince !== undefined;
  const hasCv = Boolean(profile.cv?.trim());
  const hasAddress = Boolean(profile.address?.trim());
  const hasOptionalDetails = hasDescription || hasQualification || hasExperience || hasCv;

  return (
    <div className="mt-4 overflow-hidden rounded-lg bg-white pb-10">
      <header className="border-b border-gray-100 px-4 py-7 sm:px-6 md:px-10 lg:px-16">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-gray-100 sm:h-28 sm:w-28">
              <img src={profile.profile_image || "/images/profile-avatar.webp"} alt={profile.name || "Teacher"} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0">
              <h1 className="break-words font-epilogue text-2xl font-bold text-black-blue sm:text-3xl md:text-4xl">{profile.name || text.unavailable}</h1>
              {Number(profile.rating ?? 0) > 0 ? (
                <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-black-blue/65">
                  <Star className="h-4 w-4 fill-current text-[#E0BA00]" />
                  {Number(profile.rating).toFixed(1)}
                </div>
              ) : null}
            </div>
          </div>
          <Button type="button" onClick={() => navigate("/profile/update")} className="w-full shrink-0 bg-main font-sora text-white hover:bg-main/90 sm:w-auto">
            <Pencil className="me-2 h-4 w-4" />
            {text.edit}
          </Button>
        </div>
      </header>

      <div className="px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 border-b border-gray-100 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: text.email, value: profile.email, icon: Mail, dir: "ltr" as const },
            { label: text.phone, value: profile.phone, icon: Phone, dir: "ltr" as const },
            ...(hasAddress ? [{ label: text.address, value: profile.address, icon: MapPin }] : []),
          ].map(({ label, value, icon: Icon, dir }) => (
            <div key={label} className="flex min-w-0 items-start gap-3 border-gray-100 py-4 sm:border-e sm:px-5 sm:first:ps-0 sm:last:border-e-0 sm:last:pe-0">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-main" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-black-blue/45">{label}</p>
                <p dir={dir} className="mt-1 break-words text-sm font-medium text-black-blue">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {hasOptionalDetails ? (
          <div className="grid gap-8 border-b border-gray-100 py-8 md:grid-cols-2">
            {hasDescription ? (
              <section><h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-black-blue"><FileText className="h-5 w-5 text-main" />{text.about}</h2><p className="whitespace-pre-wrap break-words text-sm leading-7 text-black-blue/75 sm:text-base">{profile.description}</p></section>
            ) : null}

            {hasQualification || hasExperience ? (
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-black-blue"><Award className="h-5 w-5 text-main" />{text.qualification}</h2>
                {hasQualification ? <p className="break-words text-sm leading-7 text-black-blue/75 sm:text-base">{profile.qualification}</p> : null}
                {hasExperience ? <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-main/5 px-3 py-2 text-sm font-semibold text-black-blue"><BriefcaseBusiness className="h-4 w-4 text-main" />{profile.experince} {text.years}</div> : null}
              </section>
            ) : null}

            {hasCv ? (
              <section className="md:col-span-2">
                <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-black-blue"><FileText className="h-5 w-5 text-main" />{text.cv}</h2>
                <a href={profile.cv} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md bg-main px-5 py-3 text-sm font-semibold text-white transition hover:bg-main/90"><FileText className="h-4 w-4" />{text.openCv}</a>
              </section>
            ) : null}
          </div>
        ) : null}

        <section className="border-b border-gray-100 py-8">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-black-blue md:text-2xl"><BookOpen className="h-5 w-5 text-main" />{text.subjects}</h2>
          {subjects.length ? <div className="flex flex-wrap gap-2.5">{subjects.map((subject) => <span key={subject.id} className="rounded-md border border-main/20 bg-main/5 px-4 py-2.5 text-sm font-semibold text-black-blue">{subject.name}</span>)}</div> : <p className="text-sm text-black-blue/45">{text.noSubjects}</p>}
        </section>

        {ratingsData.length || isRatingsLoading ? (
          <section className="pt-8">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-black-blue md:text-2xl"><Star className="h-5 w-5 fill-current text-main" />{text.ratings}</h2>
            <div className="space-y-3">
              {isRatingsLoading ? <div className="flex min-h-[120px] items-center justify-center rounded-lg border border-gray-100"><Loader /></div> : ratingsData.map((rate, index) => <StudentRating key={rate.created_at + "-" + index} rate={rate} />)}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default TeacherMainProfile;