import { containerVariants } from "@/animations";
import { ITeacher } from "@/interfaces/teachers/teacherProfile";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, StarIcon } from "lucide-react";
import { useI18n } from "@/i18n";
import { isDisplayableProfileText } from "@/utils/textQuality";

interface IProps {
  instructor: ITeacher;
}

const InstructorDetails = ({ instructor }: IProps) => {
  const { language } = useI18n();
  const isArabic = language === "ar";
  const rating = Number(instructor?.rating ?? 0);
  const hasRating = rating > 0;
  const experience = Number(instructor?.experince ?? 0);
  const showQualification = isDisplayableProfileText(instructor?.qualification);
  const showDescription = isDisplayableProfileText(instructor?.description, 3);

  const stats = [
    {
      icon: BookOpen,
      value: instructor?.courses_count ?? 0,
      label: isArabic ? "الدورات" : "Courses",
    },
    {
      icon: GraduationCap,
      value: instructor?.lessons_count ?? 0,
      label: isArabic ? "الدروس" : "Lessons",
    },
    {
      icon: StarIcon,
      value: Number.isFinite(experience) && experience > 0
        ? new Intl.NumberFormat(isArabic ? "ar-EG" : "en-US", { maximumFractionDigits: 0 }).format(experience)
        : isArabic ? "غير محدد" : "Not specified",
      label: isArabic ? "سنوات الخبرة" : "Years experience",
    },
  ];

  return (
    <motion.section
      variants={containerVariants}
      className="my-10 overflow-hidden rounded-[2rem] border border-black-blue/[0.07] bg-[#F7F9F9] p-5 md:p-8"
      aria-labelledby="instructor-details-title"
    >
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: isArabic ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="relative overflow-hidden rounded-[1.75rem] bg-white p-2 shadow-[0_18px_45px_rgba(33,55,75,0.12)]">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
              <img
                src={instructor?.profile_image || "/images/profile-avatar.webp"}
                alt={isArabic ? "صورة المعلم" : "Instructor profile"}
                onError={(event) => {
                  event.currentTarget.src = "/images/profile-avatar.webp";
                }}
                className="h-full w-full object-cover object-top transition duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: isArabic ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-5"
        >
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-main">
              {isArabic ? "تعرف على معلمك" : "Meet your instructor"}
            </p>
            <h2
              id="instructor-details-title"
              className="mt-2 text-3xl font-black text-black-blue md:text-4xl"
            >
              {isArabic ? "تفاصيل المعلم" : "Instructor details"}
            </h2>
          </div>

          <div>
            <h3 className="text-2xl font-black capitalize text-black-blue md:text-3xl">
              {instructor?.name}
            </h3>
            {showQualification && (
              <p className="mt-2 flex items-center gap-2 text-base font-bold text-black-blue/60">
                <GraduationCap className="h-5 w-5 shrink-0 text-main" />
                {instructor.qualification}
              </p>
            )}
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl border border-black-blue/[0.07] bg-white px-4 py-3 shadow-sm">
            <StarIcon className="h-5 w-5 text-main" fill="currentColor" />
            <span className="text-sm font-black text-black-blue">
              {hasRating ? rating.toFixed(1) : isArabic ? "لا توجد تقييمات بعد" : "No ratings yet"}
            </span>
            {hasRating && (
              <span className="text-xs font-semibold text-black-blue/40">
                {isArabic ? "تقييم المعلم" : "Teacher rating"}
              </span>
            )}
          </div>

          {showDescription && (
            <p className="max-w-3xl text-sm leading-7 text-[#4D5756] md:text-base">
              {instructor.description}
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-black-blue/[0.07] bg-white px-4 py-4 shadow-sm"
              >
                <div className="flex items-center gap-2 text-main">
                  <Icon className="h-4 w-4" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wide">
                    {label}
                  </span>
                </div>
                <p className="mt-2 text-2xl font-black text-black-blue">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default InstructorDetails;
