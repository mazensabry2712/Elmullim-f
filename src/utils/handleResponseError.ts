import axios from "axios";
import { toast } from "react-toastify";

interface IApiErrorResponse {
  message?: string | null;
  errors?: Record<string, string | string[]>;
}

const handleResError = (error: unknown) => {
  if (!axios.isAxiosError<IApiErrorResponse>(error)) {
    return;
  }

  const data = error.response?.data;

  if (!data) {
    return;
  }

  if (data.errors) {
    Object.values(data.errors).forEach((messages) => {
      const normalizedMessages = Array.isArray(messages)
        ? messages
        : [messages];

      normalizedMessages.forEach((message) => {
        if (message) {
          toast.error(message, { autoClose: 5000 });
        }
      });
    });

    return;
  }

  if (data.message) {
    toast.error(data.message, { autoClose: 5000 });
  }
};

export default handleResError;
