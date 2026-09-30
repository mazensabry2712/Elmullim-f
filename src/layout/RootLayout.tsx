import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageTitle from "@/components/PageTitle";
import { useCheckAuth } from "@/lib/react-query/auth";
import { logout, syncSession } from "@/store/features/auth/authSlice";
import { useAppDispatch } from "@/store/store";
import cookieService from "@/utils/cookieService";
import { useEffect } from "react";
import {
  Outlet,
  ScrollRestoration,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";

const isUnauthorizedError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;

  return (
    (error as { response?: { status?: number } }).response?.status === 401
  );
};

const RootLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = cookieService.getToken();
  const { mutateAsync: checkAuth } = useCheckAuth();

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    let validating = false;

    const validateAuthentication = async () => {
      if (cancelled || validating || cookieService.getToken() !== token) return;

      validating = true;

      try {
        const { data, message, status } = await checkAuth(token);

        if (cancelled || cookieService.getToken() !== token) return;

        if (!status || !data?.auth) {
          dispatch(logout());
          if (message) toast.error(message);
          navigate("/login", { replace: true });
          return;
        }

        dispatch(syncSession({ role: data.role }));

        if (!data["email-verified"]) {
          toast.warn("Please verify your account");
          navigate("/verify-account");
        }
      } catch (error) {
        if (cancelled) return;

        if (isUnauthorizedError(error)) {
          if (cookieService.getToken() === token) {
            dispatch(logout());
          }

          navigate("/login", { replace: true });
        }
      } finally {
        validating = false;
      }
    };

    void validateAuthentication();

    const handleFocus = () => {
      if (document.visibilityState === "visible") {
        void validateAuthentication();
      }
    };

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void validateAuthentication();
      }
    }, 5000);

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [token, checkAuth, navigate, dispatch]);

  return (
    <>
      <PageTitle />
      <ScrollRestoration />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default RootLayout;
