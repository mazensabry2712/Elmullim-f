import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useCheckAuth } from "@/lib/react-query/auth";
import { logout } from "@/store/features/auth/authSlice";
import { useAppDispatch } from "@/store/store";
import cookieService from "@/utils/cookieService";
import { useEffect } from "react";
import {
  Outlet,
  ScrollRestoration,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";

const RootLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = cookieService.getToken();
  const { mutateAsync: checkAuth } = useCheckAuth();

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const validateAuthentication = async () => {
      try {
        const { data, message, status } = await checkAuth(token);
        if (cancelled) return;

        if (!status) {
          toast.error(message);
          return;
        }

        const { auth } = data;

        if (!auth) {
          dispatch(logout());
          return;
        }

        if (!data["email-verified"]) {
          toast.warn("Please verify your account");
          navigate("/verify-account");
        }
      } catch {
        if (!cancelled) {
          toast.error("Unable to verify your session. Please try again later.");
        }
      }
    };

    void validateAuthentication();

    return () => {
      cancelled = true;
    };
  }, [token, checkAuth, navigate, dispatch]);

  return (
    <>
      <ScrollRestoration />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default RootLayout;
