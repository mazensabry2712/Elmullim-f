import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useI18n } from "@/i18n";

interface IProps {
  benefit: {
    title: string;
    description: string;
  };
}

const benefitTranslationKeys: Record<string, { title: string; description: string }> = {
  "Secured Payment": {
    title: "home.hero.benefit.securedPayment.title",
    description: "home.hero.benefit.securedPayment.description",
  },
  "Rating for Teachers & Students": {
    title: "home.hero.benefit.rating.title",
    description: "home.hero.benefit.rating.description",
  },
  "Dashboard for Parents to oversee their heroes": {
    title: "home.hero.benefit.parentDashboard.title",
    description: "home.hero.benefit.parentDashboard.description",
  },
  "Ability to learn Online or Offline": {
    title: "home.hero.benefit.onlineOffline.title",
    description: "home.hero.benefit.onlineOffline.description",
  },
};

const BenefitCard = ({ benefit: { title, description } }: IProps) => {
  const { t } = useI18n();
  const keys = benefitTranslationKeys[title];

  return (
    <div className="bg-white w-full h-full px-4 py-4 rounded-lg space-y-2 transition-all duration-300 shadow-sm hover:shadow-md">
      <h3 className="flex items-center gap-2 text-black-blue text-[17px] font-semibold">
        <FontAwesomeIcon
          icon={faCheck}
          className="text-white bg-main w-3 h-3 p-1 rounded-full flex-shrink-0"
        />
        {keys ? t(keys.title) : title}
      </h3>
      <p className="text-[15px] text-muted pl-8">
        {keys ? t(keys.description) : description}
      </p>
    </div>
  );
};

export default BenefitCard;
