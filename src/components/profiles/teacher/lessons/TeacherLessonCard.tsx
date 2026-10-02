import { Link } from "react-router-dom";
import truncateTxt from "@/utils/truncateTxt";
import { ILesson } from "@/interfaces/lessons/lesson";
import DeleteLesson from "./DeleteLesson";
import { ExternalLink, Pen, Video } from "lucide-react";
import { useI18n } from "@/i18n";

interface IProps {
  lesson: ILesson;
}

const TeacherLessonCard = ({ lesson }: IProps) => {
  const { language } = useI18n();
  const isArabic = language === "ar";

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-black-blue/[0.08] bg-white shadow-[0_14px_40px_rgba(33,55,75,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(33,55,75,0.12)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-[#EEF4F2]">
        <img
          src={lesson.logo || "/images/placeholder-img.webp"}
          alt={lesson.title || (isArabic ? "صورة الدرس" : "Lesson")}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-extrabold text-black-blue shadow-sm">
            <Video className="h-3.5 w-3.5 text-main" />
            {isArabic ? "درس" : "Lesson"}
          </span>
          <span className="rounded-full bg-main px-3 py-1.5 text-xs font-extrabold text-white shadow-sm">
            {Number(lesson.price) === 0
              ? isArabic
                ? "مجاني"
                : "Free"
              : `$${lesson.price}`}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link to={`/lessons/${lesson.id}`} className="block">
          <h3 className="line-clamp-2 text-lg font-extrabold leading-7 text-black-blue transition-colors group-hover:text-main sm:text-xl">
            {lesson.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-black-blue/55">
            {truncateTxt(lesson.description, 90)}
          </p>
        </Link>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#FBFDFC] px-3 py-2.5">
          <img
            src={lesson.teacher.profile_image || "/images/profile-avatar.webp"}
            alt={isArabic ? "المعلم" : "Teacher"}
            loading="lazy"
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-black-blue/40">
              {isArabic ? "المعلم" : "Teacher"}
            </p>
            <p className="truncate text-sm font-bold text-black-blue">
              {lesson.teacher.name}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            to={`/lessons/${lesson.id}`}
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-main px-4 py-2.5 text-sm font-bold text-white transition hover:bg-main/90"
          >
            <ExternalLink className="h-4 w-4" />
            {isArabic ? "فتح الدرس" : "Open lesson"}
          </Link>

          <div className="flex gap-2 sm:shrink-0">
            <Link
              to={`/profile/my-lessons/${lesson.id}/update`}
              aria-label={isArabic ? "تحديث الدرس" : "Update lesson"}
              title={isArabic ? "تحديث الدرس" : "Update lesson"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
            >
              <Pen className="h-4 w-4" />
            </Link>
            <DeleteLesson id={lesson.id.toString()} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default TeacherLessonCard;
