import { containerVariants, itemVariants } from "@/animations";
import { motion } from "framer-motion";
import ServiceCard from "./ServiceCard";
import { SERVICES_LIST } from "@/constant";
function ServicesList() {
  return (
    <motion.div
      variants={containerVariants}
      viewport={{ once: true }}
      initial="hidden"
      whileInView="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
    >
      {SERVICES_LIST.map((service, idx) => (
        <motion.div variants={itemVariants} key={idx}>
          <ServiceCard
            icon={service.icon}
            title={service.title}
            descrp={service.descrp}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default ServicesList;
