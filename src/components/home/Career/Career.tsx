import { containerVariants } from "@/animations";
import BadgeTitle from "@/components/ui/BadgeTitle";
import { motion } from "framer-motion";
import { CAREER_CONTENT } from "@/constant";
import CareerCard from "./CareerCard";

const Career = () => {
  return (
    <section className="from-[#F8F6F1] bg-gradient-to-b to-[#FFFFFF] py-20">
      {/* Title */}
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-2 items-center pt-10 "
        >
          <BadgeTitle title="choose your career" />
          <h4 className="capitalize text-black-blue font-bold text-[45px] text-center md:text-left">
            discover your gain
          </h4>
        </motion.div>
        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 lg:mt-20"
        >
          {CAREER_CONTENT.map((item, index) => (
            <CareerCard
              key={index}
              title={item.title}
              description={item.description}
              image={item.image}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Career;
