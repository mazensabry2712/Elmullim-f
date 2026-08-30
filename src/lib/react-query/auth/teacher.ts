import { ILoginCredentials, ITeacherRegister } from "@/interfaces/auth/auth";
import {
  teacherLogin,
  teacherRegister,
  teacherVerifyAccount,
} from "@/services/auth/teachers";
import { useMutation } from "@tanstack/react-query";

export const useTeacherLogin = () =>
  useMutation({
    mutationFn: ({ email, password }: ILoginCredentials) =>
      teacherLogin({ email, password }),
  });

export const useTeacherRegister = () =>
  useMutation({
    mutationFn: (user: ITeacherRegister) => teacherRegister(user),
  });

export const useTeacherVerifyAccount = () =>
  useMutation({
    mutationFn: ({ code, token }: { code: string; token: string }) =>
      teacherVerifyAccount(code, token),
  });
