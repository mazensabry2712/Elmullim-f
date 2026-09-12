import { navItemsVariants } from "@/animations";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/i18n";

const Header = () => {
  const path = useLocation().pathname;
  const { language } = useI18n();

  const text = {
    phone: language === "ar" ? "هاتف" : "Phone",
    email: language === "ar" ? "البريد الإلكتروني" : "Email",
    address: language === "ar" ? "العنوان" : "Address",
  };

  return (
    <div
      className={`relative z-50 ${
        path === "/"
          ? "bg-[#F2F2F2] text-black-blue"
          : "bg-[#21374B] text-white"
      }`}
    >
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container relative z-50 lg:px-20 2xl:px-32"
      >
        <div className="relative z-50 px-2 pt-1 sm:px-4 md:pt-0 md:space-y-2">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={navItemsVariants}
            className="hidden md:flex md:pt-2 gap-4 lg:gap-6 mx-auto w-fit max-w-full flex-wrap justify-center"
          >
            <motion.div
              variants={navItemsVariants}
              className="flex items-center gap-2"
            >
              <img
                src="/icons/phone-icon.svg"
                alt={text.phone}
                className="h-5 w-5"
              />
              <p className="text-[15px]">(966) 55-675-4697</p>
            </motion.div>
            <motion.div
              variants={navItemsVariants}
              className="flex items-center gap-2"
            >
              <img
                src="/icons/email-icon.svg"
                alt={text.email}
                className="h-5 w-5"
              />
              <p className="text-[15px]">test@gmail.com</p>
            </motion.div>
            <motion.div
              variants={navItemsVariants}
              className="flex items-center gap-2"
            >
              <img
                src="/icons/address-icon.svg"
                alt={text.address}
                className="h-5 w-5"
              />
              <p className="text-[15px]">Hudson, Wisconsin(WI), 54016</p>
            </motion.div>
          </motion.div>
          <div className="relative z-50 rounded-lg bg-white shadow-[0px_0px_50px_0px_hsla(210,67%,16%,0.1)] overflow-visible">
            <Navbar />
          </div>
        </div>
      </motion.header>
    </div>
  );
};

export default Header;
