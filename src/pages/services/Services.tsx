import { motion } from "framer-motion";
import Newsletter from "@/components/Newsletter";
import ServicesList from "@/components/services/ServicesList";
import { useI18n } from "@/i18n";
import { getServicesCopy } from "./serviceCopy";

const Services = () => {
  const { language } = useI18n();
  const copy = getServicesCopy(language);

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container space-y-4 pt-20 text-center text-white md:space-y-6 md:pt-32 md:pb-24 pb-16"
      >
        <h1 className="text-4xl font-bold uppercase leading-[74px] md:text-6xl">
          {copy.title}
        </h1>
        <p
          className="font-sora font-light capitalize leading-[30px]"
          aria-label={copy.breadcrumb}
        >
          {copy.breadcrumbHome} <span className="text-main">//</span> {copy.title}
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
        aria-label={copy.title}
      >
        <div className="container py-12 md:py-24">
          <ServicesList />
        </div>
      </motion.section>

      <Newsletter />
    </main>
  );
};

export default Services;
