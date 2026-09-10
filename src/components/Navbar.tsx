import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  menuIconVariants,
  navVariants,
  logoVariants,
  navItemsVariants,
} from "@/animations";
import { AlignJustify, ChevronDown, Languages, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ProfileDropdownMenu from "./profiles/ProfileMenu";
import { useI18n } from "@/i18n";

const links = [
  { key: "home", path: "/" },
  { key: "about", path: "/about" },
  { key: "services", path: "/services" },
  { key: "courses", path: "/courses" },
  { key: "lessons", path: "/lessons" },
  { key: "contactUs", path: "/contact-us" },
  { key: "faqs", path: "/faqs" },
] as const;

const loginLinks = [
  { key: "studentLogin", path: "/sign-in" },
  { key: "parentLogin", path: "/parent/sign-in" },
  { key: "teacherLogin", path: "/teacher/sign-in" },
] as const;

const Navbar = () => {
  const [openNav, setOpenNav] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const path = useLocation().pathname;
  const { language, t, toggleLanguage } = useI18n();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setOpenNav(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const switchLanguage = () => {
    toggleLanguage();
    setOpenNav(false);
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navItemsVariants}
      className="flex justify-between w-full flex-wrap items-center py-2"
    >
      <div className="flex items-center justify-between w-full px-3">
        <motion.div variants={logoVariants}>
          <Link to="/" className="flex items-center">
            <motion.img
              src="/images/logo.webp"
              alt="Elmullim"
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

        <motion.ul
          className="hidden lg:flex w-full gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {links.map((link) => (
            <motion.li
              key={link.key}
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
                {t(`nav.${link.key}`)}
              </NavLink>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div className="flex items-center gap-2 relative">
          <motion.button
            type="button"
            variants={navItemsVariants}
            onClick={switchLanguage}
            aria-label={
              language === "en" ? t("language.arabic") : t("language.english")
            }
            className="inline-flex items-center gap-1.5 rounded-md border border-black-blue/10 px-2.5 py-2 text-sm font-semibold text-black-blue hover:border-main hover:text-main transition-colors"
          >
            <Languages size={17} aria-hidden="true" />
            <span>{language === "en" ? t("language.arabic") : t("language.english")}</span>
          </motion.button>

          {isAuthenticated ? (
            <motion.div variants={navItemsVariants}>
              <ProfileDropdownMenu />
            </motion.div>
          ) : (
            <motion.div className="relative" variants={navItemsVariants}>
              <motion.button
                type="button"
                aria-expanded={openLogin}
                aria-haspopup="menu"
                onClick={() => setOpenLogin((value) => !value)}
                className="bg-main text-white font-sora font-medium rounded-[5px] shadow transition-all duration-300 hover:bg-main/90 hover:shadow-md px-3 sm:px-5 py-2 flex justify-center items-center gap-2"
              >
                {t("nav.login")}
                <ChevronDown
                  size={18}
                  className={`transition-transform ${openLogin ? "rotate-180" : ""}`}
                />
              </motion.button>

              <AnimatePresence>
                {openLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 top-full mt-2 z-50 min-w-40 rounded-lg bg-white p-2 shadow-xl border border-black/5"
                    role="menu"
                  >
                    {loginLinks.map((loginLink) => (
                      <Link
                        key={loginLink.key}
                        to={loginLink.path}
                        role="menuitem"
                        onClick={() => setOpenLogin(false)}
                        className="block rounded-md px-4 py-2 text-sm font-semibold text-black-blue hover:bg-white-gray hover:text-main"
                      >
                        {t(`nav.${loginLink.key}`)}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          <motion.button
            aria-label={t("nav.toggleMenu")}
            aria-expanded={openNav}
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
            <motion.div variants={navItemsVariants} className="w-full mx-auto max-h-[80vh] px-3 py-2">
              <motion.ul className="w-full flex flex-col gap-1">
                {links.map((link) => (
                  <motion.li
                    key={link.key}
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
                      {t(`nav.${link.key}`)}
                    </NavLink>
                  </motion.li>
                ))}

                <motion.li variants={navItemsVariants} className="pt-2">
                  <button
                    type="button"
                    onClick={switchLanguage}
                    className="w-full rounded-md border border-main/20 px-4 py-2 text-sm font-semibold text-black-blue hover:text-main"
                  >
                    {language === "en" ? t("language.arabic") : t("language.english")}
                  </button>
                </motion.li>

                {!isAuthenticated && (
                  <motion.li variants={navItemsVariants} className="pt-3">
                    <div className="rounded-lg border border-main/20 bg-white-gray p-2">
                      <p className="px-2 pb-2 text-sm font-semibold text-black-blue">{t("nav.signInAs")}</p>
                      <div className="grid grid-cols-1 gap-1">
                        {loginLinks.map((loginLink) => (
                          <Link
                            key={loginLink.key}
                            to={loginLink.path}
                            onClick={() => setOpenNav(false)}
                            className="rounded-md px-3 py-2 text-sm font-semibold text-black-blue hover:bg-white hover:text-main"
                          >
                            {t(`nav.${loginLink.key}`)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.li>
                )}
              </motion.ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
