import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
  title: string;
  icon: IconDefinition;
}

const CategoryCard = ({ title, icon }: IProps) => {
  return (
    <article className="group flex min-h-64 flex-col items-center justify-center gap-5 rounded-xl bg-background px-4 py-12 text-center text-black-blue shadow-md transition duration-300 hover:bg-main hover:text-white hover:shadow-lg">
      <span
        aria-hidden="true"
        className="rounded-full border-[3px] border-dashed border-main bg-background p-2 transition duration-300 group-hover:border-background group-hover:bg-main"
      >
        <FontAwesomeIcon
          className="h-10 w-10 rounded-full bg-main p-5 text-[45px] text-white transition duration-300 group-hover:bg-background group-hover:text-main"
          icon={icon}
        />
      </span>
      <h3 className="text-[20px] font-extrabold capitalize leading-tight sm:text-[21px]">
        {title}
      </h3>
    </article>
  );
};

export default CategoryCard;
