import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  menuIconVariants,
  navVariants,
  logoVariants,
  navItemsVariants,
} from "@/animations";
import { AlignJustify, Bell, ChevronDown, Languages, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ProfileDropdownMenu from "./profiles/ProfileMenu";
import { useI18n } from "@/i18n";
import cookieService from "@/utils/cookieService";
import { useGetNotifications } from "@/lib/react-query/notifications";

const links = [
  { key: "home", path: "/" },
  { key: "about", path: "/about" },
  { key: "services", path: "/services" },
  { key: "courses", path: "/courses" },
  { key: "lessons", path: "/lessons" },
  { key: "forTeachers", path: "/teachers" },
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
  const token = cookieService.getToken() || "";
  const notifications = useGetNotifications({ token, enabled: isAuthenticated && !!token });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setOpenNav(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setOpenLogin(false);
  }, [path]);

  const switchLanguage = () => {
    toggleLanguage();
    setOpenNav(false);
    setOpenLogin(false);
  };

  const getLinkPath = (link: (typeof links)[number]) => link.path;

  const isLinkActive = (linkPath: string) =>
    linkPath === "/"
      ? path === "/"
      : path === linkPath || path.startsWith(`${linkPath}/`);

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navItemsVariants}
      className="flex w-full flex-wrap items-center justify-between py-2"
    >
      <div className="flex w-full min-w-0 items-center justify-between px-2 sm:px-3">
        <motion.div variants={logoVariants} className="min-w-0 shrink">
          <Link to="/" className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <motion.img
              src="/images/logo.webp"
              alt="Elmullim"
              variants={logoVariants}
              initial="hidden"
              animate="visible"
              className="h-12 w-12 shrink-0 cursor-pointer sm:h-14 sm:w-14"
            />
            <span className="whitespace-nowrap font-epilogue text-[21px] font-extrabold leading-none tracking-[-0.035em] text-black-blue sm:text-2xl lg:text-[23px] xl:text-[25px]">
              Elm<span className="text-main">ullim</span>
            </span>
          </Link>
        </motion.div>

        <motion.ul
          className="hidden w-full justify-center gap-4 lg:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {links.map((link) => {
            const linkPath = getLinkPath(link);
            const active = isLinkActive(linkPath);

            return (
              <motion.li key={link.key} variants={navItemsVariants} className="flex items-center justify-center">
                <NavLink
                  to={linkPath}
                  aria-current={active ? "page" : undefined}
                  className={`font-semibold text-[17px] ${active ? "text-main" : "text-black-blue hover:text-main transition-all duration-200"}`}
                >
                  {t(`nav.${link.key}`)}
                </NavLink>
              </motion.li>
            );
          })}
        </motion.ul>

        <motion.div className="relative flex shrink-0 items-center gap-2" variants={navItemsVariants}>
          <div className="hidden items-center gap-2 lg:flex">
            <motion.button
              type="button"
              onClick={switchLanguage}
              aria-label={language === "en" ? t("language.arabic") : t("language.english")}
              className="inline-flex items-center gap-1.5 rounded-md border border-black-blue/10 px-2.5 py-2 text-sm font-semibold text-black-blue transition-colors hover:border-main hover:text-main"
            >
              <Languages size={17} aria-hidden="true" />
              <span>{language === "en" ? t("language.arabic") : t("language.english")}</span>
            </motion.button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/notifications"
                  aria-label={language === "ar" ? "الإشعارات" : "Notifications"}
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-black-blue transition-colors hover:bg-white-gray hover:text-main"
                >
                  <Bell size={19} />
                  {(notifications.data?.data?.unread_count ?? 0) > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 min-w-5 rounded-full bg-main px-1 text-center text-[10px] font-bold leading-5 text-white">
                      {Math.min(notifications.data?.data?.unread_count ?? 0, 99)}
                    </span>
                  )}
                </Link>
                <motion.div><ProfileDropdownMenu /></motion.div>
              </>
            ) : (
              <motion.div className="relative">
                <motion.button
                  type="button"
                  aria-expanded={openLogin}
                  aria-haspopup="menu"
                  onClick={() => setOpenLogin((value) => !value)}
                  className="flex items-center justify-center gap-2 rounded-[5px] bg-main px-3 py-2 font-sora font-medium text-white shadow transition-all duration-300 hover:bg-main/90 hover:shadow-md sm:px-5"
                >
                  {t("nav.login")}
                  <ChevronDown size={18} className={`transition-transform ${openLogin ? "rotate-180" : ""}`} />
                </motion.button>

                <AnimatePresence>
                  {openLogin && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute right-0 top-full z-50 mt-2 min-w-40 rounded-lg border border-black/5 bg-white p-2 shadow-xl"
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
          </div>

          <motion.button
            type="button"
            aria-label={t("nav.toggleMenu")}
            aria-expanded={openNav}
            aria-controls="mobile-navigation"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-black-blue transition-colors hover:bg-white-gray lg:hidden"
            onClick={() => setOpenNav((value) => !value)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {openNav ? (
                <motion.span key="close-icon" initial="hidden" animate="visible" exit="hidden" variants={menuIconVariants}>
                  <X size={34} aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span key="menu-icon" initial="hidden" animate="visible" exit="hidden" variants={menuIconVariants}>
                  <AlignJustify size={34} aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {openNav && (
          <motion.div
            id="mobile-navigation"
            key="mobile-nav"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={navVariants}
            className="w-full overflow-hidden px-2 sm:px-3"
          >
            <motion.div variants={navItemsVariants} className="mx-auto w-full max-w-xl py-2">
              <motion.ul className="flex w-full flex-col gap-1">
                {links.map((link) => {
                  const linkPath = getLinkPath(link);
                  const active = isLinkActive(linkPath);

                  return (
                    <motion.li key={link.key} variants={navItemsVariants} className="flex w-full items-center justify-center">
                      <NavLink
                        to={linkPath}
                        aria-current={active ? "page" : undefined}
                        className={`w-full rounded-md px-3 py-2.5 font-semibold text-[16px] transition-all duration-200 sm:px-4 sm:text-[17px] ${active ? "bg-main/10 text-main" : "text-black-blue hover:bg-white-gray hover:text-main"}`}
                        onClick={() => setOpenNav(false)}
                      >
                        {t(`nav.${link.key}`)}
                      </NavLink>
                    </motion.li>
                  );
                })}

                <motion.li variants={navItemsVariants} className="pt-2">
                  <button type="button" onClick={switchLanguage} className="flex w-full items-center justify-center gap-2 rounded-md border border-main/20 px-4 py-2.5 text-sm font-semibold text-black-blue hover:text-main">
                    <Languages size={17} aria-hidden="true" />
                    {language === "en" ? t("language.arabic") : t("language.english")}
                  </button>
                </motion.li>

                {isAuthenticated && (
                  <motion.li variants={navItemsVariants} className="pt-3">
                    <div className="flex items-center justify-center gap-2 rounded-lg border border-main/20 bg-white-gray p-2">
                      <Link
                        to="/notifications"
                        onClick={() => setOpenNav(false)}
                        className="inline-flex flex-1 items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-black-blue hover:bg-white hover:text-main"
                      >
                        <Bell size={17} className="mr-2" aria-hidden="true" />
                        {language === "ar" ? "الإشعارات" : "Notifications"}
                      </Link>
                      <div className="shrink-0 rounded-md bg-white">
                        <ProfileDropdownMenu />
                      </div>
                    </div>
                  </motion.li>
                )}

                {!isAuthenticated && (
                  <motion.li variants={navItemsVariants} className="pt-3">
                    <div className="rounded-lg border border-main/20 bg-white-gray p-2">
                      <p className="px-2 pb-2 text-sm font-semibold text-black-blue">{t("nav.signInAs")}</p>
                      <div className="grid grid-cols-1 gap-1">
                        {loginLinks.map((loginLink) => (
                          <Link key={loginLink.key} to={loginLink.path} onClick={() => setOpenNav(false)} className="rounded-md px-3 py-2 text-sm font-semibold text-black-blue hover:bg-white hover:text-main">
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
