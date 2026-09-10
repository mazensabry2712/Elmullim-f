import { useI18n } from "@/i18n";
import { RiDoubleQuotesR } from "react-icons/ri";
import { motion } from "framer-motion";

const AboutTestimonial = () => {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      aria-labelledby="about-testimonial-title"
      className="bg-[url('/images/map.svg')] bg-center bg-cover bg-no-repeat relative overflow-hidden"
    >
      <img
        src="/icons/shape.webp"
        alt=""
        aria-hidden="true"
        width={450}
        height={450}
        loading="lazy"
        className="absolute bottom-0 left-0 h-56 md:h-[450px]"
      />
      <div className="container py-16 md:py-36 relative">
        <div className="xl:px-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col justify-center gap-3 xl:max-w-[570px]"
          >
            <p className="text-main font-sora uppercase flex items-center justify-center lg:justify-start gap-1 md:text-lg font-light">
              <i
                className="fi fi-ts-book-bookmark flex justify-center items-center"
                aria-hidden="true"
              />
              {t("about.testimonial.badge")}
            </p>
            <h2
              id="about-testimonial-title"
              className="text-black-blue font-bold capitalize text-3xl md:text-4xl xl:text-[45px] !leading-[55px]"
            >
              {t("about.testimonial.title")}
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 xl:max-w-[450px] flex justify-center"
          >
            <p className="font-sora text-[17px] leading-[32px] text-[#4D5756]">
              {t("about.testimonial.description")}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20"
        >
          <div className="bg-black-blue relative shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="absolute right-20 -translate-y-1/2" aria-hidden="true">
              <div className="bg-main px-4 py-2">
                <RiDoubleQuotesR size={40} className="text-black-blue" />
              </div>
              <div className="w-12 h-8 absolute border border-[#8694A2] -z-10 -bottom-2 -left-2" />
            </div>
            <div className="py-16 px-6 md:px-8 lg:px-16 flex flex-col md:flex-row items-center gap-4 gap-x-12">
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <div className="w-[20px] h-[20px] bg-main rounded-full" aria-hidden="true" />
                <img
                  src="/images/teacher-img1.png"
                  alt={t("about.testimonial.imageAlt")}
                  width={100}
                  height={100}
                  loading="lazy"
                  className="w-[100px] h-[100px] rounded-full object-cover object-top"
                />
                <div className="w-[20px] h-[20px] bg-main rounded-full" aria-hidden="true" />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-2xl text-white text-center md:text-start">
                    Courtney Henry
                  </h3>
                  <p className="font-sora font-light text-main uppercase text-[13px] text-center md:text-start">
                    {t("about.testimonial.role")}
                  </p>
                </div>
                <blockquote className="font-sora text-base md:text-[17px] leading-relaxed text-white text-center md:text-start">
                  “{t("about.testimonial.quote")}”
                </blockquote>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutTestimonial;
