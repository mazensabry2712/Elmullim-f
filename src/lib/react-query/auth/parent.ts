import { ILoginCredentials, IParentRegister } from "@/interfaces/auth/auth";
import {
  parentLogin,
  parentRegister,
  parentVerifyAccount,
} from "@/services/auth/parents";
import { useMutation } from "@tanstack/react-query";

export const useParentLogin = () =>
  useMutation({
    mutationFn: ({ email, password }: ILoginCredentials) =>
      parentLogin({ email, password }),
  });

export const useParentRegister = () =>
  useMutation({
    mutationFn: (user: IParentRegister) => parentRegister(user),
  });

export const useParentVerifyAccount = () =>
  useMutation({
    mutationFn: ({ code, token }: { code: string; token: string }) =>
      parentVerifyAccount(code, token),
  });
