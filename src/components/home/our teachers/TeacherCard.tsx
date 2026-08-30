import { itemVariants } from "@/animations";
import { motion } from "framer-motion";
import TeacherSocial from "./TeacherSocial";

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
const TeacherCard = ({ teacher }: IProps) => {
  return (
    <motion.div
      key={teacher.id}
      variants={itemVariants}
      className="rounded-lg overflow-hidden w-full max-w-96 md:max-w-full mx-auto md:mx-0 shadow hover:shadow-md transition-all duration-300"
    >
      <div className="h-96 overflow-hidden">
        <img
          src={teacher.img}
          alt="teacher"
          className="w-full h-full"
          loading="lazy"
        />
      </div>
      <div className="bg-black-blue flex justify-center items-center py-6 relative">
        <TeacherSocial teacher={teacher} />
      </div>
    </motion.div>
  );
};

export default TeacherCard;
