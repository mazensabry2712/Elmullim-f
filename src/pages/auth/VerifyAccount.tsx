import AuthHeader from "@/components/auth/AuthHeader";
import SignFooter from "@/components/Newsletter";
import { useAppDispatch } from "@/store/store";
import { useLocation, useNavigate } from "react-router-dom";
import cookieService from "@/utils/cookieService";
import { useCheckAuth } from "@/lib/react-query/auth";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { logout } from "@/store/features/auth/authSlice";
import VerifyAccountForm from "@/components/forms/auth/VerifyAccountForm";
import { containerVariants } from "@/animations";
import { motion } from "framer-motion";

const VerifyAccount = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = cookieService.getToken()!;
  const { mutateAsync: checkAuth } = useCheckAuth();

  useEffect(() => {
    (async () => {
      const { data, message, status } = await checkAuth(token);
      const { auth } = data;

      if (!status) return toast.error(message);

      // * User not authenticated
      if (!auth) {
        dispatch(logout());
        if (location.pathname !== "/") {
          navigate("/login");
          toast.warn("Please login to continue");
        }
        return;
      }

      // * Account verified
      if (auth && data["email-verified"]) return navigate("/");
    })();
  }, [token, checkAuth, navigate, dispatch, location]);

  return (
    <main>
      <AuthHeader
        title="verification"
        description={"Verification Code"}
        discover={false}
      />
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white py-10 md:py-16"
      >
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between container">
          {/* Left Side*/}
          <VerifyAccountForm />
          {/* Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.5, ease: "linear" }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2 order-1 lg:order-2 flex items-center justify-center xl:p-10"
          >
            <div className="text-center">
              <img
                src="/images/verify-account.webp"
                alt="Parent login image"
                className="w-full h-72 lg:h-full mx-auto"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>
      <SignFooter />
    </main>
  );
};

export default VerifyAccount;
