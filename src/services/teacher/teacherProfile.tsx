import axiosAPI from "@/config/axios.config";
import { IRatingRes } from "@/interfaces/students/studentProfile";
import {
  ITeacherProfileRes,
  IUpdateTeacherProfile,
} from "@/interfaces/teachers/teacherProfile";

export const getTeacherProfile = async (
  token: string
): Promise<ITeacherProfileRes> => {
  const { data } = await axiosAPI.get("/teacher/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const updateTeacherProfile = async ({
  token,
  dataForm,
}: IUpdateTeacherProfile): Promise<ITeacherProfileRes> => {
  const formData = new FormData();
  formData.append("email", dataForm.email);
  formData.append("name", dataForm.name);
  formData.append("phone", dataForm.phone);
  formData.append("education_level_id", dataForm.education_level_id);
  formData.append("gender", dataForm.gender);
  formData.append("experince", dataForm.experince.toString());
  formData.append("qualification", dataForm.qualification);

  if (dataForm.profile_image)
    formData.append("profile_image", dataForm.profile_image);
  if (dataForm.cv) formData.append("cv", dataForm.cv);

  if (dataForm.description)
    formData.append("description", dataForm.description);

  if (dataForm.subjects)
    dataForm.subjects.map((subject, idx) =>
      formData.append(`subjects[${idx}]`, subject)
    );

  if (dataForm.course_type)
    dataForm.course_type.map((course, idx) =>
      formData.append(`course_type[${idx}]`, course)
    );

  const { data } = await axiosAPI.post("/teacher/me", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const getTeacherRatings = async (token: string): Promise<IRatingRes> => {
  return (
    await axiosAPI.get(`/teacher/ratings/received-all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;
};
