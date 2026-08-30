import { IResetPassword, IUpdatePassword } from "@/interfaces/auth/auth";
import {
  checkAuth,
  userLogout,
  sendVerificationEmail,
  forgotPassword,
  resetPassword,
  updatePassword,
} from "@/services/auth";
import { TRole } from "@/types";
import { useMutation } from "@tanstack/react-query";

export const useCheckAuth = () =>
  useMutation({
    mutationFn: (token: string) => checkAuth(token),
  });

export const useSendVerificationEmail = () =>
  useMutation({
    mutationFn: (token: string) => sendVerificationEmail(token),
  });

export const useUserLogout = () =>
  useMutation({
    mutationFn: ({ token, role }: { token: string; role: TRole }) =>
      userLogout({ token, role }),
  });

export const useForgotPassword = () =>
  useMutation({
    mutationFn: ({ role, email }: { role: TRole; email: string }) =>
      forgotPassword({ role, email }),
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: ({
      role,
      code,
      password,
      password_confirmation,
    }: IResetPassword) =>
      resetPassword({ role, code, password, password_confirmation }),
  });

export const useUpdatePassword = () =>
  useMutation({
    mutationFn: ({
      password,
      password_confirmation,
      token,
      role,
    }: IUpdatePassword) =>
      updatePassword({ token, password, password_confirmation, role }),
  });
