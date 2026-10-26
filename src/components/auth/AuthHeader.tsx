import { logoVariants, navItemsVariants } from "@/animations";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LogoutAuthButton from "./LogoutAuthButton";
import { useI18n } from "@/i18n";
import { getAuthCopy } from "@/i18n/authCopy";

interface IProps {
  title: string;
  linkPath?: string;
  linkTitle?: string;
  description: string | ReactNode;
  discover?: boolean;
  showLogoutButton?: boolean;
}

const AuthHeader = ({
  title,
  linkPath,
  linkTitle,
  description,
  discover = true,
  showLogoutButton = true,
}: IProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { language } = useI18n();
  const copy = getAuthCopy(language);
  const titleMap: Record<string, string> = {
    login: copy.login,
    "parent login": copy.parentLogin,
    "teacher login": copy.teacherLogin,
    verification: copy.verification,
    "Choose Sign in": copy.chooseSignIn,
  };
  const linkMap: Record<string, string> = {
    "sign up": copy.signUp,
    Login: copy.login,
  };

  return (
    <div className="bg-black-blue bg-[url('/images/header-auth-bg.svg')] bg-cover bg-center lg:bg-right-top bg-no-repeat pt-3 sm:pt-4">
      <motion.header className="container px-2 sm:px-4">
        <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="flex min-w-0 w-full items-center justify-between gap-2 px-2 py-1.5 sm:px-3 sm:py-2">
            <motion.div variants={logoVariants} className="min-w-0 shrink">
              <Link to="/" className="flex min-w-0 items-center gap-1.5 p-0.5 sm:gap-2">
                <motion.img src="/images/logo.webp" alt="Elmullim" variants={logoVariants} initial="hidden" animate="visible" className="h-11 w-11 shrink-0 cursor-pointer sm:h-14 sm:w-14" />
                <h3 className="truncate font-epilogue text-lg font-extrabold tracking-tight text-black-blue sm:text-xl lg:text-2xl">
                  Elm<span className="text-main">ullim</span>
                </h3>
              </Link>
            </motion.div>
            {discover && (
              <motion.div className="hidden h-14 items-center justify-center lg:flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <motion.h2 variants={navItemsVariants} className="flex h-full items-center justify-center bg-main px-5 capitalize font-semibold text-[16px] text-white xl:px-7 xl:text-[17px]">
                  {copy.discover}
                </motion.h2>
              </motion.div>
            )}
            <motion.div variants={navItemsVariants} className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              {isAuthenticated ? (
                showLogoutButton ? <LogoutAuthButton /> : null
              ) : (
                <Link to={linkPath || "/"} className="flex items-center justify-center gap-1.5 rounded-[5px] bg-main px-2.5 py-2 text-[13px] font-bold capitalize text-white shadow-sm transition-colors hover:bg-main/90 sm:px-4 sm:py-2.5 sm:text-[15px]">
                  <span className="max-w-[110px] truncate sm:max-w-none">{linkMap[linkTitle ?? ""] ?? linkTitle}</span>
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              )}
            </motion.div>
          </div>
        </motion.nav>
        <motion.div className="space-y-3 px-2 py-20 sm:py-28 lg:py-36" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-center text-3xl font-bold uppercase leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">{titleMap[title] ?? title}</h1>
          <p className="mx-auto max-w-3xl text-center font-sora text-sm font-light capitalize leading-relaxed text-white sm:text-base">{description}</p>
        </motion.div>
      </motion.header>
    </div>
  );
};

export default AuthHeader;
