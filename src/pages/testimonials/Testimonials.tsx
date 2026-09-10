import { itemVariants } from "@/animations";
import Newsletter from "@/components/Newsletter";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n";
import TestimonialsCard from "./TestimonialsCard";
import Svgbng from "./Svgbng";
import { getTestimonialsCopy, TESTIMONIAL_ITEMS } from "./testimonialCopy";

const Testimonials = () => {
  const { language } = useI18n();
  const copy = getTestimonialsCopy(language);

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container text-center text-white space-y-4 md:space-y-6 pt-20 md:pt-32 pb-16 md:pb-24"
      >
        <h1 className="uppercase text-4xl md:text-6xl font-bold leading-[74px]">{copy.title}</h1>
        <p className="font-sora font-light capitalize leading-[30px]" aria-label={copy.breadcrumb}>
          {copy.home} <span className="text-main">//</span> {copy.title}
        </p>
      </motion.div>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white relative"
        aria-labelledby="testimonials-title"
      >
        <Svgbng />
        <div className="container py-12 md:py-24">
          <h2 id="testimonials-title" className="sr-only">{copy.title}</h2>
          <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-7">
            {TESTIMONIAL_ITEMS.map((item) => (
              <motion.div variants={itemVariants} key={item.id}>
                <TestimonialsCard
                  name={copy.names[item.id]}
                  role={copy.roles[item.roleKey]}
                  quote={copy.quotes[item.id]}
                  image={item.image}
                  imageAlt={copy.imageAlt}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      <Newsletter />
    </main>
  );
};

export default Testimonials;
