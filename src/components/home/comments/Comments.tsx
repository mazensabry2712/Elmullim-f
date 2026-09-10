import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/animations";
import CommentCard from "./CommentCard";
import BadgeTitle from "@/components/ui/BadgeTitle";
import FunFacts from "../../FunFacts";
import { useI18n } from "@/i18n";

const Comments = () => {
  const { t } = useI18n();

  return (
    <section
      id="comments"
      aria-labelledby="home-comments-title"
      className="bg-[#F8F6F1]"
    >
      <FunFacts />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mt-8"
      >
        <div className="flex flex-col gap-4">
          <BadgeTitle title={t("home.comments.badge")} />
          <h2
            id="home-comments-title"
            className="capitalize text-black-blue font-bold text-4xl md:text-[45px]"
          >
            {t("home.comments.title")}
          </h2>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mt-9 space-y-9"
        role="list"
        aria-label={t("home.comments.title")}
      >
        {Array.from({ length: 2 }, (_, idx) => (
          <motion.div key={idx} variants={itemVariants} role="listitem">
            <CommentCard />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Comments;
