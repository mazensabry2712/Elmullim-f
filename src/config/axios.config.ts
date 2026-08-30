import { logout } from "@/store/features/auth/authSlice";
import axios from "axios";
import { store } from "@/store/store";
import { toast } from "react-toastify";

const axiosAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API}/api`,
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
    } else if (error?.status === 500) toast.error("Try again later");
    return Promise.reject(error);
  }
);

export default axiosAPI;
