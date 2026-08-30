import { ILoginCredentials, IStudentRegister } from "@/interfaces/auth/auth";
import {
  studentLogin,
  studentRegister,
  studentVerifyAccount,
} from "@/services/auth/students";
import { useMutation } from "@tanstack/react-query";

export const useStudentLogin = () =>
  useMutation({
    mutationFn: ({ email, password }: ILoginCredentials) =>
      studentLogin({ email, password }),
  });

export const useStudentRegister = () =>
  useMutation({
    mutationFn: (user: IStudentRegister) => studentRegister(user),
  });

export const useStudentVerifyAccount = () =>
  useMutation({
    mutationFn: ({ code, token }: { code: string; token: string }) =>
      studentVerifyAccount(code, token),
  });
