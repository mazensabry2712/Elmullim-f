import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
interface IProps {
  image: string;
  date: string;
  comments: string;
  descrp: string;
}

function BlogCard({ image, date, comments, descrp }: IProps) {
  return (
    <>
      <div className="bg-[#F2F2F2] p-5 rounded-md shadow-md">
        <div className="w-full max-h-80 sm:max-h-72 md:max-h-52">
          <img
            src={image}
            alt="blog-img"
            className="w-full h-full rounded-lg"
          />
        </div>
        <div className="flex mx-5 mt-5 justify-between text-[#4D5756] font-sora">
          <span>{date}</span>
          <span>{comments}</span>
        </div>
        <p className="font-epilogue text-black-blue text-[19px] text-lg my-5">
          {descrp}
        </p>
        <div className="my-8">
          <Link
            to="/blog/1"
            className="bg-main text-[#FFFFFF] rounded-md font-sora text-[15px] px-6 py-4 hover:bg-[#F2A227] transition-colors duration-300 ease-in-out"
          >
            Read More <FontAwesomeIcon className="ms-1" icon={faArrowRight} />
          </Link>
        </div>
      </div>
    </>
  );
}

export default BlogCard;
