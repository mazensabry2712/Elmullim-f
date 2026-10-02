import { Link } from "react-router-dom";
import truncateTxt from "@/utils/truncateTxt";
import { ILesson } from "@/interfaces/lessons/lesson";
import type { LessonsCopy } from "@/pages/lessons/lessonCopy";
import { getLessonsCopy } from "@/pages/lessons/lessonCopy";
import { useI18n } from "@/i18n";
import { CalendarDays, Clock3, MapPin, UsersRound } from "lucide-react";

interface IProps {
  lesson: ILesson;
  copy?: LessonsCopy;
}

const LessonCard = ({ lesson, copy }: IProps) => {
  const { language } = useI18n();
  const text = copy ?? getLessonsCopy(language);
  const duration = lesson.duration_minutes;
  const slots = lesson.availability?.length ?? 0;
  const areas = lesson.service_areas?.filter((area) => area.is_active !== false).length ?? 0;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-black-blue/[0.07] bg-white p-3 shadow-[0_12px_38px_rgba(33,55,75,0.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(33,55,75,0.12)] sm:p-4">
      <Link
        to={`/lessons/${lesson.id}`}
        aria-label={`${text.details}: ${lesson.title}`}
        className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#F4F7F7]">
          <span className="absolute start-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-extrabold text-main shadow-sm backdrop-blur">
            {text.lessonLabel}
          </span>
          <img
            src={lesson.logo || "/images/placeholder-img.webp"}
            alt={text.imageAlt}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <div>
          <Link
            to={`/lessons/${lesson.id}`}
            className="block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
          >
            <h3 className="line-clamp-2 text-lg font-black leading-7 text-black-blue transition-colors hover:text-main sm:text-xl">
              {lesson.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#4D5756]">
              {truncateTxt(lesson.description, 100)}
            </p>
          </Link>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <span className="inline-flex min-w-0 items-center gap-2 rounded-xl bg-main/[0.055] px-3 py-2.5 text-xs font-bold text-black-blue/70">
              <MapPin className="h-4 w-4 shrink-0 text-main" />
              <span className="truncate">{lesson.delivery_mode === "offline" ? text.offline : text.online}</span>
            </span>
            <span className="inline-flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-bold text-black-blue/70">
              <UsersRound className="h-4 w-4 shrink-0 text-black-blue/40" />
              <span className="truncate">{lesson.booking_type === "group" ? text.group : text.private}</span>
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-black-blue/55">
          <span className="inline-flex min-w-0 items-center gap-2 rounded-xl border border-black-blue/[0.06] px-3 py-2.5">
            <Clock3 className="h-4 w-4 shrink-0 text-main" />
            <span className="truncate">
              {duration ? `${duration} ${text.durationUnit}` : "—"}
            </span>
          </span>
          <span className="inline-flex min-w-0 items-center gap-2 rounded-xl border border-black-blue/[0.06] px-3 py-2.5">
            <CalendarDays className="h-4 w-4 shrink-0 text-main" />
            <span className="truncate">
              {slots} {language === "ar" ? "مواعيد" : "slots"}
            </span>
          </span>
        </div>

        {lesson.delivery_mode === "offline" && lesson.offline_visit_type === "teacher_to_student" && areas > 0 ? (
          <p className="mt-3 rounded-xl bg-[#FBFDFC] px-3 py-2.5 text-xs font-semibold text-black-blue/55">
            {areas} {text.availableArea}
            {areas > 1 && language === "en" ? "s" : ""}
          </p>
        ) : null}

        <div className="mt-auto pt-5">
          <div className="mb-4 flex items-center gap-2">
            <img
              src={lesson.teacher.profile_image || "/images/profile-avatar.webp"}
              alt={text.teacherImageAlt}
              loading="lazy"
              className="h-9 w-9 shrink-0 rounded-full object-cover object-top"
            />
            <h4 className="min-w-0 truncate text-sm font-semibold text-black-blue">
              {text.by} <span className="text-main">{lesson.teacher.name}</span>
            </h4>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-dashed border-black-blue/[0.08] pt-4">
            <div
              className="min-w-0"
              aria-label={Number(lesson.price) === 0 ? text.free : `${lesson.price} ${text.currency}`}
            >
              <span className="block text-[10px] font-bold uppercase tracking-wide text-black-blue/35">
                {text.price}
              </span>
              {Number(lesson.price) === 0 ? (
                <span className="mt-1 block text-lg font-black text-main">{text.free}</span>
              ) : (
                <span className="mt-1 block truncate text-lg font-black text-main">{lesson.price} {text.currency}</span>
              )}
            </div>

            <Link
              to={`/lessons/${lesson.id}`}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-main px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 sm:px-5"
            >
              {text.details}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default LessonCard;
