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

  const contactItems = [
    {
      icon: "/icons/phone-icon.svg",
      alt: text.phone,
      value: import.meta.env.VITE_CONTACT_PHONE,
    },
    {
      icon: "/icons/email-icon.svg",
      alt: text.email,
      value: import.meta.env.VITE_CONTACT_EMAIL,
    },
    {
      icon: "/icons/address-icon.svg",
      alt: text.address,
      value: import.meta.env.VITE_CONTACT_ADDRESS,
    },
  ].filter((item) => item.value?.trim());

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
        className="container relative z-50 lg:px-4 xl:px-8 2xl:px-12"
      >
        <div className="relative z-50 px-2 pt-1 sm:px-4 md:pt-0 md:space-y-2">
          {contactItems.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={navItemsVariants}
              className="hidden md:flex md:pt-2 gap-4 lg:gap-6 mx-auto w-fit max-w-full flex-wrap justify-center"
            >
              {contactItems.map((item) => (
                <motion.div
                  key={item.alt}
                  variants={navItemsVariants}
                  className="flex items-center gap-2 min-w-0 max-w-full"
                >
                  <img src={item.icon} alt={item.alt} className="h-5 w-5 shrink-0" />
                  <p className="text-[15px] break-all">{item.value}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="relative z-50 rounded-lg bg-white shadow-[0px_0px_50px_0px_hsla(210,67%,16%,0.1)] overflow-visible">
            <Navbar />
          </div>
        </div>
      </motion.header>
    </div>
  );
};

export default Header;
