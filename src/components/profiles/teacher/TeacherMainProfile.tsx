import Loader from "@/components/Loader";
import { useGetTeacherProfile, useGetTeacherRatings } from "@/lib/react-query/teacher/teacherProfile";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Star,
  UserRound,
  VenusAndMars,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../ProfileHeader";
import StudentRating from "../student/StudentRating";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";

const courseTypeLabel = (type: string, language: "ar" | "en") => {
  const labels: Record<string, { ar: string; en: string }> = {
    private: { ar: "خاص", en: "Private" },
    group: { ar: "مجموعات", en: "Group" },
    general: { ar: "مجموعات", en: "Group" },
    online: { ar: "أونلاين", en: "Online" },
    offline: { ar: "حضوري", en: "Offline" },
  };
  return labels[type]?.[language] ?? type;
};

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
        about: "نبذة عن المعلم",
        personalData: "البيانات الشخصية",
        teachingData: "البيانات التعليمية",
        subjects: "المواد الدراسية",
        description: "نبذة",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        address: "العنوان",
        gender: "النوع",
        country: "الدولة",
        educationSystem: "نظام التعليم",
        educationLevel: "المرحلة التعليمية",
        qualification: "المؤهل العلمي",
        experience: "سنوات الخبرة",
        teachingTypes: "أنواع التدريس",
        courses: "الكورسات",
        lessons: "الدروس",
        rating: "التقييم",
        ratings: "تقييمات المعلم",
        noRatings: "لا توجد تقييمات بعد",
        noSubjects: "لا توجد مواد دراسية مضافة بعد",
        cv: "السيرة الذاتية",
        openCv: "فتح السيرة الذاتية",
        noCv: "لم تتم إضافة سيرة ذاتية بعد",
        contact: "التواصل",
        chat: "فتح الدردشة",
        edit: "تعديل الملف الشخصي",
        nothing: "غير محدد",
        male: "ذكر",
        female: "أنثى",
        years: "سنة",
        retry: "حاول مرة أخرى",
      }
    : {
        about: "About the teacher",
        personalData: "Personal Information",
        teachingData: "Teaching Information",
        subjects: "Teaching Subjects",
        description: "Description",
        email: "Email",
        phone: "Phone",
        address: "Address",
        gender: "Gender",
        country: "Country",
        educationSystem: "Education system",
        educationLevel: "Education level",
        qualification: "Qualification",
        experience: "Experience",
        teachingTypes: "Teaching types",
        courses: "Courses",
        lessons: "Lessons",
        rating: "Rating",
        ratings: "Teacher ratings",
        noRatings: "No ratings yet",
        noSubjects: "No teaching subjects added yet",
        cv: "Curriculum Vitae",
        openCv: "Open CV",
        noCv: "No CV added yet",
        contact: "Contact",
        chat: "Open chat",
        edit: "Edit Profile",
        nothing: "Not provided",
        male: "Male",
        female: "Female",
        years: "years",
        retry: "Try again",
      };

  if (isLoading) {
    return (
      <div className="mt-4 overflow-hidden rounded-lg bg-white">
        <div className="flex min-h-[420px] items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="mt-4 rounded-lg bg-white px-5 py-20 text-center text-black-blue">
        <p className="font-sora text-lg">
          {isArabic ? "تعذر تحميل بيانات الملف الشخصي." : "Unable to load profile information."}
        </p>
        <Button type="button" onClick={() => void refetch()} className="mt-5 bg-main text-white hover:bg-main/90">
          {text.retry}
        </Button>
      </div>
    );
  }

  const educationLevel = profile.education_level;
  const educationSystem = educationLevel?.education_system;
  const country = educationSystem?.country;
  const genderLabel =
    profile.gender === "male" ? text.male : profile.gender === "female" ? text.female : text.nothing;
  const courseTypes = profile.course_types || [];

  const groupedSubjects =
    profile.subjects?.reduce<Record<string, typeof profile.subjects>>((acc, subject) => {
      const level = subject.education_level?.name || text.nothing;
      (acc[level] ||= []).push(subject);
      return acc;
    }, {}) || {};

  const personalItems = [
    { label: text.email, value: profile.email || text.nothing, icon: Mail, dir: "ltr" as const },
    { label: text.phone, value: profile.phone || text.nothing, icon: Phone, dir: "ltr" as const },
    { label: text.address, value: profile.address || text.nothing, icon: MapPin },
    { label: text.gender, value: genderLabel, icon: VenusAndMars },
    { label: text.country, value: country?.name || text.nothing, icon: MapPin },
  ];

  const teachingItems = [
    { label: text.educationSystem, value: educationSystem?.name || text.nothing, icon: GraduationCap },
    { label: text.educationLevel, value: educationLevel?.name || text.nothing, icon: BookOpen },
    { label: text.qualification, value: profile.qualification || text.nothing, icon: Award },
    {
      label: text.experience,
      value: profile.experince != null ? `${profile.experince} ${text.years}` : text.nothing,
      icon: GraduationCap,
    },
  ];

  const statItems = [
    { label: text.courses, value: profile.courses_count ?? 0, icon: BookOpen },
    { label: text.lessons, value: profile.lessons_count ?? 0, icon: GraduationCap },
    { label: text.rating, value: Number(profile.rating ?? 0).toFixed(1), icon: Star },
  ];

  return (
    <div className="mt-4 overflow-hidden rounded-lg bg-white pb-10">
      <ProfileHeader profileImage={profile.profile_image || "/images/profile-avatar.webp"} />

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        viewport={{ once: true }}
        className="px-4 text-start sm:px-6 md:px-10 lg:px-16"
      >
        <div className="flex flex-col gap-5 border-b border-gray-100 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-main">
              <UserRound className="h-5 w-5 shrink-0" />
              <span className="font-sora text-sm font-semibold uppercase tracking-wide">{text.about}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h2 className="break-words font-epilogue text-2xl font-bold text-black-blue md:text-4xl">
                {profile.name || text.nothing}
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF9D7] px-3 py-1.5 text-sm font-bold text-black-blue">
                <Star className="h-4 w-4 fill-current text-[#D9B800]" />
                {Number(profile.rating ?? 0).toFixed(1)}
              </span>
            </div>

            {courseTypes.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {courseTypes.map((type) => (
                  <span key={type} className="rounded-full border border-main/25 bg-main/5 px-3.5 py-1.5 font-sora text-xs font-semibold text-black-blue">
                    {courseTypeLabel(type, language)}
                  </span>
                ))}
              </div>
            ) : null}
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

        <section className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
          {statItems.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-gray-100 bg-[#FAFCFB] px-3 py-4 text-center shadow-sm sm:px-5">
              <Icon className="mx-auto h-5 w-5 text-main" />
              <p className="mt-2 text-xl font-bold text-black-blue sm:text-2xl">{value}</p>
              <p className="mt-1 truncate text-xs font-semibold text-black-blue/55 sm:text-sm">{label}</p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center gap-2 text-main">
            <UserRound className="h-5 w-5" />
            <h3 className="font-sora text-xl font-bold text-black-blue md:text-2xl">{text.personalData}</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {personalItems.map(({ label, value, icon: Icon, dir }) => (
              <div key={label} className="min-w-0 rounded-xl border border-gray-100 bg-[#FAFCFB] p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-main">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="font-sora text-xs font-semibold uppercase tracking-wide">{label}</span>
                </div>
                <p dir={dir} className="break-words font-sora text-sm font-medium leading-6 text-black-blue md:text-base">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2 text-main">
            <GraduationCap className="h-5 w-5" />
            <h3 className="font-sora text-xl font-bold text-black-blue md:text-2xl">{text.teachingData}</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {teachingItems.map(({ label, value, icon: Icon }) => (
              <div key={label} className="min-w-0 rounded-xl border border-gray-100 bg-[#FAFCFB] p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-main">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="font-sora text-xs font-semibold uppercase tracking-wide">{label}</span>
                </div>
                <p className="break-words font-sora text-sm font-medium leading-6 text-black-blue">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-gray-100 bg-[#FAFCFB] p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-main">
            <FileText className="h-5 w-5" />
            <h3 className="font-sora text-xl font-bold text-black-blue md:text-2xl">{text.description}</h3>
          </div>
          <p className="whitespace-pre-wrap break-words font-sora text-sm leading-7 text-black-blue md:text-base">
            {profile.description?.trim() || text.nothing}
          </p>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2 text-main">
            <WalletCards className="h-5 w-5" />
            <h3 className="font-sora text-xl font-bold text-black-blue md:text-2xl">{text.teachingTypes}</h3>
          </div>

          {courseTypes.length ? (
            <div className="flex flex-wrap gap-3">
              {courseTypes.map((type) => (
                <div key={type} className="rounded-xl border border-main/25 bg-main/5 px-5 py-3 font-sora text-sm font-semibold text-black-blue">
                  {courseTypeLabel(type, language)}
                </div>
              ))}
            </div>
          ) : (
            <p className="font-sora text-sm text-muted-foreground">{text.nothing}</p>
          )}
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2 text-main">
            <BookOpen className="h-5 w-5" />
            <h3 className="font-sora text-xl font-bold text-black-blue md:text-2xl">{text.subjects}</h3>
          </div>

          {Object.keys(groupedSubjects).length ? (
            <div className="space-y-5">
              {Object.entries(groupedSubjects).map(([level, subjects]) => (
                <div key={level}>
                  <h4 className="mb-3 text-sm font-bold text-black-blue md:text-base">{level}</h4>
                  <div className="flex flex-wrap gap-3">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="max-w-full rounded-xl border border-main/25 bg-main/5 px-4 py-3 font-sora text-sm font-semibold text-black-blue">
                        <span className="break-words">{subject.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-sora text-sm text-muted-foreground">{text.noSubjects}</p>
          )}
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-[#FAFCFB] p-5 shadow-sm">
            <div className="flex items-center gap-2 text-main">
              <FileText className="h-5 w-5" />
              <h3 className="font-sora text-xl font-bold text-black-blue">{text.cv}</h3>
            </div>

            {profile.cv ? (
              <a
                href={profile.cv}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-main px-5 py-3 font-sora text-sm font-semibold text-white transition hover:bg-main/90"
              >
                <FileText className="h-4 w-4" />
                {text.openCv}
              </a>
            ) : (
              <p className="mt-4 font-sora text-sm text-muted-foreground">{text.noCv}</p>
            )}
          </div>

          <div className="rounded-xl border border-gray-100 bg-[#FAFCFB] p-5 shadow-sm">
            <div className="flex items-center gap-2 text-main">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-sora text-xl font-bold text-black-blue">{text.contact}</h3>
            </div>

            <Button
              type="button"
              onClick={() => navigate("/profile", { state: { chat: true } })}
              variant="outline"
              className="mt-4 w-full border-main text-main hover:bg-main/5"
            >
              <MessageCircle className="me-2 h-4 w-4" />
              {text.chat}
            </Button>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center gap-2 text-main">
            <Star className="h-5 w-5 fill-current" />
            <h3 className="font-sora text-xl font-bold text-black-blue md:text-2xl">{text.ratings}</h3>
          </div>

          <div className="min-h-[180px] space-y-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm md:p-4">
            {isRatingsLoading ? (
              <div className="flex min-h-[150px] items-center justify-center">
                <Loader />
              </div>
            ) : !ratings?.data?.length ? (
              <div className="flex min-h-[150px] items-center justify-center text-center">
                <p className="font-sora text-sm text-muted-foreground">{text.noRatings}</p>
              </div>
            ) : (
              ratings.data.map((rate, index) => (
                <motion.div key={rate.created_at + "-" + index} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  <StudentRating rate={rate} />
                </motion.div>
              ))
            )}
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default TeacherMainProfile;
