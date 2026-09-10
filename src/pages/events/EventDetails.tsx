import { Link, useParams } from "react-router-dom";
import Newsletter from "@/components/Newsletter";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n";
import { getEventsCopy } from "./eventCopy";

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
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
          {copy.detailsTitle}
        </h1>
        <p
          className="font-sora font-light capitalize leading-[30px]"
          aria-label={copy.detailsBreadcrumb}
        >
          {copy.breadcrumbHome} <span className="text-main">//</span> {copy.detailsTitle}
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white relative"
        aria-labelledby="event-unavailable-title"
      >
        <div className="container py-12 md:py-24">
          <div className="mx-auto max-w-2xl rounded-[5px] border border-black/10 bg-white px-6 py-12 text-center shadow-[0px_0px_40px_0px_#0E2A4614] sm:px-10">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-main/10"
              aria-hidden="true"
            >
              <i className="fi fi-rs-calendar-clock text-main text-2xl" />
            </div>

            <p className="mb-3 font-sora text-sm font-semibold uppercase tracking-[0.12em] text-[#4D5756]">
              {eventId ? `#${eventId}` : ""}
            </p>
            <h2
              id="event-unavailable-title"
              className="text-black-blue font-epilogue text-2xl font-bold leading-9 md:text-3xl"
            >
              {copy.unavailableTitle}
            </h2>
            <p className="mt-4 font-sora text-base leading-7 text-[#4D5756] md:text-lg">
              {copy.unavailableDescription}
            </p>

            <Link
              to="/events"
              className="mt-8 inline-flex items-center justify-center rounded-[5px] bg-main px-6 py-3 font-sora font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
            >
              {copy.backToEvents}
            </Link>
          </div>
        </div>
      </motion.section>

      <Newsletter />
    </main>
  );
};

export default EventDetails;
