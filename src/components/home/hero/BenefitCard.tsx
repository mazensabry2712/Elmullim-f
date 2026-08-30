import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
  benefit: {
    title: string;
    description: string;
  };
}
const BenefitCard = ({ benefit: { title, description } }: IProps) => {
  return (
    <div className="bg-white w-full h-full px-4 py-4 rounded-lg space-y-2 transition-all duration-300 shadow-sm hover:shadow-md">
      <h3 className="flex items-center gap-2 text-black-blue text-[17px] font-semibold">
        <FontAwesomeIcon
          icon={faCheck}
          className="text-white bg-main w-3 h-3 p-1 rounded-full flex-shrink-0"
        />
        {title}
      </h3>
      <p className="text-[15px] text-muted pl-8">{description}</p>
    </div>
  );
};

export default BenefitCard;
