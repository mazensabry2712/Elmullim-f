import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useGetParentProfile } from "@/lib/react-query/parent/parentProfile";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Pencil,
  Phone,
  UserRound,
  UsersRound,
  VenusAndMars,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../ProfileHeader";
import ParentStudentLinks from "./ParentStudentLinks";
import ParentStudentLocation from "./ParentStudentLocation";

const ParentMainProfile = () => {
  const token = cookieService.getToken() || "";
  const navigate = useNavigate();
  const { data: parent, isLoading, isError, refetch } = useGetParentProfile(token);
  const { language } = useI18n();
  const isArabic = language === "ar";

  const text = isArabic
    ? {
        about: "نبذة عني",
        account: "حساب ولي الأمر",
        edit: "تعديل الملف الشخصي",
        personalData: "البيانات الشخصية",
        name: "الاسم بالكامل",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        gender: "النوع",
        country: "الدولة",
        educationSystem: "نظام التعليم",
        educationLevel: "المرحلة التعليمية",
        description: "الوصف",
        linkedStudents: "الأبناء المرتبطون",
        students: "عدد الأبناء المرتبطين",
        nothing: "غير محدد",
        male: "ذكر",
        female: "أنثى",
        loadError: "تعذر تحميل بيانات الملف الشخصي.",
        retry: "إعادة المحاولة",
        privateNotice: "لا تظهر بيانات الطالب أو موقعه إلا بعد موافقته على طلب الربط.",
      }
    : {
        about: "About me",
        account: "Parent account",
        edit: "Edit profile",
        personalData: "Personal information",
        name: "Full name",
        email: "Email",
        phone: "Phone",
        gender: "Gender",
        country: "Country",
        educationSystem: "Education system",
        educationLevel: "Education level",
        description: "Description",
        linkedStudents: "Linked students",
        students: "Linked students",
        nothing: "Not provided",
        male: "Male",
        female: "Female",
        loadError: "Unable to load profile information.",
        retry: "Try again",
        privateNotice: "A student's information and location stay hidden until they approve the link request.",
      };

  if (isLoading) {
    return (
      <div className="container overflow-hidden">
        <div className="my-20 flex min-h-48 items-center justify-center rounded-xl bg-white py-20" role="status">
          <Loader />
        </div>
      </div>
    );
  }

  const profile = parent?.data;

  if (!profile) {
    return (
      <div className="container py-20 text-center text-black-blue" role="alert">
        <p>{text.loadError}</p>
        {isError && (
          <Button type="button" variant="outline" onClick={() => void refetch()} className="mt-4">
            {text.retry}
          </Button>
        )}
      </div>
    );
  }

  const educationLevel = profile.education_level;
  const educationSystem = educationLevel?.education_system;
  const country = educationSystem?.country;
  const students = profile.students ?? [];
  const genderLabel =
    profile.gender === "male"
      ? text.male
      : profile.gender === "female"
        ? text.female
        : text.nothing;

  const personalItems = [
    { label: text.email, value: profile.email || text.nothing, icon: Mail },
    { label: text.phone, value: profile.phone || text.nothing, icon: Phone },
    { label: text.gender, value: genderLabel, icon: VenusAndMars },
    { label: text.country, value: country?.name || text.nothing, icon: MapPin },
    { label: text.educationSystem, value: educationSystem?.name || text.nothing, icon: GraduationCap },
    { label: text.educationLevel, value: educationLevel?.name || text.nothing, icon: BookOpen },
  ];

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white pb-8 shadow-sm sm:pb-10">
      <ProfileHeader profileImage={profile.profile_image || ""} />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        viewport={{ once: true }}
        className="px-4 text-start sm:px-6 md:px-10 lg:px-16"
      >
        <div className="flex flex-col gap-5 border-b border-gray-100 pb-7 sm:pb-8 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-main">
              <UserRound className="h-5 w-5 shrink-0" />
              <span className="font-sora text-xs font-semibold uppercase tracking-wide sm:text-sm">
                {text.about} · {text.account}
              </span>
            </div>
            <h1 className="break-words font-epilogue text-2xl font-bold text-black-blue sm:text-3xl md:text-4xl">
              {profile.name || text.nothing}
            </h1>
            <p className="mt-2 max-w-2xl whitespace-pre-wrap break-words font-sora text-sm leading-6 text-black-blue/65">
              {profile.description?.trim() || text.nothing}
            </p>
          </div>

          <Button
            type="button"
            onClick={() => navigate("/profile/update")}
            className="w-full shrink-0 bg-main font-sora text-white hover:bg-main/90 md:w-auto"
          >
            <Pencil className="me-2 h-4 w-4" />
            {text.edit}
          </Button>
        </div>

        <section className="mt-7 sm:mt-8">
          <div className="mb-4 flex items-center gap-2 text-main">
            <UsersRound className="h-5 w-5" />
            <h2 className="font-sora text-lg font-bold text-black-blue sm:text-xl">
              {text.linkedStudents}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-main/15 bg-main/5 p-4">
              <div className="flex items-center gap-2 text-main">
                <UsersRound className="h-4 w-4" />
                <span className="font-sora text-xs font-semibold uppercase tracking-wide">{text.students}</span>
              </div>
              <p className="mt-2 font-sora text-2xl font-bold text-black-blue">{students.length}</p>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#FAFCFB] p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-main">
                <FileText className="h-4 w-4" />
              </span>
              <p className="text-sm leading-6 text-black-blue/70">{text.privateNotice}</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2 text-main">
            <UserRound className="h-5 w-5" />
            <h2 className="font-sora text-xl font-bold text-black-blue sm:text-2xl">{text.personalData}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
            {personalItems.map(({ label, value, icon: Icon }) => (
              <div key={label} className="min-w-0 rounded-xl border border-gray-100 bg-[#FAFCFB] p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-main">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="font-sora text-xs font-semibold uppercase tracking-wide">{label}</span>
                </div>
                <p className="break-words font-sora text-sm font-medium leading-6 text-black-blue sm:text-base">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <ParentStudentLinks students={students} />
          {students.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-[#FAFCFB] p-5 text-sm leading-6 text-black-blue/70">
              {isArabic
                ? "لا يوجد أبناء مرتبطون حاليًا. أرسل طلب ربط برقم هاتف الطالب، وستظهر بياناته هنا بعد موافقته."
                : "No students are linked yet. Send a link request using the student's phone number. Their information will appear here after they approve it."}
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {students.map((student, index) => (
                <article key={student.id ?? index} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
                    <img
                      src={student.profile_image || "/images/profile-avatar.webp"}
                      alt={student.name || text.nothing}
                      className="h-16 w-16 shrink-0 rounded-full border border-gray-200 object-cover sm:h-20 sm:w-20"
                    />
                    <div className="min-w-0">
                      <h3 className="break-words font-sora text-lg font-bold text-black-blue sm:text-xl">{student.name || text.nothing}</h3>
                      <p className="mt-1 text-sm text-black-blue/55">{text.linkedStudents}</p>
                    </div>
                  </div>
                  <ParentStudentLocation student={student} />
                </article>
              ))}
            </div>
          )}
        </section>
      </motion.div>
    </div>
  );
};

export default ParentMainProfile;
