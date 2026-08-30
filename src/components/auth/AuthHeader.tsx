import { logoVariants, navItemsVariants } from "@/animations";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LogoutAuthButton from "./LogoutAuthButton";

interface IProps {
  title: string;
  linkPath?: string;
  linkTitle?: string;
  description: string | ReactNode;
  discover?: boolean;
}
const AuthHeader = ({
  title,
  linkPath,
  linkTitle,
  description,
  discover = true,
}: IProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="bg-black-blue bg-[url('/images/header-auth-bg.svg')] bg-center lg:bg-right-top bg-no-repeat pt-4">
      <motion.header className="container">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex justify-between w-full flex-wrap items-center bg-white rounded-lg`}
        >
          <div className="flex items-center justify-between w-full pr-3">
            {/* Logo */}
            <motion.div variants={logoVariants}>
              <Link to={"/"} className="flex p-1">
                <motion.img
                  src={"/images/logo.webp"}
                  alt="logo"
                  variants={logoVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-14 h-14 cursor-pointer"
                />
                <h3 className="font-bold text-black-blue text-xl md:text-2xl font-epilogue flex justify-center items-center">
                  Elm<span className="text-main">ullim</span>
                </h3>
              </Link>
            </motion.div>

            {discover && (
              <motion.div
                className="hidden lg:flex h-full items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h2
                  variants={navItemsVariants}
                  className="flex items-center justify-center text-white bg-main px-2 h-16 capitalize font-semibold text-[17px]"
                >
                  discover
                </motion.h2>
              </motion.div>
            )}

            {/* Right */}
            <motion.div
              variants={navItemsVariants}
              className="flex items-center gap-2"
            >
              {isAuthenticated ? (
                <LogoutAuthButton />
              ) : (
                <button className="bg-main rounded-[5px]">
                  <Link
                    to={linkPath || ""}
                    className="text-[15px] flex justify-center items-center gap-2 text-white px-4 py-2.5 font-bold capitalize"
                  >
                    {linkTitle}
                    <ArrowRight size={18} />
                  </Link>
                </button>
              )}
            </motion.div>
          </div>
        </motion.nav>
        <motion.div
          className="py-36 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="uppercase text-white font-bold text-4xl md:text-6xl text-center">
            {title}
          </h1>
          <p className="text-white capitalize font-sora text-center font-light">
            {description}
          </p>
        </motion.div>
      </motion.header>
    </div>
  );
};

export default AuthHeader;
