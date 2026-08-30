import axiosAPI from "@/config/axios.config";
import { IStatusMsg } from "@/interfaces";
import {
  ILoginRes,
  ILoginCredentials,
  IStudentRegister,
} from "@/interfaces/auth/auth";

export const studentRegister = async (
  user: IStudentRegister
): Promise<ILoginRes> => {
  const { data } = await axiosAPI.post("/student/register", user);
  return data;
};

export const studentLogin = async ({
  email,
  password,
}: ILoginCredentials): Promise<ILoginRes> => {
  const { data } = await axiosAPI.post("/student/login", {
    email,
    password,
  });
  return data;
};

export const studentVerifyAccount = async (
  code: string,
  token: string
): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    "/student/verification-email/verify",
    {
      code,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};