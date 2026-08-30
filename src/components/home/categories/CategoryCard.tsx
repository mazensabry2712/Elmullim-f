import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
  title: string;
  icon: IconDefinition;
}
const CategoryCard = ({ title, icon }: IProps) => {
  return (
    <div className="bg-background py-16 md:py-12 px-4 gap-5 group flex flex-col items-center text-black-blue justify-center rounded-xl hover:bg-main hover:text-white duration-300 shadow-md hover:shadow-lg">
      <span className="bg-background p-2 border-[3px] border-main border-dashed rounded-full group-hover:border-background group-hover:bg-main duration-300">
        <FontAwesomeIcon
          className="text-white h-10 w-10 p-5 bg-main text-[45px] rounded-full group-hover:bg-background group-hover:text-main duration-300 "
          icon={icon}
        />
      </span>
      <h2 className="font-extrabold text-[21px] capitalize text-center">
        {title}
      </h2>
    </div>
  );
};

export default CategoryCard;
