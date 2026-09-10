import { useI18n } from "@/i18n";

interface IProps {
  statistic: {
    title: string;
    icon: string;
    description: string;
  };
}

const statisticTranslationKeys: Record<string, string> = {
  "Successfully graduated": "home.statistics.graduated",
  "Classes Completed": "home.statistics.classesCompleted",
  "Satisfaction Rate": "home.statistics.satisfactionRate",
  "Students Community": "home.statistics.studentsCommunity",
};

const FactCard = ({ statistic }: IProps) => {
  const { t } = useI18n();
  const descriptionKey = statisticTranslationKeys[statistic.description];

  return (
    <div className="flex gap-3">
      <div className="bg-white w-[70px] h-[70px] flex justify-center items-center flex-shrink-0 rounded-[10px]">
        <i
          className={`${statistic.icon} flex justify-center items-center text-3xl text-main`}
          aria-hidden="true"
        />
      </div>
      <div>
        <h4 className="font-bold text-3xl text-white">{statistic.title}</h4>
        <p className="font-sora text-white capitalize">
          {descriptionKey ? t(descriptionKey) : statistic.description}
        </p>
      </div>
    </div>
  );
};

export default FactCard;
