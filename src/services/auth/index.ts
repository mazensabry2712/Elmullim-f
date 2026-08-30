import axiosAPI from "@/config/axios.config";
import { IStatusMsg } from "@/interfaces";
import {
  ICheckAuth,
  IResetPassword,
  IUpdatePassword,
} from "@/interfaces/auth/auth";
import { TRole } from "@/types";

export const checkAuth = async (token: string): Promise<ICheckAuth> => {
  const { data } = await axiosAPI.post(
    "/check-auth",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export const sendVerificationEmail = async (
  token: string
): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    "/verification-email/send",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export const userLogout = async ({
  token,
  role,
}: {
  token: string;
  role: TRole;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    `/${
      role === "teacher" ? "teacher" : role === "parent" ? "parent" : "student"
    }/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export const forgotPassword = async ({
  role,
  email,
}: {
  role: TRole;
  email: string;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    `/${
      role === "teacher" ? "teacher" : role === "parent" ? "parent" : "student"
    }/forget-password`,
    { email }
  );
  return data;
};

export const resetPassword = async ({
  role,
  code,
  password,
  password_confirmation,
}: IResetPassword): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    `/${
      role === "teacher" ? "teacher" : role === "parent" ? "parent" : "student"
    }/reset-password`,
    { code, password, password_confirmation }
  );
  return data;
};

export const updatePassword = async ({
  token,
  password,
  password_confirmation,
  role,
}: IUpdatePassword): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    `/${
      role === "teacher" ? "teacher" : role === "parent" ? "parent" : "student"
    }/update-password`,
    {
      password,
      password_confirmation,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};
