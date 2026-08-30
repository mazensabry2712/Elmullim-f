import axiosAPI from "@/config/axios.config";
import { IStatusMsg } from "@/interfaces";
import {
  ILoginRes,
  ILoginCredentials,
  IParentRegister,
} from "@/interfaces/auth/auth";

export const parentRegister = async (
  user: IParentRegister
): Promise<ILoginRes> => {
  const formData = new FormData();
  formData.append("name", user.name);
  formData.append("email", user.email);
  formData.append("password", user.password);
  formData.append("phone", user.phone);
  formData.append("gender", user.gender);
  formData.append("education_level_id", user.education_level_id);
  user.students.map((student, idx) => {
    formData.append(`students[${idx}]`, student);
  });
  const { data } = await axiosAPI.post("/parent/register", formData);
  return data;
};

export const parentLogin = async ({
  email,
  password,
}: ILoginCredentials): Promise<ILoginRes> => {
  const { data } = await axiosAPI.post("/parent/login", {
    email,
    password,
  });
  return data;
};

export const parentVerifyAccount = async (
  code: string,
  token: string
): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    "/parent/verification-email/verify",
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
