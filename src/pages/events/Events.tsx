import { motion } from "framer-motion";
import Newsletter from "@/components/Newsletter";
import { itemVariants } from "@/animations";
import Svg from "./components/Svg";
import EventCard from "./components/EventCard";

const Events = () => {
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
          Events
        </h1>
        <p className="font-sora font-light capitalize leading-[30px]">
          home <span className="text-main">//</span> Events
        </p>
      </motion.div>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className=" bg-white bg relative"
      >
        <Svg />

        <div className="container py-12 md:py-24">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <motion.div variants={itemVariants} key={idx}>
                <EventCard />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      <div>
        <Newsletter />
      </div>
    </main>
  );
};

export default Events;
