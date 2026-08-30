import { toast } from "react-toastify";
import Swal from "sweetalert2";

const handleResError = (error: any) => {
  if (error?.response?.data.errors) {
    Object.keys(error.response.data.errors).forEach((key) => {
      error?.response?.data.errors[key].forEach((error: string) =>
        toast.error(error, {
          autoClose: 5000,
        })
      );
    });
  }
  if (error?.response?.data.message && !error?.response?.data.errors) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error?.response?.data.message,
    });
  }
};

export default handleResError;
