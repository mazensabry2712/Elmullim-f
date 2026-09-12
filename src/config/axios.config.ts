import { logout } from "@/store/features/auth/authSlice";
import axios from "axios";
import { store } from "@/store/store";
import { toast } from "react-toastify";

const apiBaseUrl =
  import.meta.env.VITE_API ||
  (import.meta.env.DEV ? "http://elmullim-b.test" : "https://api.elmullim.com");

const axiosAPI = axios.create({
  baseURL: `${apiBaseUrl}/api`,
  headers: {
    Accept: "application/json",
  },
});

axiosAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      store.dispatch(logout());
      toast.warn("Please login to continue");
    } else if (error?.response?.status === 500) {
      toast.error("Try again later");
    }
    return Promise.reject(error);
  }
);

export default axiosAPI;
