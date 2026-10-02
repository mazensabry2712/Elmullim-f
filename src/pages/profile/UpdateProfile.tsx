import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { lazy } from "react";
import ChangePasswordForm from "@/components/profiles/ChangePasswordForm";
import { useI18n } from "@/i18n";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const UpdateStudentProfileForm = lazy(
  () => import("@/components/forms/profiles/UpdateStudentProfileForm")
);
const UpdateParentProfileForm = lazy(
  () => import("@/components/forms/profiles/UpdateParentProfileForm")
);
const UpdateTeacherProfileForm = lazy(
  () => import("@/components/forms/profiles/UpdateTeacherProfileForm")
);

const UpdateProfile = () => {
  const role = cookieService.getRole()!;
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const isTeacher = role === "teacher";
  const isArabic = language === "ar";

  if (isTeacher) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-[#F6F8FA] py-5 md:py-8"
      >
        <div className="container max-w-6xl">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 text-start">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="mb-3 inline-flex items-center gap-2 rounded-lg px-0 text-sm font-semibold text-black-blue/60 transition hover:text-black-blue"
              >
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                {isArabic ? "العودة إلى الملف الشخصي" : "Back to profile"}
              </button>

              <p className="font-sora text-xs font-semibold uppercase tracking-[0.18em] text-main">
                {isArabic ? "حساب المعلم" : "Teacher account"}
              </p>
              <h1 className="mt-1 font-epilogue text-2xl font-bold text-black-blue md:text-4xl">
                {isArabic ? "تعديل الملف الشخصي" : "Edit teacher profile"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-black-blue/55 md:text-base">
                {isArabic
                  ? "تحكم في بياناتك الشخصية والتعليمية وملفاتك من صفحة واحدة متجاوبة مع جميع الشاشات."
                  : "Manage your personal details, teaching information and profile files from one responsive page."}
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-main/15 bg-white px-4 py-3 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-main" />
              <span className="font-sora text-xs font-semibold text-black-blue/70 sm:text-sm">
                {isArabic ? "بيانات الحساب محمية" : "Account data protected"}
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_12px_40px_rgba(33,55,75,0.07)]">
            <UpdateTeacherProfileForm />
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
              <h2 className="font-sora text-lg font-bold text-black-blue">
                {isArabic ? "أمان الحساب" : "Account security"}
              </h2>
              <p className="mt-1 text-xs text-black-blue/50">
                {isArabic
                  ? "غيّر كلمة المرور من خلال القسم التالي."
                  : "Change your password from the section below."}
              </p>
            </div>
            <div className="p-5 sm:p-6">
              <ChangePasswordForm />
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-[#21374B]"
    >
      <div className="mt-4 bg-[#FCFCFC]">
        <div className="container py-24 md:py-36">
          <div className="rounded-lg bg-[#F0F0F0] px-4 py-6 shadow-md md:px-10 lg:px-20">
            <h2 className="border-b border-main text-center text-3xl font-semibold uppercase text-main md:text-6xl">
              {t("auth.updateInfo")}
            </h2>
            {role === "parent" ? (
              <UpdateParentProfileForm />
            ) : (
              <UpdateStudentProfileForm />
            )}

            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default UpdateProfile;
