import { Link } from "react-router-dom";
import truncateTxt from "@/utils/truncateTxt";
import { ILesson } from "@/interfaces/lessons/lesson";
import DeleteLesson from "./DeleteLesson";
import { Pen, Video } from "lucide-react";
import { useI18n } from "@/i18n";

interface IProps {
  lesson: ILesson;
}

const TeacherLessonCard = ({ lesson }: IProps) => {
  const { language } = useI18n();
  const isArabic = language === "ar";

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-50">
        <img
          src={lesson.logo || "/images/placeholder-img.webp"}
          alt={lesson.title || (isArabic ? "صورة الدرس" : "Lesson")}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-main px-3 py-1.5 text-xs font-semibold text-white">
          <Video className="h-3.5 w-3.5" />
          {isArabic ? "درس" : "Lesson"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link to={`/lessons/${lesson.id}`} className="block">
          <h3 className="line-clamp-2 text-lg font-bold leading-7 text-black-blue transition-colors hover:text-main sm:text-xl">
            {lesson.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#4D5756]">
            {truncateTxt(lesson.description, 90)}
          </p>
        </Link>

        <div className="mt-4 flex items-center justify-between gap-3 border-y border-dashed border-gray-200 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <Video className="h-4 w-4 shrink-0 text-main" />
            <span className="text-sm font-semibold text-black-blue">
              {isArabic ? "سعر الدرس" : "Lesson price"}
            </span>
          </div>
          <span className="shrink-0 text-base font-bold text-main">
            {Number(lesson.price) === 0 ? (isArabic ? "مجاني" : "Free") : `$${lesson.price}`}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <img
            src={lesson.teacher.profile_image || "/images/profile-avatar.webp"}
            alt={isArabic ? "المعلم" : "Teacher"}
            loading="lazy"
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
          <p className="min-w-0 truncate text-sm font-medium text-black-blue">{lesson.teacher.name}</p>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            to={`/lessons/${lesson.id}`}
            className="flex min-h-10 flex-1 items-center justify-center rounded-md bg-main px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-main/90"
          >
            {isArabic ? "مشاهدة الدرس" : "View lesson"}
          </Link>
          <div className="flex gap-2 sm:shrink-0">
            <Link
              to={`/profile/my-lessons/${lesson.id}/update`}
              aria-label={isArabic ? "تحديث الدرس" : "Update lesson"}
              title={isArabic ? "تحديث الدرس" : "Update lesson"}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
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
