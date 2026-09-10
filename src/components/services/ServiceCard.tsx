import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Link } from "react-router-dom";

interface IProps {
  id: string;
  icon: IconDefinition;
  title: string;
  description: string;
  detailsLabel: string;
}

function ServiceCard({ id, icon, title, description, detailsLabel }: IProps) {
  return (
    <article className="group relative flex h-full cursor-default flex-col items-center gap-3 overflow-hidden rounded-[5px] bg-white px-5 py-10 shadow-[0px_4px_20px_0px_#00000017]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/images/bg-green.png')] bg-cover bg-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative z-10 flex h-[80px] w-[80px] items-center justify-center rounded-full border border-dashed border-main transition-colors duration-300 group-hover:border-white">
        <FontAwesomeIcon
          icon={icon}
          aria-hidden="true"
          className="h-10 w-10 rounded-full bg-main p-3 text-white transition-all duration-300 group-hover:bg-white group-hover:text-main"
        />
      </div>
      <div className="space-y-4 text-center">
        <h2 className="relative z-10 font-epilogue text-[22px] font-bold capitalize leading-8 text-black-blue transition-colors duration-300 group-hover:text-white">
          {title}
        </h2>
        <p className="relative z-10 px-5 text-center font-sora text-[15px] leading-7 text-[#4D5756] transition-colors duration-200 group-hover:text-white md:px-0">
          {description}
        </p>
      </div>
      <Link
        to={`/services/${id}`}
        className="relative z-10 mt-auto inline-flex items-center justify-center rounded-md bg-main px-6 py-4 font-sora text-[15px] capitalize text-white transition-colors duration-300 hover:bg-[#F2A227] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 group-hover:bg-white group-hover:text-main"
      >
        {detailsLabel}
        <FontAwesomeIcon aria-hidden="true" className="ms-2" icon={faArrowRight} />
      </Link>
    </article>
  );
}

export default ServiceCard;
