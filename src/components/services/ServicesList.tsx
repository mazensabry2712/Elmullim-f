import { motion } from "framer-motion";
import {
  faBoltLightning,
  faBrain,
  faChalkboardTeacher,
  faMedal,
  faTrophy,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { containerVariants, itemVariants } from "@/animations";
import { useI18n } from "@/i18n";
import ServiceCard from "./ServiceCard";
import { SERVICE_ITEMS, getServicesCopy } from "@/pages/services/serviceCopy";

const icons = {
  faChalkboardTeacher,
  faTrophy,
  faBoltLightning,
  faBrain,
  faVideo,
  faMedal,
};

function ServicesList() {
  const { language } = useI18n();
  const copy = getServicesCopy(language);

  return (
    <motion.div
      variants={containerVariants}
      viewport={{ once: true }}
      initial="hidden"
      whileInView="visible"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
    >
      {SERVICE_ITEMS.map((service) => {
        const item = copy.items[service.id];
        return (
          <motion.div variants={itemVariants} key={service.id}>
            <ServiceCard
              id={service.id}
              icon={icons[service.icon]}
              title={item.title}
              description={item.description}
              detailsLabel={copy.viewDetails}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default ServicesList;
