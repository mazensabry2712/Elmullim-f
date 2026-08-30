import axiosAPI from "@/config/axios.config";
import { IStatusMsg } from "@/interfaces";
import { ICoursesRes } from "@/interfaces/courses/courses";
import { ILessonsRes } from "@/interfaces/courses/lessons";

export const getMyCourses = async (token: string): Promise<ICoursesRes> => {
  const { data } = await axiosAPI.get("/student/enrolling/courses", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getMyLessons = async (token: string): Promise<ILessonsRes> => {
  const { data } = await axiosAPI.get("/student/enrolling/lessons", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const enrollFreeCourse = async ({
  token,
  courseId,
}: {
  token: string;
  courseId: number;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    `/student/enrolling/courses/${courseId}/enroll`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

export const enrollFreeLesson = async ({
  token,
  lessonId,
}: {
  token: string;
  lessonId: number;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    `/student/enrolling/lessons/${lessonId}/enroll`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};
