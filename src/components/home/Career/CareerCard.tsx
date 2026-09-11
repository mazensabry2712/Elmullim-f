import { itemVariants } from "@/animations";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n";

interface Props {
  title: string;
  description: string;
  image: string;
  href: string;
}

const CareerCard = ({ title, description, image, href }: Props) => {
  const { t } = useI18n();

  return (
    <motion.div
      variants={itemVariants}
      className="relative h-[280px] overflow-hidden rounded-[5px] bg-main px-6 py-8 shadow-md sm:px-9 sm:py-10 lg:pt-16"
    >
      <div className="relative z-20 max-w-64 space-y-5">
        <p className="font-sora text-lg capitalize text-white-gray sm:text-xl">{title}</p>
        <h4 className="max-w-[15rem] text-lg font-bold text-white sm:text-xl">{description}</h4>
        <Link
          to={href}
          className="inline-flex h-auto w-auto items-center gap-x-2 rounded-[5px] bg-black-blue !px-5 !py-3 font-sora text-sm text-white hover:bg-black-blue/90 sm:!px-7 sm:!py-4 sm:text-[15px]"
        >
          {t("home.career.joinNow")}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
      <div
        className="absolute -bottom-28 -right-24 flex h-56 w-56 justify-center overflow-hidden rounded-full bg-white bg-top bg-no-repeat sm:-bottom-32 sm:-right-20 sm:h-72 sm:w-72 lg:-bottom-40 lg:-right-24 xl:-bottom-32 xl:-right-16"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />
    </motion.div>
  );
};

export default CareerCard;
