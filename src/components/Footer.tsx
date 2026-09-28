import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n";

const Footer = () => {
  const { t, language } = useI18n();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const quickLinks = [
    { key: "footer.home", path: "/", translation: "nav.home" },
    { key: "footer.about", path: "/about", translation: "nav.about" },
    { key: "footer.services", path: "/services", translation: "nav.services" },
    { key: "footer.contactUs", path: "/contact-us", translation: "nav.contactUs" },
    { key: "footer.courses", path: "/courses", translation: "nav.courses" },
    { key: "footer.lessons", path: "/lessons", translation: "nav.lessons" },
    { key: "footer.faqs", path: "/faqs", translation: "nav.faqs" },
  ];

  return (
    <footer className="bg-[url('/images/footer-bg.webp')] bg-cover bg-no-repeat">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container"
      >
        <div className="ml-0 max-w-[930px] grid grid-cols-1 gap-x-6 gap-y-14 py-16 text-center md:grid-cols-2 md:text-start lg:gap-x-24 lg:py-20">
          <motion.div variants={itemVariants} className="space-y-[14px]">
            <div className="flex items-center justify-center rounded-2xl bg-white py-1 shadow-[1px_2px_4px_rgba(255,255,255,0.25)]">
              <Link to="/" className="flex items-center">
                <motion.img
                  src="/images/logo.webp"
                  alt="logo"
                  className="h-14 w-14 cursor-pointer p-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                />
                <motion.h3
                  className="font-epilogue text-2xl font-bold text-black-blue"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  Elm<span className="text-main">ullim</span>
                </motion.h3>
              </Link>
            </div>
            <motion.p variants={itemVariants} className="font-sora text-[17px] text-white-gray">
              {language === "ar"
                ? "منصة تعليمية تجمع الطلاب والمعلمين وأولياء الأمور لتقديم تجربة تعلم واضحة ومترابطة وسهلة الوصول."
                : t("footer.description")}
            </motion.p>
          </motion.div>

          <motion.div variants={containerVariants} className="grid grid-cols-1 gap-x-4 gap-y-9 md:grid-cols-2">
            <motion.div variants={itemVariants} className="space-y-8">
              <h4 className="text-[22px] font-bold capitalize text-white">{t("footer.servicesTitle")}</h4>
              <ul className="space-y-4 text-white-gray">
                {[
                  "footer.services.learning",
                  "footer.services.parentControl",
                  "footer.services.management",
                  "footer.services.masterTeachers",
                  "footer.services.news",
                ].map((key) => (
                  <motion.li key={key} variants={itemVariants} className="font-sora text-[17px] capitalize">
                    {t(key)}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-8">
              <h4 className="text-[22px] font-bold capitalize text-white">{t("footer.quickLinksTitle")}</h4>
              <ul className="space-y-4 text-white-gray">
                {quickLinks.map((link) => (
                  <motion.li
                    key={link.key}
                    variants={itemVariants}
                    className="font-sora text-[17px] capitalize transition-colors duration-200 hover:text-main"
                  >
                    <Link to={link.path}>{t(link.translation)}</Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-[#1F2C3B] py-3 text-center font-exo text-[17px] font-normal capitalize text-white font-sora"
      >
        &copy; {new Date().getFullYear()} <span className="font-black text-main">Elmullim</span> || {t("footer.rightsReserved")} By XRO
      </motion.div>
    </footer>
  );
};

export default Footer;
