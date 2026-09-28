import { logout } from "@/store/features/auth/authSlice";
import axios from "axios";
import { store } from "@/store/store";
import { toast } from "react-toastify";

const apiBaseUrl =
  import.meta.env.VITE_API ||
  (import.meta.env.DEV ? "http://Elmullim-b.test" : "https://api.elmullim.com");

const getLanguage = (): "en" | "ar" =>
  localStorage.getItem("elmullim-language") === "ar" ? "ar" : "en";

const MAINTENANCE_EVENT = "elmullim:maintenance";

const axiosAPI = axios.create({
  baseURL: `${apiBaseUrl.replace(/\/$/, "")}/api`,
  headers: {
    Accept: "application/json",
  },
});

axiosAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    const language = getLanguage();
    const response = error?.response;

    if (response?.status === 503 && response?.data?.maintenance === true) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(MAINTENANCE_EVENT, {
            detail: {
              enabled: true,
              message: response.data?.message,
            },
          })
        );
      }

      return Promise.reject(error);
    }

    if (response?.status === 401) {
      store.dispatch(logout());
      toast.warn(
        language === "ar"
          ? "يرجى تسجيل الدخول للمتابعة"
          : "Please login to continue"
      );
    } else if (response?.status === 500) {
      toast.error(
        language === "ar"
          ? "يرجى المحاولة مرة أخرى لاحقًا"
          : "Try again later"
      );
    }

    return Promise.reject(error);
  }
);

export default axiosAPI;
