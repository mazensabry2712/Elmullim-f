import { navItemsVariants } from "@/animations";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const Header = () => {
  const path = useLocation().pathname;
  return (
    <div
      className={`${
        path === "/"
          ? "bg-[#F2F2F2] text-black-blue"
          : "bg-[#21374B] text-white"
      }`}
    >
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container lg:px-20 2xl:px-32"
      >
        <div className="px-6 relative z-10 pt-1 md:pt-0 md:space-y-2">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={navItemsVariants}
            className="hidden md:flex md:pt-2 gap-6 mx-auto w-fit"
          >
            <motion.div
              variants={navItemsVariants}
              className="flex items-center gap-2"
            >
              <img
                src="/icons/phone-icon.svg"
                alt="phone"
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
                alt="email"
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
                alt="address"
                className="h-5 w-5"
              />
              <p className="text-[15px]">Hudson, Wisconsin(WI), 54016</p>
            </motion.div>
          </motion.div>
          <div className="bg-white rounded-lg shadow-[0px_0px_50px_0px_hsla(210,67%,16%,0.1)]">
            <Navbar />
          </div>
        </div>
      </motion.header>
    </div>
  );
};

export default Header;
