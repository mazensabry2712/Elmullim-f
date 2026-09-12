import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";

interface IProps {
  image: string;
  date: string;
  comments: string;
  descrp: string;
}

function BlogCard({ image, date, comments, descrp }: IProps) {
  const { language } = useI18n();

  const localizedDate = language === "ar" && date === "14 June 2023"
    ? "14 يونيو 2023"
    : date;
  const localizedComments = language === "ar" && comments === "Comment (06)"
    ? "التعليقات (06)"
    : comments;
  const localizedDescription = language === "ar" && descrp.includes("velit esse cillum")
    ? "تجربة تعليمية واضحة وممتعة تساعد الطلاب على التعلم والتفاعل والاستفادة من المحتوى بشكل أفضل."
    : descrp;

  return (
    <div className="bg-[#F2F2F2] p-5 rounded-md shadow-md">
      <div className="w-full max-h-80 sm:max-h-72 md:max-h-52">
        <img
          src={image}
          alt={language === "ar" ? "صورة المقال" : "blog-img"}
          className="w-full h-full rounded-lg"
        />
      </div>
      <div className="flex mx-5 mt-5 justify-between text-[#4D5756] font-sora">
        <span>{localizedDate}</span>
        <span>{localizedComments}</span>
      </div>
      <p className="font-epilogue text-black-blue text-[19px] text-lg my-5">
        {localizedDescription}
      </p>
      <div className="my-8">
        <Link
          to="/blog/1"
          className="bg-main text-[#FFFFFF] rounded-md font-sora text-[15px] px-6 py-4 hover:bg-[#F2A227] transition-colors duration-300 ease-in-out"
        >
          {language === "ar" ? "اقرأ المزيد" : "Read More"} <FontAwesomeIcon className="ms-1" icon={faArrowRight} />
        </Link>
      </div>
    </div>
  );
}

export default BlogCard;
