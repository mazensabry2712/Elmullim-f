import { itemVariants } from "@/animations";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { IPublicTeacher } from "@/services/main";

interface IProps {
  teacher: IPublicTeacher;
  subjectFilterId?: number;
}

const TeacherCard = ({ teacher, subjectFilterId }: IProps) => {
  const isArabic = typeof document !== "undefined" && document.documentElement.lang === "ar";
  const visibleSubjects = (teacher.subjects ?? []).filter((subject) =>
    subjectFilterId ? subject.id === subjectFilterId : true
  );
  const subjectNames = visibleSubjects.map((subject) => subject.name).filter(Boolean);
  const initials = teacher.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const hasRatings = teacher.rating_count > 0;
  const description = teacher.description?.trim() ?? "";
  const showDescription = description.split(/\s+/).filter(Boolean).length >= 3;
  const profileHref = `/teachers/${teacher.id}`;

  const viewProfileLabel = isArabic ? "عرض ملف المعلم" : "View teacher profile";

  return (
    <motion.article
      variants={itemVariants}
      className="mx-auto flex h-full w-full max-w-96 flex-col overflow-hidden rounded-xl bg-white text-black-blue shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl md:mx-0 md:max-w-full"
    >
      <Link
        to={profileHref}
        aria-label={`${viewProfileLabel}: ${teacher.name}`}
        className="block overflow-hidden bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-main"
      >
        <div className="flex h-64 items-center justify-center overflow-hidden sm:h-72">
          {teacher.profile_image ? (
            <img
              src={teacher.profile_image}
              alt={teacher.name}
              className="h-full w-full object-cover object-center transition duration-300 hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <div aria-label={teacher.name} className="flex h-full w-full items-center justify-center bg-gradient-to-br from-main to-slate-700 text-5xl font-bold text-white">
              {initials || "?"}
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 text-start sm:p-6">
        <h3 className="line-clamp-2 text-xl font-semibold" title={teacher.name}>
          <Link
            to={profileHref}
            className="rounded-sm transition-colors hover:text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
          >
            {teacher.name}
          </Link>
        </h3>
        <div className="mt-3 flex min-h-7 items-center gap-2 text-sm">
          {hasRatings ? (
            <>
              <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-500" aria-hidden="true" />
              <span className="font-semibold">{Number(teacher.rating).toFixed(1)}</span>
              <span className="text-slate-500">({teacher.rating_count} {isArabic ? "تقييم" : (teacher.rating_count === 1 ? "rating" : "ratings")})</span>
            </>
          ) : (
            <span className="text-slate-500">{isArabic ? "لا توجد تقييمات بعد" : "No ratings yet"}</span>
          )}
        </div>

        <div className="mt-4 flex items-start gap-2 text-sm text-slate-600">
          <BookOpen className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
          <div className="flex flex-wrap gap-1.5">
            {subjectNames.length > 0 ? (
              visibleSubjects.map((subject) => (
                <Link
                  key={subject.id}
                  to={profileHref}
                  aria-label={isArabic
                    ? `عرض ملف ${teacher.name} - ${subject.name}`
                    : `View ${teacher.name}'s profile for ${subject.name}`}
                  className="rounded-full border border-main/15 bg-main/[0.04] px-2.5 py-1 text-xs font-semibold text-black-blue transition-colors hover:border-main hover:bg-main hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
                >
                  {subject.name}
                </Link>
              ))
            ) : (
              <Link
                to={profileHref}
                className="text-sm text-slate-500 underline-offset-2 hover:text-main hover:underline"
              >
                {isArabic ? "المواد التعليمية" : "Teaching subjects"}
              </Link>
            )}
          </div>
        </div>

        {showDescription ? (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{description}</p>
        ) : null}

        <Link
          to={profileHref}
          className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-main px-4 py-2.5 font-semibold text-white transition-colors hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
        >
          {viewProfileLabel}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  );
};

export default TeacherCard;
