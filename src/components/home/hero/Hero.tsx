import { BENEFITS } from "@/constant";
import BenefitCard from "./BenefitCard";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/animations";
import BadgeTitle from "@/components/ui/BadgeTitle";

const Hero = () => {
  return (
    <section className="bg-[#F2F2F2] pt-6 py-8">
      <div className="relative container">
        {/* Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute w-full max-w-[270px] sm:max-w-[400px] h-[450px] bg-main filter blur-[600px]"
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
          className="flex flex-col xl:flex-row  justify-between gap-4"
        >
          <div className="w-full xl:max-w-[646px] mt-6 xl:mt-0 relative">
            <motion.div
              className="hidden xl:block absolute bottom-0 left-0 w-full h-[85%] bg-[#F6F6F6] -z-20"
              style={{
                clipPath: "polygon(44% 0, 100% 0, 68% 100%, 8% 100%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
            <motion.h1
              variants={itemVariants}
              className="max-w-[646px] mx-auto font-bold text-[45px] capitalize leading-[45px] text-center text-black-blue"
            >
              Get The Best Learning Experience With{" "}
              <span className="font-exo font-semibold text-main text-4xl">
                ELMULIM
              </span>
            </motion.h1>
            <div className="space-y-6 font-sora">
              <motion.div
                variants={itemVariants}
                className="mt-4 flex flex-col gap-2 items-center xl:items-start"
              >
                <BadgeTitle title="Why Choose Us" />
                <p className="max-w-[646px] text-[17px] leading-relaxed text-[#333931] text-center xl:text-start">
                  Lorem Ipsumis simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley
                </p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-4 items-center xl:items-start"
              >
                <BadgeTitle title="Benefits With Us" />
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {BENEFITS.map((benefit, idx) => (
                    <motion.div key={idx} variants={itemVariants}>
                      <BenefitCard benefit={benefit} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
          <motion.div
            variants={itemVariants}
            className="w-fit mx-auto xl:mt-10 py-16 px-4 lg:px-8"
          >
            <div className="flex justify-center items-center relative">
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                src="/images/hero-img-bg.webp"
                alt="elmullim"
                className="max-w-xl w-full absolute"
              />
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.3 }}
                src="/images/hero-img.webp"
                alt="elmullim"
                className="max-w-xl w-full relative z-10 filter drop-shadow-[4px_4px_4px_rgba(0,0,0,0.25)]"
              />
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.3 }}
                src="/icons/cap-icon.svg"
                alt="elmullim"
                className="absolute -left-8 top-12 xl:-translate-y-1/2"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
