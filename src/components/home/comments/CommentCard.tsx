import { RiDoubleQuotesR } from "react-icons/ri";
import { useI18n } from "@/i18n";

const CommentCard = () => {
  const { t } = useI18n();

  return (
    <article className="relative bg-black-blue shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="absolute right-5 top-0 -translate-y-1/2 md:right-20">
        <div className="bg-main px-4 py-2">
          <RiDoubleQuotesR size={40} className="text-black-blue" aria-hidden="true" />
        </div>
        <div className="w-12 h-8 absolute border border-[#8694A2] -z-10 -bottom-2 -left-2" />
      </div>

      <div className="py-10 px-6 md:px-8 lg:px-16 flex flex-col md:flex-row items-center gap-8 md:gap-x-12">
        <div className="flex shrink-0 flex-col items-center gap-3" aria-hidden="true">
          <div className="w-[44px] h-[30px] md:w-[66px] md:h-[50px] bg-white rounded-full" />
          <div className="w-[90px] h-[61px] md:w-[110px] md:h-[81px] bg-white rounded-full" />
          <div className="w-[44px] h-[30px] md:w-[66px] md:h-[50px] bg-white rounded-full" />
        </div>

        <div className="space-y-4 min-w-0">
          <div>
            <h3 className="font-bold text-2xl text-white text-center md:text-start">
              Courtney Henry
            </h3>
            <p className="font-sora font-light text-main uppercase text-[13px] text-center md:text-start">
              {t("home.comments.role")}
            </p>
          </div>
          <p className="font-sora text-base md:text-[17px] leading-relaxed text-white text-center md:text-start">
            “{t("home.comments.quote")}”
          </p>
        </div>
      </div>
    </article>
  );
};

export default CommentCard;
