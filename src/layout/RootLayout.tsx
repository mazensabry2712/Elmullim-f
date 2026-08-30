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
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";

const RootLayout = () => {
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
      if (!auth) return dispatch(logout());

      // * Account not verified
      if (auth && !data["email-verified"]) {
        toast.warn("Please verify your account");
        return navigate("/verify-account");
      }
    })();
  }, [token, checkAuth, navigate, dispatch, location]);

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
