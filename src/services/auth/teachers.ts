import axiosAPI from "@/config/axios.config";
import { IStatusMsg } from "@/interfaces";
import {
  ILoginRes,
  ILoginCredentials,
  ITeacherRegister,
} from "@/interfaces/auth/auth";

export const teacherRegister = async (
  user: ITeacherRegister
): Promise<ILoginRes> => {
  const formData = new FormData();
  formData.append("name", user.name);
  formData.append("email", user.email);
  formData.append("password", user.password);
  formData.append("gender", user.gender);
  formData.append("phone", user.phone);
  formData.append("education_level_id", user.education_level_id);
  user.subjects.map((subject, idx) =>
    formData.append(`subjects[${idx}]`, subject)
  );
  user.course_type.map((course, idx) =>
    formData.append(`course_type[${idx}]`, course)
  );
  const { data } = await axiosAPI.post("/teacher/register", formData);
  return data;
};

export const teacherLogin = async ({
  email,
  password,
}: ILoginCredentials): Promise<ILoginRes> => {
  const { data } = await axiosAPI.post("/teacher/login", {
    email,
    password,
  });
  return data;
};

export const teacherVerifyAccount = async (
  code: string,
  token: string
): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    "/teacher/verification-email/verify",
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
