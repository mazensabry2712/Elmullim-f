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
        className="container relative z-50 lg:px-4 xl:px-8 2xl:px-12"
      >
        <div className="relative z-50 px-2 pt-1 sm:px-4 md:pt-0 md:space-y-2">
,
                  alt: text.address,
                  value: import.meta.env.VITE_CONTACT_ADDRESS as string | undefined,
                },
              ]
                .filter((item) => item.value?.trim())
                .map((item) => (
                  <motion.div key={item.alt} variants={navItemsVariants} className="flex items-center gap-2">
                    <img src={item.icon} alt={item.alt} className="h-5 w-5" />
                    <p className="text-[15px] break-all">{item.value}</p>
                  </motion.div>
                ))}
            </motion.div>
          )}
