import { Star } from "lucide-react";
import { useI18n } from "@/i18n";
import { IRating } from "@/interfaces/students/studentProfile";

interface IProps {
  rate: IRating;
}

const StudentRating = ({ rate }: IProps) => {
  const { language } = useI18n();
  const isArabic = language === "ar";
  const actor = rate.reply;
  const actorType = actor?.type?.toLowerCase().includes("teacher")
    ? isArabic
      ? "مدرس"
      : "Teacher"
    : actor?.type?.toLowerCase().includes("famil")
      ? isArabic
        ? "ولي الأمر"
        : "Parent"
      : isArabic
        ? "مُقيّم"
        : "Reviewer";

  const formattedDate = (() => {
    const value = new Date(rate.created_at);
    if (Number.isNaN(value.getTime())) return rate.created_at;
    return new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(value);
  })();

  return (
    <article className="rounded-xl border border-gray-100 bg-[#F7F8F8] p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <img
          className="h-16 w-16 shrink-0 rounded-full object-cover"
          src={actor?.image || "/images/profile-avatar.webp"}
          alt={actor?.name || (isArabic ? "صورة المقيم" : "Reviewer")}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="break-words font-sora text-base font-bold text-black-blue">
                {actor?.name || (isArabic ? "غير معروف" : "Unknown")}
              </h2>
              <p className="font-sora text-xs font-medium text-main">{actorType}</p>
            </div>
            <time
              dateTime={rate.created_at}
              className="font-sora text-xs text-[#697372]"
            >
              {formattedDate}
            </time>
          </div>

          <div className="mt-3 flex items-center gap-1" aria-label={
            isArabic ? `التقييم: ${rate.rate} من 5` : `Rating: ${rate.rate} out of 5`
          }>
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${index < rate.rate ? "fill-current text-main" : "text-gray-300"}`}
                aria-hidden="true"
              />
            ))}
            <span className="ms-1 font-sora text-sm font-semibold text-black-blue">
              {rate.rate}/5
            </span>
          </div>

          <p className="mt-3 break-words whitespace-pre-wrap font-sora text-sm leading-6 text-[#4D5756]">
            {rate.description}
          </p>
        </div>
      </div>
    </article>
  );
};

export default StudentRating;
