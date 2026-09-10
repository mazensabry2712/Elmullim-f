import { motion } from "framer-motion";
import CategoryCard from "./CategoryCard";
import { containerVariants, itemVariants } from "@/animations";
import { CATEGORIES } from "@/constant";
import BadgeTitle from "@/components/ui/BadgeTitle";

const Categories = () => {
  return (
    <section
      id="categories"
      aria-labelledby="home-categories-title"
      className="relative z-10 bg-white py-14 md:py-16"
    >
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-end"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-2 md:items-start"
          >
            <BadgeTitle title="Categories" />
            <h2
              id="home-categories-title"
              className="text-center text-3xl font-bold capitalize leading-tight text-black-blue sm:text-4xl md:text-left lg:text-[45px]"
            >
              Browse by <span className="font-exo font-semibold text-main">Categories</span>
            </h2>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4"
        >
          {CATEGORIES.map((category) => (
            <motion.div variants={itemVariants} key={category.title}>
              <CategoryCard title={category.title} icon={category.icon} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
