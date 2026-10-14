import axios from "axios";
import { toast } from "react-toastify";

interface IApiErrorResponse {
  message?: string | null;
  errors?: Record<string, string | string[]>;
}

export const getResponseErrorMessage = (error: unknown): string | null => {
  if (!axios.isAxiosError<IApiErrorResponse>(error)) {
    return null;
  }

  const data = error.response?.data;
  if (!data) {
    return null;
  }

  if (typeof data.message === "string" && data.message.trim()) {
    return data.message.trim();
  }

  if (data.errors) {
    for (const messages of Object.values(data.errors)) {
      const first = (Array.isArray(messages) ? messages : [messages]).find(
        (message) => typeof message === "string" && message.trim()
      );
      if (first) return first.trim();
    }
  }

  return null;
};

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
