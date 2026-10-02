import Loader from "@/components/Loader";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n";
import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Star,
  UserRound,
  UsersRound,
  Video,
  WalletCards,
} from "lucide-react";
import {
  useGetTeacherProfile,
  useGetTeacherRatings,
} from "@/lib/react-query/teacher/teacherProfile";
import StudentRating from "../student/StudentRating";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const courseTypeLabel = (type: string, language: "ar" | "en") => {
  const labels: Record<string, { ar: string; en: string }> = {
    private: { ar: "دروس خاصة", en: "Private" },
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

  const copy = isArabic
    ? {
        edit: "تعديل الملف الشخصي",
        account: "حساب المعلم",
        about: "نبذة عن المعلم",
        personal: "البيانات الأساسية",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        address: "العنوان",
        gender: "النوع",
        male: "ذكر",
        female: "أنثى",
        country: "الدولة",
        educationSystem: "نظام التعليم",
        educationLevel: "المرحلة التعليمية",
        qualification: "المؤهل",
        experience: "الخبرة",
        years: "سنوات خبرة",
        subjects: "المواد الدراسية",
        noSubjects: "لا توجد مواد دراسية مضافة بعد.",
        courseTypes: "أنواع التدريس",
        courses: "الكورسات",
        lessons: "الدروس",
        rating: "التقييم",
        ratings: "تقييمات الطلاب وأولياء الأمور",
        noRatings: "لا توجد تقييمات بعد.",
        loadingRatings: "جاري تحميل التقييمات...",
        cv: "السيرة الذاتية",
        viewCv: "فتح السيرة الذاتية",
        noCv: "لم تتم إضافة سيرة ذاتية بعد.",
        notProvided: "غير متوفر",
        contact: "التواصل",
        chat: "فتح الدردشة",
      }
    : {
        edit: "Edit Profile",
        account: "Teacher account",
        about: "About the teacher",
        personal: "Basic information",
        email: "Email",
        phone: "Phone Number",
        address: "Address",
        gender: "Gender",
        male: "Male",
        female: "Female",
        country: "Country",
        educationSystem: "Education system",
        educationLevel: "Education level",
        qualification: "Qualification",
        experience: "Experience",
        years: "years of experience",
        subjects: "Teaching subjects",
        noSubjects: "No teaching subjects added yet.",
        courseTypes: "Teaching types",
        courses: "Courses",
        lessons: "Lessons",
        rating: "Rating",
        ratings: "Student & parent reviews",
        noRatings: "No ratings yet.",
        loadingRatings: "Loading ratings...",
        cv: "Curriculum Vitae",
        viewCv: "Open CV",
        noCv: "No CV has been added yet.",
        notProvided: "Not provided",
        contact: "Contact",
        chat: "Open chat",
      };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-3xl bg-white">
        <div className="flex min-h-[420px] items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="rounded-3xl bg-white px-5 py-20 text-center" role="alert">
        <p className="font-sora text-lg text-black-blue">
          {isArabic
            ? "تعذر تحميل بيانات الملف الشخصي للمعلم."
            : "Unable to load teacher profile information."}
        </p>
        <Button
          type="button"
          onClick={() => void refetch()}
          className="mt-5 bg-main text-white hover:bg-main/90"
        >
          {isArabic ? "حاول مرة أخرى" : "Try again"}
        </Button>
      </div>
    );
  }

  const educationLevel = profile.education_level;
  const educationSystem = educationLevel?.education_system;
  const country = educationSystem?.country;
  const gender =
    profile.gender === "male"
      ? copy.male
      : profile.gender === "female"
        ? copy.female
        : copy.notProvided;

  const groupedSubjects =
    profile.subjects?.reduce<Record<string, typeof profile.subjects>>((acc, subject) => {
      const level = subject.education_level?.name || copy.notProvided;
      (acc[level] ||= []).push(subject);
      return acc;
    }, {}) || {};

  const courseTypes = profile.course_types ?? [];
  const visibleRatings = ratings?.data ?? [];
  const profileImage = profile.profile_image?.trim() || "/images/profile-avatar.webp";
  const cvAvailable = Boolean(profile.cv?.trim());

  const statCards = [
    { label: copy.courses, value: profile.courses_count ?? 0, icon: BookOpen },
    { label: copy.lessons, value: profile.lessons_count ?? 0, icon: Video },
    { label: copy.rating, value: (profile.rating ?? 0).toFixed(1), icon: Star },
  ];

  const infoCards = [
    { label: copy.email, value: profile.email || copy.notProvided, icon: Mail, dir: "ltr" as const },
    { label: copy.phone, value: profile.phone || copy.notProvided, icon: Phone, dir: "ltr" as const },
    { label: copy.address, value: profile.address || copy.notProvided, icon: MapPin },
    { label: copy.gender, value: gender, icon: UserRound },
    { label: copy.country, value: country?.name || copy.notProvided, icon: MapPin },
    { label: copy.educationSystem, value: educationSystem?.name || copy.notProvided, icon: GraduationCap },
    { label: copy.educationLevel, value: educationLevel?.name || copy.notProvided, icon: BookOpen },
    { label: copy.qualification, value: profile.qualification || copy.notProvided, icon: Award },
  ];

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-[0_18px_60px_rgba(33,55,75,0.08)]">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#21374B_0%,#28566A_58%,#0AB99D_140%)] px-5 pb-8 pt-8 text-white md:px-8 md:pb-10 md:pt-10">
        <div className="absolute -left-20 -top-24 h-56 w-56 rounded-full border border-white/10" />
        <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full border border-main/30" />

        <div className="relative flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="flex min-w-0 flex-col items-center gap-5 text-center sm:flex-row sm:text-start">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-[30px] border-4 border-white/70 bg-white shadow-xl md:h-32 md:w-32">
              <img
                src={profileImage}
                alt={profile.name || (isArabic ? "صورة المعلم" : "Teacher profile")}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-[#6CE8D4]" />
                {copy.account}
              </div>
              <h1 className="break-words text-3xl font-extrabold tracking-tight md:text-4xl">
                {profile.name || copy.notProvided}
              </h1>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                  <Star className="h-3.5 w-3.5 fill-current text-[#FBDC0F]" />
                  {(profile.rating ?? 0).toFixed(1)}
                </span>
                {courseTypes.map((type) => (
                  <span
                    key={type}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold"
                  >
                    {courseTypeLabel(type, language)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => navigate("/profile/update")}
            className="w-full shrink-0 bg-white text-black-blue shadow-sm hover:bg-white/90 md:w-auto"
          >
            <Pencil className="me-2 h-4 w-4" />
            {copy.edit}
          </Button>
        </div>

        <div className="relative mt-7 grid grid-cols-3 gap-2 sm:gap-3">
          {statCards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="min-w-0 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm sm:p-4">
              <div className="flex items-center gap-2 text-white/70">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate text-[11px] font-semibold sm:text-xs">{label}</span>
              </div>
              <p className="mt-1 text-xl font-extrabold sm:text-2xl">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-10 p-5 md:p-8">
        <section>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-main">{copy.about}</p>
              <h2 className="mt-1 text-2xl font-extrabold text-black-blue md:text-3xl">
                {copy.personal}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-black-blue/55">
              <BriefcaseBusiness className="h-4 w-4" />
              {profile.experince != null ? \`\${profile.experince} \${copy.years}\` : copy.notProvided}
            </div>
          </div>

          <div className="rounded-2xl border border-main/15 bg-main/[0.035] p-5 md:p-6">
            <p className="whitespace-pre-wrap break-words text-sm leading-8 text-black-blue/75 md:text-base">
              {profile.description?.trim() || copy.notProvided}
            </p>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center gap-2">
            <UserRound className="h-5 w-5 text-main" />
            <h2 className="text-xl font-extrabold text-black-blue md:text-2xl">{copy.personal}</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {infoCards.map(({ label, value, icon: Icon, dir }) => (
              <div key={label} className="min-w-0 rounded-2xl border border-black-blue/[0.08] bg-[#FBFDFC] p-4">
                <div className="flex items-center gap-2 text-main">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wide">{label}</span>
                </div>
                <p dir={dir} className="mt-2 break-words text-sm font-semibold leading-6 text-black-blue">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-2xl border border-black-blue/[0.08] bg-[#FBFDFC] p-5 md:p-6">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-main" />
              <h2 className="text-xl font-extrabold text-black-blue">{copy.qualification}</h2>
            </div>
            <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-black-blue/70 md:text-base">
              {profile.qualification || copy.notProvided}
            </p>
          </div>

          <div className="rounded-2xl border border-black-blue/[0.08] bg-[#FBFDFC] p-5 md:p-6">
            <div className="flex items-center gap-2">
              <WalletCards className="h-5 w-5 text-main" />
              <h2 className="text-xl font-extrabold text-black-blue">{copy.courseTypes}</h2>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {courseTypes.length ? (
                courseTypes.map((type) => (
                  <span key={type} className="rounded-full border border-main/20 bg-main/10 px-3 py-2 text-xs font-bold text-black-blue">
                    {courseTypeLabel(type, language)}
                  </span>
                ))
              ) : (
                <span className="text-sm text-black-blue/50">{copy.notProvided}</span>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-main" />
            <h2 className="text-xl font-extrabold text-black-blue md:text-2xl">{copy.subjects}</h2>
          </div>

          {Object.keys(groupedSubjects).length ? (
            <div className="space-y-5">
              {Object.entries(groupedSubjects).map(([level, levelSubjects]) => (
                <div key={level} className="rounded-2xl border border-black-blue/[0.08] bg-white p-4 md:p-5">
                  <h3 className="mb-3 text-sm font-extrabold text-main md:text-base">{level}</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {levelSubjects.map((subject) => (
                      <span key={subject.id} className="rounded-xl border border-main/20 bg-main/[0.06] px-3.5 py-2.5 text-sm font-semibold text-black-blue">
                        {subject.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-black-blue/10 p-6 text-center text-sm text-black-blue/50">
              {copy.noSubjects}
            </div>
          )}
        </section>

        <section className="grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
          <div className="rounded-2xl border border-main/15 bg-main/[0.035] p-5 md:p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-main" />
              <h2 className="text-xl font-extrabold text-black-blue">{copy.cv}</h2>
            </div>

            {cvAvailable ? (
              <div className="mt-5 rounded-2xl border border-white bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-black-blue">{profile.name} · CV</p>
                    <p className="mt-1 text-xs text-black-blue/50">
                      {isArabic ? "ملف السيرة الذاتية" : "Curriculum vitae file"}
                    </p>
                  </div>
                </div>
                <a
                  href={profile.cv}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-main px-4 py-3 text-sm font-bold text-white transition hover:bg-main/90"
                >
                  <ExternalLink className="h-4 w-4" />
                  {copy.viewCv}
                </a>
              </div>
            ) : (
              <p className="mt-4 text-sm text-black-blue/50">{copy.noCv}</p>
            )}
          </div>

          <div className="rounded-2xl border border-black-blue/[0.08] bg-white p-5 md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-main" />
                <h2 className="text-xl font-extrabold text-black-blue">{copy.contact}</h2>
              </div>
              <Button
                type="button"
                onClick={() => navigate("/profile", { state: { chat: true } })}
                variant="outline"
                className="border-main text-main hover:bg-main/5"
              >
                <MessageCircle className="me-2 h-4 w-4" />
                {copy.chat}
              </Button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#FBFDFC] p-4">
                <UsersRound className="h-4 w-4 text-main" />
                <p className="mt-2 text-xs text-black-blue/50">{copy.courses}</p>
                <p className="mt-1 text-lg font-extrabold text-black-blue">{profile.courses_count ?? 0}</p>
              </div>
              <div className="rounded-xl bg-[#FBFDFC] p-4">
                <CalendarDays className="h-4 w-4 text-main" />
                <p className="mt-2 text-xs text-black-blue/50">{copy.lessons}</p>
                <p className="mt-1 text-lg font-extrabold text-black-blue">{profile.lessons_count ?? 0}</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center gap-2">
            <Star className="h-5 w-5 fill-current text-main" />
            <h2 className="text-xl font-extrabold text-black-blue md:text-2xl">{copy.ratings}</h2>
          </div>

          <div className="space-y-3">
            {isRatingsLoading ? (
              <div className="flex min-h-28 items-center justify-center rounded-2xl border border-black-blue/[0.08] bg-[#FBFDFC]">
                <div className="text-sm font-medium text-black-blue/50">{copy.loadingRatings}</div>
              </div>
            ) : visibleRatings.length ? (
              visibleRatings.map((rate, index) => (
                <motion.div
                  key={rate.created_at + "-" + index}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <StudentRating rate={rate} />
                </motion.div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-black-blue/10 p-6 text-center text-sm text-black-blue/50">
                {copy.noRatings}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeacherMainProfile;
