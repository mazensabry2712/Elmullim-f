import { ArrowUpRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import type { IPublicSubject } from "@/services/main";

interface SubjectCardProps {
  subject: IPublicSubject;
}

const SubjectCard = ({ subject }: SubjectCardProps) => {
  const isArabic = typeof document !== "undefined" && document.documentElement.lang === "ar";
  const lessonSearch = new URLSearchParams({
    subject_id: String(subject.id),
    education_level_id: String(subject.education_level_id),
  }).toString();

  return (
    <Link to={`/lessons?${lessonSearch}`} aria-label={isArabic ? `تصفح دروس مادة ${subject.name}` : `Explore ${subject.name} lessons`} className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2">
      <article className="flex h-full min-h-56 flex-col items-center justify-center gap-4 rounded-xl border border-slate-100 bg-background px-5 py-7 text-center text-black-blue shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:border-main/25 group-hover:bg-main group-hover:text-white group-hover:shadow-lg">
        <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-main/10 bg-white text-main shadow-sm transition group-hover:border-white/30 group-hover:bg-white/15 group-hover:text-white">
          {subject.image ? <img src={subject.image} alt="" loading="lazy" className="h-full w-full object-cover" /> : <BookOpen className="h-9 w-9" aria-hidden="true" />}
        </span>
        <div className="space-y-2">
          <h3 className="text-lg font-extrabold leading-snug sm:text-xl">{subject.name}</h3>
          {subject.education_level_name ? <p className="text-sm text-black-blue/60 group-hover:text-white/75">{subject.education_level_name}</p> : null}
        </div>
        <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-main group-hover:text-white">
          {isArabic ? "تصفح الدروس" : "Explore lessons"} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </article>
    </Link>
  );
};

export default SubjectCard;
