import { motion } from "framer-motion";
import CategoryCard from "./CategoryCard";
import { containerVariants, itemVariants } from "@/animations";
import { CATEGORIES } from "@/constant";
import BadgeTitle from "@/components/ui/BadgeTitle";

const Categories = () => {
  return (
    <section className="bg-white py-10 relative z-10">
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
            <BadgeTitle title="categories" />
            <h4 className="capitalize text-black-blue font-bold text-[45px] text-center md:text-left">
              Browse By{" "}
              <span className="font-exo font-semibold text-main text-4xl">
                Categories
              </span>
            </h4>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="card cursor-pointer grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-9 gap-y-10 mt-4 lg:mt-16"
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
