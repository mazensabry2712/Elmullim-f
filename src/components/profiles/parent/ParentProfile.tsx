import Loader from "@/components/Loader";
import { useGetParentProfile } from "@/lib/react-query/parent/parentProfile";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import ProfileHeader from "../ProfileHeader";
import ParentStudentLocation from "./ParentStudentLocation";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Mail, Phone, GraduationCap, UserRound, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ParentProfiles = () => {
  const token = cookieService.getToken() || "";
  const { data: parent, isLoading, isError, refetch } = useGetParentProfile(token);
  const { language } = useI18n();
  const navigate = useNavigate();
  const isArabic = language === "ar";

  const text = isArabic
    ? {
        account: "حساب ولي الأمر",
        description: "الوصف",
        nothing: "غير محدد",
        following: "الطلاب الذين تتابعهم",
        personalData: "البيانات الشخصية",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        educationLevel: "المرحلة التعليمية",
        gender: "النوع",
        male: "ذكر",
        female: "أنثى",
        edit: "تعديل الملف الشخصي",
        loadError: "تعذر تحميل بيانات ولي الأمر.",
        retry: "حاول مرة أخرى",
        noStudents: "لا يوجد طلاب مرتبطون بهذا الحساب حاليًا.",
      }
    : {
        account: "Parent account",
        description: "Description",
        nothing: "Not provided",
        following: "Linked students",
        personalData: "Personal information",
        email: "Email",
        phone: "Phone number",
        educationLevel: "Education level",
        gender: "Gender",
        male: "Male",
        female: "Female",
        edit: "Edit Profile",
        loadError: "Unable to load parent profile information.",
        retry: "Try again",
        noStudents: "No students are linked to this account yet.",
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

  if (isError || !parent?.data) {
    return (
      <div className="container py-20 text-center" role="alert">
        <p className="font-sora text-lg text-black-blue">{text.loadError}</p>
        <Button type="button" onClick={() => void refetch()} className="mt-5 bg-main text-white hover:bg-main/90">
          {text.retry}
        </Button>
      </div>
    );
  }

  const profile = parent.data;
  const educationLevel = profile.education_level;
  const genderLabel =
    profile.gender === "male"
      ? text.male
      : profile.gender === "female"
        ? text.female
        : text.nothing;

  const personalItems = [
    { label: text.email, value: profile.email || text.nothing, icon: Mail },
    { label: text.phone, value: profile.phone || text.nothing, icon: Phone },
    { label: text.gender, value: genderLabel, icon: UserRound },
    { label: text.educationLevel, value: educationLevel?.name || text.nothing, icon: GraduationCap },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="container"
    >
      <div className="pb-10 my-20 overflow-hidden rounded-lg bg-white">
        <ProfileHeader profileImage={profile.profile_image || ""} />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="px-4 text-start sm:px-6 md:px-10 lg:px-16"
        >
          <div className="flex flex-col gap-5 border-b border-gray-100 pb-8 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p className="mb-2 font-sora text-sm font-semibold uppercase tracking-wide text-main">
                {text.account}
              </p>
              <h2 className="break-words font-epilogue text-2xl font-bold text-black-blue md:text-4xl">
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

          <section className="mt-8" aria-labelledby="parent-personal-data">
            <h3 id="parent-personal-data" className="mb-4 font-sora text-xl font-bold text-black-blue md:text-2xl">
              {text.personalData}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {personalItems.map(({ label, value, icon: Icon }) => (
                <div key={label} className="min-w-0 rounded-xl border border-gray-100 bg-[#FAFCFB] p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-main">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="font-sora text-xs font-semibold uppercase tracking-wide">{label}</span>
                  </div>
                  <p className="break-words font-sora text-sm font-medium leading-6 text-black-blue md:text-base">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-xl border border-gray-100 bg-[#FAFCFB] p-5">
            <h3 className="mb-3 font-sora text-xl font-bold text-black-blue md:text-2xl">
              {text.description}
            </h3>
            <p className="whitespace-pre-wrap break-words font-sora text-sm leading-7 text-black-blue md:text-base">
              {profile.description?.trim() || text.nothing}
            </p>
          </section>

          <section className="mt-8" aria-labelledby="parent-linked-students">
            <h3 id="parent-linked-students" className="my-4 font-sora text-2xl text-black-blue md:text-3xl">
              {text.following}
            </h3>

            {!profile.students.length ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center font-sora text-[#4D5756]">
                {text.noStudents}
              </div>
            ) : (
              <motion.div className="flex flex-col gap-4">
                {profile.students.map((student) => (
                  <div key={student.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-4">
                      <img
                        src={student.profile_image || "/images/profile-avatar.webp"}
                        alt={student.name}
                        className="h-20 w-20 rounded-full border object-cover"
                      />
                      <p className="text-xl font-semibold text-black-blue">{student.name}</p>
                    </div>
                    <ParentStudentLocation student={student} />
                  </div>
                ))}
              </motion.div>
            )}
          </section>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ParentProfiles;
