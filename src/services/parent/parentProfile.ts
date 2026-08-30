import axiosAPI from "@/config/axios.config";
import {
  IParentProfileRes,
  IUpdateParentProfile,
} from "@/interfaces/parents/parentProfile";

export const getParentProfile = async (
  token: string
): Promise<IParentProfileRes> => {
  const { data } = await axiosAPI.get("/parent/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const updateParentProfile = async ({
  token,
  dataForm,
}: IUpdateParentProfile): Promise<IParentProfileRes> => {
  const formData = new FormData();
  formData.append("email", dataForm.email);
  formData.append("name", dataForm.name);
  formData.append("phone", dataForm.phone);
  formData.append("education_level_id", dataForm.education_level_id);
  formData.append("gender", dataForm.gender);

  if (dataForm.profile_image)
    formData.append("profile_image", dataForm.profile_image);
  if (dataForm.description)
    formData.append("description", dataForm.description);
  if (dataForm.students) {
    dataForm.students.map((student, idx) =>
      formData.append(`students[${idx}]`, student)
    );
  }
  const { data } = await axiosAPI.post("/parent/me", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
