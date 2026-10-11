import { itemVariants } from "@/animations";
import { motion } from "framer-motion";
import { Star, BookOpen } from "lucide-react";
import { IPublicTeacher } from "@/services/main";

interface IProps {
  teacher: IPublicTeacher;
}

const TeacherCard = ({ teacher }: IProps) => {
  const isArabic = typeof document !== "undefined" && document.documentElement.lang === "ar";
  const subjectNames = teacher.subjects?.map((subject) => subject.name).filter(Boolean) ?? [];
  const initials = teacher.name
    .trim()
    .split(/\\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const hasRatings = teacher.rating_count > 0;

  return (
    <motion.article
      variants={itemVariants}
      className="mx-auto flex h-full w-full max-w-96 flex-col overflow-hidden rounded-xl bg-white text-black-blue shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl md:mx-0 md:max-w-full"
    >
      <div className="flex h-64 items-center justify-center overflow-hidden bg-slate-100 sm:h-72">
        {teacher.profile_image ? (
          <img
            src={teacher.profile_image}
            alt={teacher.name}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        ) : (
          <div aria-label={teacher.name} className="flex h-full w-full items-center justify-center bg-gradient-to-br from-main to-slate-700 text-5xl font-bold text-white">
            {initials || "?"}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 text-start sm:p-6">
        <h3 className="line-clamp-1 text-xl font-semibold" title={teacher.name}>{teacher.name}</h3>
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
          <BookOpen className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="line-clamp-2">
            {subjectNames.length > 0 ? subjectNames.join(isArabic ? "، " : ", ") : (isArabic ? "المواد التعليمية" : "Teaching subjects")}
          </p>
        </div>
        {teacher.description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{teacher.description}</p>
        ) : null}
      </div>
    </motion.article>
  );
};

export default TeacherCard;
