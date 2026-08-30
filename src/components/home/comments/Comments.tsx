import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/animations";
import CommentCard from "./CommentCard";
import BadgeTitle from "@/components/ui/BadgeTitle";
import FunFacts from "../../FunFacts";

const Comments = () => {
  return (
    <section className="bg-[#F8F6F1]">
      {/* Statistics Section */}
      <FunFacts />

      {/* Title & Button */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mt-8"
      >
        <div className="flex flex-col gap-4">
          <BadgeTitle title="Comment" />
          <h4 className="capitalize text-black-blue font-bold text-4xl md:text-[45px]">
            user comments
          </h4>
        </div>
      </motion.div>

      {/* User Comments */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mt-9 space-y-9"
      >
        {Array.from({ length: 2 }, (_, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <CommentCard />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Comments;
