import { containerVariants, itemVariants } from "@/animations";
import { STATISTICS } from "@/constant";
import { motion } from "framer-motion";
import FactCard from "./FactCard";

const FunFacts = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-main bg-[url('/images/map.svg')] bg-center bg-cover bg-no-repeat"
    >
      <div className="px-2 lg:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-12 gap-x-3 px-6 sm:px-14 py-14 items-center"
        >
          {STATISTICS.map((statistic, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <FactCard statistic={statistic} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FunFacts;
