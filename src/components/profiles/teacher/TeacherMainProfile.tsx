import Loader from "@/components/Loader";
import cookieService from "@/utils/cookieService";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n";
import { ISubject } from "@/interfaces/main";

import {
  useGetTeacherProfile,
  useGetTeacherRatings,
} from "@/lib/react-query/teacher/teacherProfile";
import StudentRating from "../student/StudentRating";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TeacherMainProfile = () => {
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const navigate = useNavigate();
  const { data: teacher, isLoading, isError, refetch } = useGetTeacherProfile(token);
  const {
    name,
    profile_image,
    email,
    phone,
    address,
    description,
    qualification,
    experince,
    subjects,
  } = teacher?.data || {};

  const { data: ratings } = useGetTeacherRatings(token);

  const copy = {
    en: {
      email: "Email",
      phone: "Phone Number",
      address: "Address",
      aboutMe: "About Me",
      qualifications: "Qualifications",
      experience: "Experience",
      yearsOfExperience: "years of experience",
      cv: "CV",
      mySubjects: "My Subjects",
      noSubjects: "No subjects found",
      studentRatings: "Students Ratings",
      noRatings: "No ratings yet",
      notFound: "Not found",
    },
    ar: {
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      address: "العنوان",
      aboutMe: "نبذة عني",
      qualifications: "المؤهلات",
      experience: "الخبرة",
      yearsOfExperience: "سنوات من الخبرة",
      cv: "السيرة الذاتية",
      mySubjects: "موادي الدراسية",
      noSubjects: "لا توجد مواد دراسية",
      studentRatings: "تقييمات الطلاب",
      noRatings: "لا توجد تقييمات بعد",
      notFound: "غير متوفر",
    },
  }[language];

  const groupedSubjects =
    subjects?.reduce<Record<string, ISubject[]>>((acc, subject) => {
      const levelName = subject.education_level?.name || copy.notFound;
      if (!acc[levelName]) acc[levelName] = [];
      acc[levelName].push(subject);
      return acc;
    }, {}) || {};

  if (isLoading)
    return (
      <div className="container overflow-hidden">
        <div className="flex items-center justify-center py-20 my-20 overflow-hidden bg-white rounded-lg">
          <Loader />
        </div>
      </div>
    );

  if (isError || !teacher?.data) {
    return (
      <div className="container py-20 text-center" role="alert">
        <p className="font-sora text-lg text-black-blue">
          {language === "ar"
            ? "تعذر تحميل بيانات الملف الشخصي للمعلم."
            : "Unable to load teacher profile information."}
        </p>
        <Button
          type="button"
          onClick={() => void refetch()}
          className="mt-5 bg-main text-white hover:bg-main/90"
        >
          {language === "ar" ? "حاول مرة أخرى" : "Try again"}
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-10 mt-4 overflow-hidden bg-white rounded-lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
        className="px-2 text-center md:px-20 md:text-left"
      >
        <div className="mb-5 flex justify-end">
          <Button
            type="button"
            onClick={() => navigate("/profile/update")}
            className="bg-main font-sora text-white hover:bg-main/90"
          >
            <Pencil className="me-2 h-4 w-4" />
            {language === "ar" ? "تعديل الملف الشخصي" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-4 mt-5 lg:mt-10">
          <div className="bg-white flex flex-col items-center lg:items-start shadow-md p-2 rounded-md">
            <div className="lg:aspect-square">
              <img
                src={profile_image ? profile_image : "/images/profile-avatar.webp"}
                className="w-full h-full object-contain bg-white rounded-lg"
                alt={language === "ar" ? "صورة الملف الشخصي" : "Profile"}
              />
            </div>
            <div className="space-y-2">
              <h2 className="font-epilogue text-center lg:text-start text-xl font-black text-black-blue capitalize my-5">
                {name}
              </h2>
              <p className="font-sora text-md text-black-blue">
                {copy.email}: <span className="text-[#666666] text-sm">{email}</span>
              </p>
              <p className="font-sora text-md text-black-blue">
                {copy.phone}: <span className="text-[#666666] text-sm">{phone}</span>
              </p>
              <p className="font-sora text-md text-black-blue">
                {copy.address}: <span className="text-[#666666] text-sm">{address || copy.notFound}</span>
              </p>
            </div>
            <div className="space-y-2 w-full">
              <h3 className="capitalize w-full font-black text-[#194D80] text-lg font-epilogue mt-10 text-center">
                {copy.aboutMe}
              </h3>
              <p className="w-full font-epilogue text-[#666666] text-sm leading-relaxed p-4 text-center">
                {description || copy.notFound}
              </p>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white shadow-md rounded-lg p-2 flex flex-col items-center lg:items-start justify-between lg:flex-row gap-10 lg:gap-4 mb-10">
              <div className="order-2 lg:order-1 justify-items-center lg:justify-items-start">
                <h3 className="capitalize font-black text-[#194D80] text-xl font-epilogue mb-3">
                  {copy.qualifications}
                </h3>
                <p className="font-epilogue text-[#194D80] text-sm mb-3 font-medium text-center lg:text-left">
                  {qualification || <span className="text-muted font-normal">{copy.notFound}</span>}
                </p>
              </div>
              <div className="md:w-52 lg:w-64 items-center me-2 order-1 lg:order-2">
                <img src="/images/image 33.png" alt="" className="object-cover w-full" />
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg flex flex-col lg:flex-row p-2 gap-4">
              <div className="flex-1">
                <div className="flex flex-col items-center">
                  <h3 className="capitalize font-black text-[#194D80] text-xl font-epilogue mb-3">
                    {copy.experience}
                  </h3>
                  <p className="font-epilogue text-[#194D80] text-sm mb-3 font-medium text-center lg:text-left">
                    {experince ? `${experince} ${copy.yearsOfExperience}` : <span className="text-muted font-normal">{copy.notFound}</span>}
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <div className="grid justify-items-center gap-4">
                  <h3 className="bg-[#F0FEFC] text-[#194D80] shadow-md rounded-md border text-xl border-[#194D80] font-bold font-sora py-3 px-12 inline-block my-5">
                    {copy.cv}
                  </h3>
                  <img src="/images/pdf.png" className="w-24 h-24" alt={language === "ar" ? "السيرة الذاتية" : "CV"} />
                  <div className="flex items-center justify-center gap-2 border border-[#08917B] rounded-md shadow-md px-2 w-full max-w-64 min-w-0">
                    <img src="/images/pdf.png" className="w-16 h-16" alt="my-cv" />
                    <span className="capitalize font-sora text-xs text-[#194D80]">{name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-10">
          <div className="flex justify-center lg:justify-start">
            <h3 className="bg-white text-[#194D80] shadow-md rounded-md border text-xl border-[#194D80] font-bold font-sora px-7 py-3 inline-block my-5">
              {copy.mySubjects}
            </h3>
          </div>

          {subjects && subjects.length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedSubjects).map(
                ([levelName, levelSubjects]) => (
                  <div key={levelName} className="flex flex-col items-center lg:items-start">
                    <h2 className="capitalize font-bold text-xl md:text-2xl text-main mb-4">{levelName}</h2>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                      {levelSubjects.map((subject, idx) => (
                        <div className="flex justify-center" key={idx}>
                          <h3 className="bg-[#F0FEFC] text-[#194D80] shadow-md rounded-md border text-lg border-[#194D80] font-bold font-sora px-3 py-5 inline-block">
                            {subject.name}
                          </h3>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-muted">{copy.noSubjects}</p>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-[36px] mt-10 mb-3 font-sora text-black-blue capitalize">
            {copy.studentRatings}:
          </h2>
          <div className="grid">
            <div className="space-y-3 overflow-y-auto shadow-xl">
              {!ratings?.data.length ? (
                <p className="text-lg text-muted text-center px-4 py-8">{copy.noRatings}</p>
              ) : (
                ratings?.data.map((rate, index) => (
                  <StudentRating key={index} rate={rate} />
                ))
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TeacherMainProfile;
