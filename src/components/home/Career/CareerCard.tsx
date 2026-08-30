import { itemVariants } from "@/animations";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface Props {
  title: string;
  description: string;
  image: string;
}
const CareerCard = ({ title, description, image }: Props) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-main relative py-10 lg:pt-16 px-9 overflow-hidden rounded-[5px] h-[280px] shadow-md"
    >
      <div className="relative z-20 max-w-64 space-y-5">
        <p className="capitalize text-xl font-sora text-white-gray">{title}</p>
        <h4 className="text-xl font-bold text-white">{description}</h4>
        <Button className="w-auto h-auto font-sora text-[15px] !px-7 !py-4 text-white bg-black-blue hover:bg-black-blue/90 rounded-[5px] flex gap-x-2">
          Join Now
          <ArrowRight />
        </Button>
      </div>
      <div
        className={`w-80 h-80 bg-white bg-top bg-no-repeat absolute -right-28 -bottom-40 md:-right-20 md:-bottom-32 lg:-right-24 lg:-bottom-40 xl:-right-16 xl:-bottom-32 rounded-full flex justify-center overflow-hidden`}
        style={{ backgroundImage: `url(${image})` }}
      />
    </motion.div>
  );
};

export default CareerCard;
