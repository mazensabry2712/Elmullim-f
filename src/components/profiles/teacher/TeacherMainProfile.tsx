import Loader from "@/components/Loader";
import {
  useGetTeacherProfile,
  useGetTeacherRatings,
} from "@/lib/react-query/teacher/teacherProfile";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Star,
  UserRound,
  UsersRound,
  Video,
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
  const { data: teacher, isLoading } = useGetTeacherProfile(token);
  const { data: ratings } = useGetTeacherRatings(token);
  const { language } = useI18n();
  const isArabic = language === "ar";

  const text = isArabic
    ? {
        edit: "تعديل الملف الشخصي",
        about: "نبذة عني",
        personalData: "البيانات الشخصية",
        teachingData: "البيانات التعليمية",
        name: "الاسم بالكامل",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        address: "العنوان",
        gender: "النوع",
        country: "الدولة",
        educationSystem: "نظام التعليم",
        educationLevel: "المرحلة التعليمية",
        description: "الوصف",
        qualification: "المؤهل",
        experience: "الخبرة",
        teachingTypes: "أنواع التدريس",
        subjects: "المواد الدراسية",
        teacherRatings: "تقييمات المعلم",
        cv: "السيرة الذاتية",
        openCv: "فتح السيرة الذاتية",
        noRatings: "لا توجد تقييمات بعد",
        noSubjects: "لا توجد مواد دراسية مضافة بعد",
        noTypes: "لا توجد أنواع تدريس مضافة بعد",
        nothing: "غير محدد",
        male: "ذكر",
        female: "أنثى",
        years: "سنوات",
        statistics: "ملخص المعلم",
        courses: "الكورسات",
        lessons: "الدروس",
        rating: "التقييم",
        outOfFive: "من 5",
      }
    : {
        edit: "Edit Profile",
        about: "About me",
        personalData: "Personal Information",
        teachingData: "Teaching Information",
        name: "Full name",
        email: "Email",
        phone: "Phone",
        address: "Address",
        gender: "Gender",
        country: "Country",
        educationSystem: "Education system",
        educationLevel: "Education level",
        description: "Description",
        qualification: "Qualification",
        experience: "Experience",
        teachingTypes: "Teaching types",
        subjects: "Teaching subjects",
        teacherRatings: "Teacher ratings",
        cv: "Curriculum Vitae",
        openCv: "Open CV",
        noRatings: "No ratings yet",
        noSubjects: "No teaching subjects added yet",
        noTypes: "No teaching types added yet",
        nothing: "Not provided",
        male: "Male",
        female: "Female",
        years: "years",
        statistics: "Teacher overview",
        courses: "Courses",
        lessons: "Lessons",
        rating: "Rating",
        outOfFive: "out of 5",
      };

  if (isLoading) {
    return (
      <div className="container overflow-hidden">
        <div className="my-20 flex items-center justify-center overflow-hidden rounded-lg bg-white py-20">
          <Loader />
        </div>
      </div>
    );
  }

  const profile = teacher?.data;

  if (!profile) {
    return (
      <div className="container py-20 text-center text-black-blue">
        {isArabic
          ? "تعذر تحميل بيانات الملف الشخصي."
          : "Unable to load profile information."}
      </div>
    );
  }

  const educationLevel = profile.education_level;
  const educationSystem = educationLevel?.education_system;
  const country = educationSystem?.country;

  const genderLabel =
    profile.gender === "male"
      ? text.male
      : profile.gender === "female"
        ? text.female
        : text.nothing;

  const personalItems = [
    { label: text.email, value: profile.email || text.nothing, icon: Mail },
    { label: text.phone, value: profile.phone || text.nothing, icon: Phone },
    { label: text.address, value: profile.address || text.nothing, icon: MapPin },
    { label: text.gender, value: genderLabel, icon: VenusAndMars },
    { label: text.country, value: country?.name || text.nothing, icon: MapPin },
  ];

  const teachingItems = [
    {
      label: text.educationSystem,
      value: educationSystem?.name || text.nothing,
      icon: GraduationCap,
    },
    {
      label: text.educationLevel,
      value: educationLevel?.name || text.nothing,
      icon: BookOpen,
    },
    {
      label: text.qualification,
      value: profile.qualification || text.nothing,
      icon: Award,
    },
    {
      label: text.experience,
      value:
        profile.experince != null
          ? \`${profile.experince} ${text.years}\`
          : text.nothing,
      icon: BriefcaseBusiness,
    },
  ];

  const overviewItems = [
    {
      label: text.courses,
      value: String(profile.courses_count ?? 0),
      icon: BookOpen,
    },
    {
      label: text.lessons,
      value: String(profile.lessons_count ?? 0),
      icon: Video,
    },
    {
      label: text.rating,
      value:
        Number(profile.rating ?? 0) > 0
          ? \`${Number(profile.rating).toFixed(1)} ${text.outOfFive}\`
          : text.nothing,
      icon: Star,
    },
  ];

  return (
    <div className="mt-4 overflow-hidden rounded-lg bg-white pb-10">
      <ProfileHeader profileImage={profile.profile_image} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
        className="px-4 text-start sm:px-6 md:px-10 lg:px-16"
      >
        <div className="flex flex-col gap-5 border-b border-gray-100 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-main">
              <UserRound className="h-5 w-5 shrink-0" />
              <span className="font-sora text-sm font-semibold uppercase tracking-wide">
                {text.about}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h2 className="break-words font-epilogue text-2xl font-bold text-black-blue md:text-4xl">
                {profile.name || text.nothing}
              </h2>
              {Number(profile.rating ?? 0) > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-main/10 px-3 py-1 text-sm font-bold text-main">
                  <Star className="h-4 w-4 fill-current" />
                  {Number(profile.rating).toFixed(1)}
                </span>
              ) : null}
            </div>
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

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2 text-main">
            <UsersRound className="h-5 w-5" />
            <h3 className="font-sora text-xl font-bold text-black-blue md:text-2xl">
              {text.statistics}
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {overviewItems.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="min-w-0 rounded-xl border border-main/15 bg-main/5 p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 text-main">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="font-sora text-xs font-semibold uppercase tracking-wide">
                    {label}
                  </span>
                </div>
                <p className="mt-2 break-words font-sora text-lg font-bold text-black-blue md:text-xl">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2 text-main">
            <UserRound className="h-5 w-5" />
            <h3 className="font-sora text-xl font-bold text-black-blue md:text-2xl">
              {text.personalData}
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {personalItems.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="min-w-0 rounded-xl border border-gray-100 bg-[#FAFCFB] p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center gap-2 text-main">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="font-sora text-xs font-semibold uppercase tracking-wide">
                    {label}
                  </span>
                </div>
                <p className="break-words font-sora text-sm font-medium leading-6 text-black-blue md:text-base">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-gray-100 bg-[#FAFCFB] p-5">
          <div className="mb-3 flex items-center gap-2 text-main">
            <FileText className="h-5 w-5" />
            <h3 className="font-sora text-xl font-bold text-black-blue md:text-2xl">
              {text.description}
            </h3>
          </div>
          <p className="whitespace-pre-wrap break-words font-sora text-sm leading-7 text-black-blue md:text-base">
            {profile.description?.trim() || text.nothing}
          </p>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2 text-main">
            <GraduationCap className="h-5 w-5" />
            <h3 className="font-sora text-xl font-bold text-black-blue md:text-2xl">
              {text.teachingData}
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {teachingItems.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="min-w-0 rounded-xl border border-gray-100 bg-[#FAFCFB] p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center gap-2 text-main">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="font-sora text-xs font-semibold uppercase tracking-wide">
                    {label}
                  </span>
                </div>
                <p className="break-words font-sora text-sm font-medium leading-6 text-black-blue">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2 text-main">
            <WalletCards className="h-5 w-5" />
            <h3 className="font-sora text-xl font-bold text-black-blue md:text-2xl">
              {text.teachingTypes}
            </h3>
          </div>

          {profile.course_types?.length ? (
            <div className="flex flex-wrap gap-3">
              {profile.course_types.map((type) => (
                <div
                  key={type}
                  className="max-w-full rounded-xl border border-main/30 bg-main/5 px-5 py-3 font-sora text-sm font-semibold text-black-blue"
                >
                  {courseTypeLabel(type, language)}
                </div>
              ))}
            </div>
          ) : (
            <p className="font-sora text-sm text-muted-foreground">
              {text.noTypes}
            </p>
          )}
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2 text-main">
            <BookOpen className="h-5 w-5" />
            <h3 className="font-sora text-xl font-bold text-black-blue md:text-2xl">
              {text.subjects}
            </h3>
          </div>

          {profile.subjects?.length ? (
            <div className="flex flex-wrap gap-3">
              {profile.subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="max-w-full rounded-xl border border-main/30 bg-main/5 px-5 py-3 font-sora text-sm font-semibold text-black-blue"
                >
                  <span className="break-words">{subject.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-sora text-sm text-muted-foreground">
              {text.noSubjects}
            </p>
          )}
        </section>

        <section className="mt-8 rounded-xl border border-gray-100 bg-[#FAFCFB] p-5">
          <div className="mb-3 flex items-center gap-2 text-main">
            <FileText className="h-5 w-5" />
            <h3 className="font-sora text-xl font-bold text-black-blue md:text-2xl">
              {text.cv}
            </h3>
          </div>

          {profile.cv ? (
            <a
              href={profile.cv}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-[5px] bg-main px-5 py-3 font-sora text-sm font-semibold text-white transition hover:bg-main/90 sm:w-fit"
            >
              {text.openCv}
            </a>
          ) : (
            <p className="font-sora text-sm text-muted-foreground">
              {text.nothing}
            </p>
          )}
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center gap-2 text-main">
            <Star className="h-5 w-5" />
            <h3 className="font-sora text-xl font-bold text-black-blue md:text-2xl">
              {text.teacherRatings}
            </h3>
          </div>

          <div className="min-h-[180px] space-y-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm md:p-4">
            {!ratings?.data?.length ? (
              <div className="flex min-h-[150px] items-center justify-center text-center">
                <p className="font-sora text-sm text-muted-foreground">
                  {text.noRatings}
                </p>
              </div>
            ) : (
              ratings.data.map((rate, index) => (
                <StudentRating
                  key={rate.created_at + "-" + index}
                  rate={rate}
                />
              ))
            )}
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default TeacherMainProfile;
