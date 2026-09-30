import Loader from "@/components/Loader";
import {
  useGetStudentProfile,
  useGetStudentRatings,
} from "@/lib/react-query/student/studentProfile";
import cookieService from "@/utils/cookieService";
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
  VenusAndMars,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../ProfileHeader";
import StudentRating from "./StudentRating";
import StudentLocation from "./StudentLocation";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";

const StudentMainProfile = () => {
  const token = cookieService.getToken()!;
  const navigate = useNavigate();
  const { data: student, isLoading } = useGetStudentProfile(token);
  const { data: ratings } = useGetStudentRatings(token);
  const { language } = useI18n();
  const isArabic = language === "ar";

  const text = isArabic
    ? {
        edit: "تعديل الملف الشخصي",
        about: "نبذة عني",
        personalData: "البيانات الشخصية",
        name: "الاسم بالكامل",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        gender: "النوع",
        country: "الدولة",
        educationSystem: "نظام التعليم",
        educationLevel: "المرحلة التعليمية",
        description: "الوصف",
        favorites: "المواد المفضلة",
        studentRatings: "تقييمات الطالب",
        noRatings: "لا توجد تقييمات بعد",
        nothing: "غير محدد",
        male: "ذكر",
        female: "أنثى",
      }
    : {
        edit: "Edit Profile",
        about: "About me",
        personalData: "Personal Information",
        name: "Full name",
        email: "Email",
        phone: "Phone",
        gender: "Gender",
        country: "Country",
        educationSystem: "Education system",
        educationLevel: "Education level",
        description: "Description",
        favorites: "Favorite subjects",
        studentRatings: "Student ratings",
        noRatings: "No ratings yet",
        nothing: "Not provided",
        male: "Male",
        female: "Female",
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

  const profile = student?.data;

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
    {
      label: text.email,
      value: profile.email || text.nothing,
      icon: Mail,
    },
    {
      label: text.phone,
      value: profile.phone || text.nothing,
      icon: Phone,
    },
    {
      label: text.gender,
      value: genderLabel,
      icon: VenusAndMars,
    },
    {
      label: text.country,
      value: country?.name || text.nothing,
      icon: MapPin,
    },
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
            <h2 className="break-words text-2xl font-bold text-black-blue font-epilogue md:text-4xl">
              {profile.name || text.nothing}
            </h2>
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
            <BookOpen className="h-5 w-5" />
            <h3 className="font-sora text-xl font-bold text-black-blue md:text-2xl">
              {text.favorites}
            </h3>
          </div>

          {profile.favourite_subjects?.length ? (
            <div className="flex flex-wrap gap-3">
              {profile.favourite_subjects.map((subject) => (
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
              {text.nothing}
            </p>
          )}
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center gap-2 text-main">
            <UserRound className="h-5 w-5" />
            <h3 className="font-sora text-xl font-bold text-black-blue md:text-2xl">
              {text.studentRatings}
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
                <StudentRating key={rate.created_at + "-" + index} rate={rate} />
              ))
            )}
          </div>
        </section>

        <StudentLocation student={profile} />
      </motion.div>
    </div>
  );
};

export default StudentMainProfile;
