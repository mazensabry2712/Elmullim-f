import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
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
    {
      name: "Home",
      path: "/",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Services",
      path: "/services",
    },
    {
      name: "Contact Us",
      path: "/contact-us",
    },
    {
      name: "Courses",
      path: "/courses",
    },
    {
      name: "Lessons",
      path: "/lessons",
    },
    {
      name: "FAQs",
      path: "/faqs",
    },
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
        {/* Main Content */}
        <div className="ml-0 text-center md:text-start max-w-[930px] py-16 lg:py-20 grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-24 gap-y-14">
          {/* Left Section */}
          <motion.div variants={itemVariants} className="space-y-[14px]">
            <div className="bg-white flex justify-center items-center shadow-[1px_2px_4px_rgba(255,255,255,0.25)] rounded-2xl py-1">
              <Link to={"/"} className="flex items-center">
                <motion.img
                  src={"/images/logo.webp"}
                  alt="logo"
                  className="w-14 h-14 cursor-pointer p-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                />
                <motion.h3
                  className="font-bold text-black-blue text-2xl font-epilogue"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  Elm<span className="text-main">ullim</span>
                </motion.h3>
              </Link>
            </div>
            <motion.p
              variants={itemVariants}
              className="text-white-gray text-[17px] font-sora"
            >
              Interdum velit laoreet id donec ultrices tincidunt arcu. Tincidunt
              tortor aliquam nulla facilisi cras fermentum odio eu.
            </motion.p>
          </motion.div>

          {/* Right Section */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-9"
          >
            {/* Services List */}
            <motion.div variants={itemVariants} className="space-y-8">
              <h4 className="font-bold text-white text-[22px] capitalize">
                Our Services:
              </h4>
              <ul className="text-white-gray space-y-4">
                {[
                  "learning",
                  "parent control",
                  "Management",
                  "master teachers",
                ].map((service, idx) => (
                  <motion.li
                    key={idx}
                    variants={itemVariants}
                    className="text-[17px] font-sora capitalize"
                  >
                    {service}
                  </motion.li>
                ))}
                <motion.li
                  variants={itemVariants}
                  className="text-[17px] font-sora capitalize"
                >
                  <span className="uppercase font-sora text-main text-xl">
                    ELMULIM
                  </span>{" "}
                  news
                </motion.li>
              </ul>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants} className="space-y-8">
              <h4 className="font-bold text-white text-[22px] capitalize">
                Quick Links:
              </h4>
              <ul className="text-white-gray space-y-4">
                {quickLinks.map((link, idx) => (
                  <motion.li
                    key={idx}
                    variants={itemVariants}
                    className="text-[17px] font-sora hover:text-main capitalize transition-colors duration-200"
                  >
                    <Link to={link.path}>{link.name}</Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Copyright Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="font-normal bg-[#1F2C3B] text-center py-3 text-white font-sora capitalize text-[17px]"
      >
        &copy; {new Date().getFullYear()}{" "}
        <span className="text-main font-exo font-black">Elmullim</span> || All
        Rights Reserved
      </motion.div>
    </footer>
  );
};

export default Footer;
