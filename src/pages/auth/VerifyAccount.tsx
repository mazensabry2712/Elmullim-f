import AuthHeader from "@/components/auth/AuthHeader";
import PageTitle from "@/components/PageTitle";
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
import { useI18n } from "@/i18n";
import { getAuthCopy } from "@/i18n/authCopy";

const VerifyAccount = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = cookieService.getToken()!;
  const { mutateAsync: checkAuth } = useCheckAuth();
  const { language } = useI18n();
  const copy = getAuthCopy(language);

  useEffect(() => {
    (async () => {
      try {
        const { data, message, status } = await checkAuth(token);
        if (!status) {
          toast.error(message);
          return;
        }
        const { auth } = data;
        if (!auth) {
          dispatch(logout());
          if (location.pathname !== "/") {
            navigate("/login");
            toast.warn(copy.pleaseLogin);
          }
          return;
        }
        if (data["email-verified"]) navigate("/", { replace: true });
      } catch {
        dispatch(logout());
        navigate("/login", { replace: true });
      }
    })();
  }, [token, checkAuth, navigate, dispatch, location, copy.pleaseLogin]);

  return (
    <main>
      <PageTitle />
      <AuthHeader
        title="verification"
        description={copy.verificationCode}
        discover={false}
        showLogoutButton={false}
      />
      <motion.section variants={containerVariants} initial="hidden" animate="visible" className="bg-white py-10 md:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between container">
          <VerifyAccountForm />
          <motion.div initial={{ opacity: 0, x: 40 }} transition={{ duration: 0.5, ease: "linear" }} animate={{ opacity: 1, x: 0 }} className="lg:w-1/2 order-1 lg:order-2 flex items-center justify-center xl:p-10">
            <div className="text-center"><img src="/images/verify-account.webp" alt={copy.verificationCode} className="w-full h-72 lg:h-full mx-auto" /></div>
          </motion.div>
        </div>
      </motion.section>
      <SignFooter />
    </main>
  );
};

export default VerifyAccount;
