import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

interface IProps {
  icon: any;
  title: string;
  descrp: string;
}

function ServiceCard({ icon, title, descrp }: IProps) {
  return (
    <div className="bg-white cursor-pointer group relative shadow-[0px_4px_20px_0px_#00000017] py-10 px-5 flex flex-col items-center gap-3 group-hover:bg-main">
      <div className="absolute bg-[url('/images/bg-green.png')] opacity-0 group-hover:opacity-100 inset-0 bg-cover bg-center transition-opacity duration-300" />
      <div className="relative z-10 border border-main border-dashed group-hover:border-white transition-colors duration-300 w-[80px] h-[80px] rounded-full flex justify-center items-center">
        <FontAwesomeIcon
          icon={icon}
          className="w-10 h-10 bg-main p-3 rounded-full text-white group-hover:text-main group-hover:bg-white transition-all duration-300"
        />
      </div>
      <div className="space-y-4 text-center">
        <h3 className="relative z-10 text-black-blue group-hover:text-white transition-colors duration-300 capitalize font-bold font-epilogue text-[22px]">
          {title}
        </h3>
        <p className="relative px-5 md:px-0 z-10 font-sora text-[#4D5756] group-hover:text-white text-[15px] transition-colors duration-200 text-center leading-7">
          {descrp}
        </p>
      </div>
      <Link
        to="/services/1"
        className="mt-4 relative z-10 bg-main block capitalize text-white group-hover:bg-white group-hover:text-main transition-colors duration-300 rounded-md font-sora text-[15px] px-6 py-4 hover:bg-[#F2A227]"
      >
        view details <FontAwesomeIcon className="ms-1" icon={faArrowRight} />
      </Link>
    </div>
  );
}

export default ServiceCard;
