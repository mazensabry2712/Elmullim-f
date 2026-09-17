import { Link } from "react-router-dom";
import truncateTxt from "@/utils/truncateTxt";
import { ILesson } from "@/interfaces/lessons/lesson";
import type { LessonsCopy } from "@/pages/lessons/lessonCopy";
import { getLessonsCopy } from "@/pages/lessons/lessonCopy";
import { useI18n } from "@/i18n";

interface IProps {
  lesson: ILesson;
  copy?: LessonsCopy;
}

const LessonCard = ({ lesson, copy }: IProps) => {
  const { language } = useI18n();
  const text = copy ?? getLessonsCopy(language);

  return (
    <article className="h-full p-3 sm:p-5 shadow-[0px_0px_40px_0px_#0E2A4614] transition-all duration-300 hover:shadow-lg rounded-[5px] space-y-5 sm:max-w-[80%] md:max-w-full mx-auto bg-white">
      <Link
        to={`/lessons/${lesson.id}`}
        aria-label={`${text.details}: ${lesson.title}`}
        className="block rounded-[5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
      >
        <div className="rounded-[5px] overflow-hidden relative max-h-80 sm:max-h-72 md:max-h-52">
          <span className="absolute top-4 left-4 bg-main text-white font-sora text-sm rounded-[5px] px-2 py-0.5">
            {language === "ar" ? "درس" : "Lesson"}
          </span>
          <img
            src={lesson.logo || "/images/placeholder-img.webp"}
            alt={text.imageAlt}
            className="object-cover object-center"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="space-y-4">
        <div>
          <Link
            to={`/lessons/${lesson.id}`}
            className="space-y-2 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 rounded-sm"
          >
            <h3 className="text-black-blue capitalize font-semibold text-[21px] leading-[30px]">
              {lesson.title}
            </h3>
            <p className="text-[#4D5756] font-sora">
              {truncateTxt(lesson.description, 80)}
            </p>
          </Link>
          <div className="my-3 flex justify-between items-center flex-wrap gap-2 pb-4 border-b-2 border-dashed border-[#4D5756]">
            <span className="rounded-full bg-[#F0F1F1] px-3 py-1 text-xs font-sora">
              {lesson.delivery_mode === "offline"
                ? language === "ar" ? "حضوري" : "Offline"
                : language === "ar" ? "أونلاين" : "Online"}
            </span>
            <span className="rounded-full bg-[#F0F1F1] px-3 py-1 text-xs font-sora">
              {lesson.booking_type === "group"
                ? language === "ar" ? "جماعي" : "Group"
                : language === "ar" ? "خاص" : "Private"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <img
            src={lesson.teacher.profile_image || "/images/profile-avatar.webp"}
            alt={text.teacherImageAlt}
            loading="lazy"
            className="w-9 h-9 rounded-full object-top object-cover"
          />
          <h4 className="font-sora text-black-blue text-base">
            {text.by} <span className="text-main text-xl">{lesson.teacher.name}</span>
          </h4>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div
            className="flex items-center gap-2"
            aria-label={Number(lesson.price) === 0 ? text.free : `${lesson.price} EGP`}
          >
            {Number(lesson.price) === 0 ? (
              <span className="text-xl">{text.free}</span>
            ) : (
              <span className="text-main font-exo text-xl">{lesson.price} EGP</span>
            )}
          </div>

          <Link
            to={`/lessons/${lesson.id}`}
            className="block w-fit bg-main hover:bg-main/90 transition-all duration-200 rounded-[5px] text-white font-sora text-sm px-6 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
          >
            {text.details}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default LessonCard;
