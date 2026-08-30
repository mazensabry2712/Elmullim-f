import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  menuIconVariants,
  navVariants,
  logoVariants,
  navItemsVariants,
} from "@/animations";
import { AlignJustify, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ProfileDropdownMenu from "./profiles/ProfileMenu";

const links = [
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
    name: "Courses",
    path: "/courses",
  },
  {
    name: "Lessons",
    path: "/lessons",
  },
  {
    name: "Contact Us",
    path: "/contact-us",
  },
  {
    name: "FAQs",
    path: "/faqs",
  },
];
const Navbar = () => {
  const [openNav, setOpenNav] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 1024 && setOpenNav(false)
    );
  }, []);
  const path = useLocation().pathname;
  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navItemsVariants}
      className={`flex justify-between w-full flex-wrap items-center py-2`}
    >
      <div className="flex items-center justify-between w-full pr-3">
        {/* Logo */}
        <motion.div variants={logoVariants}>
          <Link to={"/"} className="flex items-center">
            <motion.img
              src={"/images/logo.webp"}
              alt="logo"
              variants={logoVariants}
              initial="hidden"
              animate="visible"
              className="w-14 h-14 cursor-pointer"
            />
            <h3 className="font-bold text-black-blue text-lg md:text-2xl font-epilogue">
              Elm<span className="text-main">ullim</span>
            </h3>
          </Link>
        </motion.div>

        {/* Links */}
        <motion.ul
          className="hidden lg:flex w-full gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {links.map((link) => (
            <motion.li
              key={link.name}
              variants={navItemsVariants}
              className="flex items-center justify-center"
            >
              <NavLink
                to={link.path}
                className={`font-semibold text-[17px] ${
                  path === link.path
                    ? "text-main"
                    : "text-black-blue hover:text-main transition-all duration-200"
                }`}
              >
                {link.name}
              </NavLink>
            </motion.li>
          ))}
        </motion.ul>

        {/* Right */}

        {/* User Profile Icon */}
        <motion.div className="flex items-center gap-3">
          {isAuthenticated ? (
            <motion.div variants={navItemsVariants}>
              <ProfileDropdownMenu />
            </motion.div>
          ) : (
            <motion.button
              variants={navItemsVariants}
              className="bg-main text-white font-sora font-medium rounded-[5px] shadow transition-all duration-300 hover:bg-main/90 hover:shadow-md"
            >
              <Link
                to={"/login"}
                className="px-3 sm:px-6 py-2 flex justify-center items-center gap-2"
              >
                Login
                <i className="fi fi-sr-user text-lg flex justify-center items-center" />
              </Link>
            </motion.button>
          )}
          {/* Toggle Menu */}
          <motion.button
            aria-label="Toggle Menu"
            variants={navItemsVariants}
            className="flex justify-center items-center lg:hidden text-black-blue"
            onClick={() => setOpenNav(!openNav)}
          >
            <AnimatePresence mode="wait">
              {openNav ? (
                <motion.span
                  key="close-icon"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={menuIconVariants}
                >
                  <X size={44} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu-icon"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={menuIconVariants}
                >
                  <AlignJustify size={44} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {openNav && (
          <motion.div
            key="mobile-nav"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={navVariants}
            className="w-full overflow-hidden py-3"
          >
            <motion.div
              variants={navItemsVariants}
              className="w-full mx-auto max-h-[80vh]  px-3 py-2"
            >
              <motion.ul
                className="w-full flex flex-col gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {links.map((link) => (
                  <motion.li
                    key={link.name}
                    variants={navItemsVariants}
                    className="flex items-center justify-center w-full"
                  >
                    <NavLink
                      to={link.path}
                      className={`w-full font-semibold text-[17px] hover:bg-white-gray py-2 px-4 rounded-md transition-all duration-200 ${
                        path === link.path
                          ? "text-main"
                          : "text-black-blue hover:text-main"
                      }`}
                      onClick={() => setOpenNav(false)}
                    >
                      {link.name}
                    </NavLink>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
