import { containerVariants, itemVariants } from "@/animations";
import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import { BLOG_LIST } from "@/constant";

function BlogList() {
  return (
    <motion.div
      variants={containerVariants}
      viewport={{ once: true }}
      initial="hidden"
      whileInView="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 2xl:gap-7"
    >
      {BLOG_LIST.map((blog, idx) => (
        <motion.div variants={itemVariants} key={idx}>
          <BlogCard
            image={blog.image}
            date={blog.date}
            comments={blog.comments}
            descrp={blog.descrp}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default BlogList;
