import axiosAPI from "@/config/axios.config";
import { ICoursesRes } from "@/interfaces/courses/courses";
import { ILessonsRes } from "@/interfaces/courses/lessons";
import {
  IRatingRes,
  IStudentProfileRes,
  IUpdateStudentProfile,
} from "@/interfaces/students/studentProfile";

export const getStudentProfile = async (
  token: string
): Promise<IStudentProfileRes> => {
  const { data } = await axiosAPI.get("/student/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const updateStudentProfile = async ({
  token,
  dataForm,
}: IUpdateStudentProfile): Promise<IStudentProfileRes> => {
  const formData = new FormData();
  formData.append("email", dataForm.email);
  formData.append("name", dataForm.name);
  formData.append("phone", dataForm.phone);
  formData.append("address", dataForm.address);
  formData.append("education_level_id", dataForm.education_level_id);
  formData.append("gender", dataForm.gender);
  if (dataForm.profile_image)
    formData.append("profile_image", dataForm.profile_image);
  if (dataForm.description)
    formData.append("description", dataForm.description);
  if (dataForm.favourite_subjects) {
    dataForm.favourite_subjects.map((subject, idx) =>
      formData.append(`favourite_subjects[${idx}]`, subject)
    );
  }
  const { data } = await axiosAPI.post("/student/me", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const getStudentRatings = async (token: string): Promise<IRatingRes> => {
  return (
    await axiosAPI.get(`/student/rating/received-all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;
};

export const getStudentCourses = async (
  token: string
): Promise<ICoursesRes> => {
  return (
    await axiosAPI.get("/student/enrolling/courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;
};

export const getStudentLessons = async (
  token: string
): Promise<ILessonsRes> => {
  return (
    await axiosAPI.get("/student/enrolling/lessons", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;
};
