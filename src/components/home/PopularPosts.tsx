import BadgeTitle from "../ui/BadgeTitle";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { containerVariants, itemVariants } from "@/animations";

const PopularPosts = () => {
  return (
    <section className="bg-background py-24 relative z-10">
      <div className="absolute top-0 right-0 -z-10">
        <img src="/images/posts-line-bg.svg" alt="bg" />
      </div>
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="flex flex-col md:flex-row gap-4 md:justify-between items-center md:items-end"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-2 items-center md:items-start"
          >
            <BadgeTitle title="BLOG POST" />
            <h4 className="capitalize text-black-blue font-bold text-[45px] text-center md:text-left">
              Post Popular Post
            </h4>
          </motion.div>
          <motion.div
            className="flex gap-4 justify-center md:justify-end"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Button className="font-epilogue w-fit rounded-[5px] !px-7 !py-4 h-auto bg-main hover:bg-main/90 text-[15px] font-bold flex items-center justify-center gap-[10px]">
              All blog post <ArrowRight className="text-white" />
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="flex justify-center md:justify-end my-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Button className="font-epilogue w-fit rounded-[5px] !px-16 !py-4 h-auto bg-black-blue hover:bg-black-blue/90 text-[15px] font-bold flex items-center justify-center gap-[10px]">
            Post a Topic
          </Button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 mb-10 gap-y-20 px-2 items-center justify-center"
        >
          {Array.from({ length: 3 }, (_, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="max-w-96 lg:max-w-max mx-auto duration-300 hover:shadow-md pb-2 rounded-xl"
            >
              <div className="overflow-hidden px-16 py-5 rounded-xl">
                <img
                  className="bg-white scale-[4.5] translate-y-5"
                  src="/images/image.jpeg"
                  alt="post"
                  loading="lazy"
                />
              </div>
              <div className="bg-background px-2">
                <div className="font-sora flex text-[#4D5756] text-[15px] items-center justify-between my-4">
                  <p>14 June 2023</p>
                  <p>Comment (06)</p>
                </div>
                <h2 className="text-black-blue font-semibold text-[19px] mb-6">
                  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                  sint occaecat cupidatat
                </h2>
                <Button className="h-auto w-auto font-sora text-white text-[15px] capitalize flex gap-x-5 items-center bg-main rounded-[5px] !py-4 !px-7 hover:bg-black-blue duration-300">
                  read more
                  <ArrowRight className="text-white" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularPosts;
