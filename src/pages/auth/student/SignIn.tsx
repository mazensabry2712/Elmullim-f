import { containerVariants } from "@/animations";
import AuthHeader from "@/components/auth/AuthHeader";
import SignFooter from "@/components/Newsletter";
import StudentSignInForm from "@/components/forms/auth/student/StudentSignInForm";
import { motion } from "framer-motion";

const SignIn = () => {
  return (
    <>
      <AuthHeader
        title="login"
        linkTitle="sign up"
        linkPath="/sign-up"
        description={
          <>
            discover <span className="text-main">//</span> Login
          </>
        }
      />

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white py-20"
      >
        <div className="flex flex-col md:flex-row container">
          {/* Left Side*/}
          <StudentSignInForm />
          {/* Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.5, ease: "linear" }}
            animate={{ opacity: 1, x: 0 }}
            className="md:w-2/4 lg:w-1/2 order-1 md:order-2 bg-main flex items-center justify-center xl:p-20"
          >
            <div className="text-center">
              <img
                src="/images/grade.png"
                alt="Parent login image"
                className="w-full h-full mx-auto"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>
      <SignFooter />
    </>
  );
};

export default SignIn;
