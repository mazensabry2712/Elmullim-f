import { homeTeacherDropMenuVariants } from "@/animations";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface IProps {
  teacher: {
    id: number;
    img: string;
    links: {
      facebook: string;
      x: string;
      linkedin: string;
    };
  };
}
const TeacherSocial = ({ teacher }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        aria-label="teacher - social links"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full flex justify-center items-center bg-main hover:bg-main/90 relative z-10"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Share2 className="text-white w-6 h-6" />
        </motion.div>
      </Button>
      <motion.ul
        variants={homeTeacherDropMenuVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className={`bg-white py-3 rounded-3xl absolute bottom-full mt-2 before:w-6 ${
          isOpen ? "before:h-6" : "before:h-0 before:bottom-0"
        } before:transition-all before:rounded-full before:bg-white before:absolute before:-bottom-3 before:left-1/2 before:-translate-x-1/2 flex flex-col gap-4 justify-center items-center text-black-blue`}
        style={{
          maxHeight: isOpen ? "200px" : "0px",
        }}
      >
        <li className="cursor-pointer">
          <Link
            to={teacher.links.facebook}
            target="_blank"
            className="flex px-4 py-2"
            title="teacher facebook account"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_59_1768)">
                <path
                  d="M17.7061 3.50005C17.7061 3.36745 17.6534 3.24027 17.5596 3.1465C17.4658 3.05273 17.3387 3.00005 17.2061 3.00005H14.7061C13.4472 2.93734 12.2147 3.37544 11.2778 4.21863C10.3409 5.06182 9.77584 6.24155 9.70605 7.50005V10.2001H7.20605C7.07345 10.2001 6.94627 10.2527 6.8525 10.3465C6.75873 10.4403 6.70605 10.5674 6.70605 10.7001V13.3001C6.70605 13.4327 6.75873 13.5598 6.8525 13.6536C6.94627 13.7474 7.07345 13.8001 7.20605 13.8001H9.70605V20.5001C9.70605 20.6327 9.75873 20.7598 9.8525 20.8536C9.94627 20.9474 10.0734 21.0001 10.2061 21.0001H13.2061C13.3387 21.0001 13.4658 20.9474 13.5596 20.8536C13.6534 20.7598 13.7061 20.6327 13.7061 20.5001V13.8001H16.3261C16.4372 13.8017 16.5458 13.7661 16.6345 13.6991C16.7233 13.6321 16.7872 13.5374 16.8161 13.4301L17.5361 10.8301C17.5559 10.7562 17.5586 10.6787 17.5439 10.6036C17.5291 10.5286 17.4973 10.4579 17.451 10.397C17.4046 10.3362 17.3449 10.2868 17.2764 10.2526C17.208 10.2185 17.1326 10.2005 17.0561 10.2001H13.7061V7.50005C13.7309 7.25253 13.8472 7.02317 14.0321 6.85675C14.217 6.69033 14.4573 6.59881 14.7061 6.60005H17.2061C17.3387 6.60005 17.4658 6.54737 17.5596 6.45361C17.6534 6.35984 17.7061 6.23266 17.7061 6.10005V3.50005Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_59_1768">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </Link>
        </li>
        <li className="cursor-pointer">
          <Link
            to={teacher.links.linkedin}
            target="_blank"
            className="flex px-4 py-2"
            title={"teacher linkedin account"}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.856 5.39994C12.0896 5.39731 11.3302 5.54583 10.6212 5.83701C9.91218 6.12819 9.26757 6.55632 8.72421 7.09689C8.18086 7.63745 7.74943 8.27986 7.4546 8.98734C7.15978 9.69482 7.00735 10.4535 7.00604 11.2199V17.0999C7.00604 17.3386 7.10086 17.5676 7.26965 17.7363C7.43843 17.9051 7.66735 17.9999 7.90604 17.9999H10.006C10.2447 17.9999 10.4737 17.9051 10.6424 17.7363C10.8112 17.5676 10.906 17.3386 10.906 17.0999V11.2199C10.9058 10.9473 10.9631 10.6778 11.0741 10.4288C11.185 10.1798 11.3473 9.95698 11.5501 9.77488C11.753 9.59278 11.9919 9.45548 12.2514 9.37192C12.5109 9.28836 12.785 9.26043 13.056 9.28994C13.542 9.35115 13.9887 9.5886 14.3113 9.95725C14.6338 10.3259 14.8099 10.8001 14.806 11.2899V17.0999C14.806 17.3386 14.9009 17.5676 15.0696 17.7363C15.2384 17.9051 15.4673 17.9999 15.706 17.9999H17.806C18.0447 17.9999 18.2737 17.9051 18.4424 17.7363C18.6112 17.5676 18.706 17.3386 18.706 17.0999V11.2199C18.7047 10.4535 18.5523 9.69482 18.2575 8.98734C17.9627 8.27986 17.5312 7.63745 16.9879 7.09689C16.4445 6.55632 15.7999 6.12819 15.0909 5.83701C14.3819 5.54583 13.6225 5.39731 12.856 5.39994Z"
                fill="currentColor"
              />
              <path
                d="M4.30605 6.2998H1.60605C1.109 6.2998 0.706055 6.70275 0.706055 7.1998V17.0998C0.706055 17.5969 1.109 17.9998 1.60605 17.9998H4.30605C4.80311 17.9998 5.20605 17.5969 5.20605 17.0998V7.1998C5.20605 6.70275 4.80311 6.2998 4.30605 6.2998Z"
                fill="currentColor"
              />
              <path
                d="M2.95605 4.5C4.1987 4.5 5.20605 3.49264 5.20605 2.25C5.20605 1.00736 4.1987 0 2.95605 0C1.71341 0 0.706055 1.00736 0.706055 2.25C0.706055 3.49264 1.71341 4.5 2.95605 4.5Z"
                fill="currentColor"
              />
            </svg>
          </Link>
        </li>
        <li className="cursor-pointer">
          <Link
            to={teacher.links.x}
            target="_blank"
            className="flex px-4 py-2"
            title="teacher twitter account"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.7061 18H13.9063L9.10663 10.8L16.3062 0H17.5061L12.1065 8.4L18.7061 18Z"
                fill="currentColor"
              />
              <path
                d="M0.706055 0H5.50577L10.3055 7.2L3.10591 18H1.90598L7.30567 9.6L0.706055 0Z"
                fill="currentColor"
              />
            </svg>
          </Link>
        </li>
      </motion.ul>
    </>
  );
};

export default TeacherSocial;
