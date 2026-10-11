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

const DESKTOP_NAV_BREAKPOINT = 1280;

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
  const isArabic = language === "ar";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= DESKTOP_NAV_BREAKPOINT) {
        setOpenNav(false);
        setOpenLogin(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setOpenLogin(false);
    setOpenNav(false);
  }, [path]);

  useEffect(() => {
    if (!openNav) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenNav(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openNav]);

  const switchLanguage = () => {
    toggleLanguage();
    setOpenNav(false);
    setOpenLogin(false);
  };

  const isLinkActive = (linkPath: string) =>
    linkPath === "/"
      ? path === "/"
      : path === linkPath || path.startsWith(`${linkPath}/`);

  const renderNavigationLink = (link: (typeof links)[number], mobile = false) => {
    const active = isLinkActive(link.path);

    return (
      <motion.li
        key={link.key}
        variants={navItemsVariants}
        className={mobile ? "flex min-w-0 w-full" : "flex min-w-0 items-center"}
      >
        <NavLink
          to={link.path}
          aria-current={active ? "page" : undefined}
          onClick={mobile ? () => setOpenNav(false) : undefined}
          className={
            mobile
              ? `w-full rounded-lg px-3 py-3 text-start text-[15px] font-semibold transition-colors sm:px-4 sm:py-3.5 sm:text-base ${active ? "bg-main/10 text-main" : "text-black-blue hover:bg-white-gray hover:text-main"}`
              : `whitespace-nowrap rounded-lg px-1.5 py-2 text-center text-[13px] font-semibold transition-colors xl:px-2 xl:text-sm ${active ? "bg-main/5 text-main" : "text-black-blue hover:bg-white-gray hover:text-main"}`
          }
        >
          {t(`nav.${link.key}`)}
        </NavLink>
      </motion.li>
    );
  };

  return (
    <motion.nav
      aria-label={isArabic ? "القائمة الرئيسية" : "Main navigation"}
      initial="hidden"
      animate="visible"
      variants={navItemsVariants}
      className="relative z-40 flex w-full flex-col py-2"
    >
      <div className="mx-auto flex min-h-12 w-full max-w-[1600px] min-w-0 items-center justify-between gap-2 px-3 sm:min-h-14 sm:gap-3 sm:px-4 md:px-6 2xl:gap-4 2xl:px-8">
        <motion.div variants={logoVariants} className="min-w-0 shrink-0">
          <Link
            to="/"
            aria-label={isArabic ? "العودة إلى الرئيسية" : "Go to homepage"}
            className="flex min-w-0 items-center gap-1.5 sm:gap-2"
          >
            <motion.img
              src="/images/logo.webp"
              alt="Elmullim"
              variants={logoVariants}
              initial="hidden"
              animate="visible"
              className="h-9 w-9 shrink-0 cursor-pointer object-contain sm:h-12 sm:w-12 2xl:h-14 2xl:w-14"
            />
            <span className="whitespace-nowrap font-epilogue text-[19px] font-extrabold leading-none tracking-[-0.045em] text-black-blue sm:text-[22px] 2xl:text-2xl">
              Elm<span className="text-main">ullim</span>
            </span>
          </Link>
        </motion.div>

        <motion.ul
          className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex xl:gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {links.map((link) => renderNavigationLink(link))}
        </motion.ul>

        <motion.div
          className="relative flex shrink-0 items-center gap-1.5 sm:gap-2"
          variants={navItemsVariants}
        >
          <div className="hidden items-center gap-2 xl:flex">
            <motion.button
              type="button"
              onClick={switchLanguage}
              aria-label={isArabic ? t("language.english") : t("language.arabic")}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-black-blue/10 px-2.5 py-2 text-sm font-semibold text-black-blue transition-colors hover:border-main hover:text-main xl:px-3"
            >
              <Languages size={17} aria-hidden="true" />
              <span>{isArabic ? t("language.english") : t("language.arabic")}</span>
            </motion.button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/notifications"
                  aria-label={isArabic ? "الإشعارات" : "Notifications"}
                  className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-black-blue transition-colors hover:bg-white-gray hover:text-main"
                >
                  <Bell size={19} aria-hidden="true" />
                  {(notifications.data?.data?.unread_count ?? 0) > 0 && (
                    <span className="absolute -end-0.5 -top-0.5 min-w-5 rounded-full bg-main px-1 text-center text-[10px] font-bold leading-5 text-white">
                      {Math.min(notifications.data?.data?.unread_count ?? 0, 99)}
                    </span>
                  )}
                </Link>
                <motion.div className="shrink-0">
                  <ProfileDropdownMenu />
                </motion.div>
              </>
            ) : (
              <motion.div className="relative">
                <motion.button
                  type="button"
                  aria-expanded={openLogin}
                  aria-haspopup="menu"
                  onClick={() => setOpenLogin((value) => !value)}
                  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-main px-3 py-2 font-sora text-sm font-semibold text-white shadow-sm transition-colors hover:bg-main/90 xl:px-4"
                >
                  <span>{t("nav.login")}</span>
                  <ChevronDown
                    size={17}
                    aria-hidden="true"
                    className={`transition-transform ${openLogin ? "rotate-180" : ""}`}
                  />
                </motion.button>

                <AnimatePresence>
                  {openLogin && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute end-0 top-full z-50 mt-2 min-w-48 rounded-xl border border-black/5 bg-white p-2 shadow-xl"
                      role="menu"
                    >
                      {loginLinks.map((loginLink) => (
                        <Link
                          key={loginLink.key}
                          to={loginLink.path}
                          role="menuitem"
                          onClick={() => setOpenLogin(false)}
                          className="block rounded-lg px-3 py-2.5 text-start text-sm font-semibold text-black-blue transition-colors hover:bg-white-gray hover:text-main"
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
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black-blue/10 text-black-blue transition-colors hover:border-main hover:bg-white-gray hover:text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 xl:hidden sm:h-11 sm:w-11"
            onClick={() => setOpenNav((value) => !value)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {openNav ? (
                <motion.span key="close-icon" initial="hidden" animate="visible" exit="hidden" variants={menuIconVariants}>
                  <X size={25} aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span key="menu-icon" initial="hidden" animate="visible" exit="hidden" variants={menuIconVariants}>
                  <AlignJustify size={25} aria-hidden="true" />
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
            className="w-full border-t border-black-blue/10 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 xl:hidden"
          >
            <motion.div
              variants={navItemsVariants}
              className="mx-auto w-full max-w-[1100px] rounded-2xl border border-black-blue/10 bg-white p-2 shadow-lg sm:p-3 md:p-4"
            >
              <motion.ul className="grid w-full grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2">
                {links.map((link) => renderNavigationLink(link, true))}

                <motion.li variants={navItemsVariants} className="flex min-w-0 w-full">
                  <button
                    type="button"
                    onClick={switchLanguage}
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-main/20 px-4 py-3 text-sm font-semibold text-black-blue transition-colors hover:border-main hover:text-main sm:min-h-full"
                  >
                    <Languages size={17} aria-hidden="true" />
                    <span>{isArabic ? t("language.english") : t("language.arabic")}</span>
                  </button>
                </motion.li>

                {isAuthenticated ? (
                  <motion.li variants={navItemsVariants} className="flex min-w-0 w-full sm:col-span-2">
                    <div className="flex w-full min-w-0 items-center gap-2 rounded-xl border border-main/15 bg-white-gray p-2">
                      <Link
                        to="/notifications"
                        aria-label={isArabic ? "الإشعارات" : "Notifications"}
                        onClick={() => setOpenNav(false)}
                        className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-black-blue transition-colors hover:bg-white hover:text-main"
                      >
                        <Bell size={17} aria-hidden="true" />
                        <span>{isArabic ? "الإشعارات" : "Notifications"}</span>
                        {(notifications.data?.data?.unread_count ?? 0) > 0 && (
                          <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-main px-1.5 text-[10px] font-bold leading-5 text-white">
                            {Math.min(notifications.data?.data?.unread_count ?? 0, 99)}
                          </span>
                        )}
                      </Link>
                      <div className="min-w-0 shrink-0 rounded-lg bg-white">
                        <ProfileDropdownMenu />
                      </div>
                    </div>
                  </motion.li>
                ) : (
                  <motion.li variants={navItemsVariants} className="flex min-w-0 w-full sm:col-span-2">
                    <div className="w-full rounded-xl border border-main/15 bg-white-gray p-2.5 sm:p-3">
                      <p className="px-2 pb-2 text-start text-sm font-semibold text-black-blue">
                        {t("nav.signInAs")}
                      </p>
                      <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-2">
                        {loginLinks.map((loginLink) => (
                          <Link
                            key={loginLink.key}
                            to={loginLink.path}
                            onClick={() => setOpenNav(false)}
                            className="flex min-h-10 min-w-0 items-center justify-center rounded-lg px-3 py-2 text-center text-sm font-semibold text-black-blue transition-colors hover:bg-white hover:text-main"
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
