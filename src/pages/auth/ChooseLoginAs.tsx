import { containerVariants, itemVariants } from "@/animations";
import AuthHeader from "@/components/auth/AuthHeader";
import { faBookOpenReader } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ChooseLoginAs = () => {
  return (
    <>
      <AuthHeader
        title="Choose Sign in"
        linkTitle="Login"
        linkPath="/login"
        description={
          <>
            discover <span className="text-main">//</span> Sign in
          </>
        }
      />

      <section className="py-10 md:py-16 bg-white">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="md:px-16 space-y-4 md:space-y-12"
          >
            <motion.button
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="w-full bg-[#05CFBF] text-white font-sora font-light capitalize text-xl md:text-4xl rounded-[5px] shadow transition-all duration-300 hover:shadow-lg hover:bg-[#05CFBF]/90"
            >
              <Link
                to={"/sign-in"}
                className="w-full flex justify-center items-center gap-4 py-6 md:py-14"
              >
                <FontAwesomeIcon icon={faBookOpenReader} />
                Sign in as a student
              </Link>
            </motion.button>
            <motion.button
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="w-full bg-black-blue text-white font-sora font-light capitalize text-xl md:text-4xl rounded-[5px] shadow transition-all duration-300 hover:shadow-lg hover:bg-black-blue/90"
            >
              <Link
                to={"/teacher/sign-in"}
                className="w-full flex justify-center items-center gap-4 py-6 md:py-14"
              >
                <i className="fi fi-sr-workshop flex justify-center items-center" />
                Sign in as a teacher
              </Link>
            </motion.button>
            <motion.button
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="w-full bg-[#EEAA42] text-white font-sora font-light capitalize text-xl md:text-4xl rounded-[5px] shadow transition-all duration-300 hover:shadow-lg hover:bg-[#EEAA42]/90"
            >
              <Link
                to={"/parent/sign-in"}
                className="w-full flex justify-center items-center gap-4 py-6 md:py-14"
              >
                <i className="fi fi-ss-family flex justify-center items-center" />
                Sign in as a parent
              </Link>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ChooseLoginAs;
