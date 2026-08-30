import BlogPost from "@/components/blog/BlogPost";
import BlogAside from "@/components/blog/BlogAside";
import { motion } from "framer-motion";

const BlogDetails = () => {
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
          Blog DETAILS
        </h1>
        <p className="font-sora font-light capitalize leading-[30px]">
          home <span className="text-main">//</span> blog
        </p>
      </motion.div>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
      >
        <div className="container  py-12 md:py-24 flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 w-full">
            <BlogPost />
          </div>
          <div className="lg:w-1/3 w-full">
            <BlogAside />
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default BlogDetails;
