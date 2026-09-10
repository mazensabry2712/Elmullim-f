import { motion } from "framer-motion";
import Newsletter from "@/components/Newsletter";
import { itemVariants } from "@/animations";
import Svg from "./components/Svg";
import { useI18n } from "@/i18n";
import { getEventsCopy } from "./eventCopy";

const Events = () => {
  const { language } = useI18n();
  const copy = getEventsCopy(language);

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container text-center text-white space-y-4 md:space-y-6 pt-20 md:pt-32 pb-16 md:pb-24"
      >
        <h1 className="uppercase text-4xl md:text-6xl font-bold leading-[74px]">
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
        className="bg-white relative"
        aria-labelledby="events-empty-title"
      >
        <Svg />

        <div className="container py-12 md:py-24">
          <motion.div
            variants={itemVariants}
            className="mx-auto max-w-2xl rounded-[5px] border border-black/10 bg-white px-6 py-12 text-center shadow-[0px_0px_40px_0px_#0E2A4614] sm:px-10"
          >
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-main/10"
              aria-hidden="true"
            >
              <i className="fi fi-rs-calendar-clock text-main text-2xl" />
            </div>

            <h2
              id="events-empty-title"
              className="text-black-blue font-epilogue text-2xl font-bold leading-9 md:text-3xl"
            >
              {copy.emptyTitle}
            </h2>
            <p className="mt-4 font-sora text-base leading-7 text-[#4D5756] md:text-lg">
              {copy.emptyDescription}
            </p>
          </motion.div>
        </div>
      </motion.section>

      <Newsletter />
    </main>
  );
};

export default Events;
