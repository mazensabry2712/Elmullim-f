import axiosAPI from "@/config/axios.config";
import { IContentsRes } from "@/interfaces/courses/contents";
import { ILecturesRes } from "@/interfaces/courses/lectures";
import { ILessonRes, ILessonsRes } from "@/interfaces/courses/lessons";

export const getAllLessons = async ({
  q,
  token,
}: {
  token?: string;
  q?: string;
}): Promise<ILessonsRes> => {
  const { data } = await axiosAPI.get(`/lessons/all${q ? `?q=${q}` : ""}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  return data;
};

export const getLessonById = async ({
  token,
  lessonId,
}: {
  token?: string;
  lessonId: number;
}): Promise<ILessonRes> => {
  const { data } = await axiosAPI.get(`/lessons/${lessonId}/details`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  return data;
};

export const getLessonContents = async (
  lessonId: number
): Promise<IContentsRes> => {
  const { data } = await axiosAPI.get(`/lessons/${lessonId}/contents`);
  return data;
};

export const getLessonLectures = async ({
  token,
  lessonId,
  contentId,
}: {
  token: string;
  lessonId: number;
  contentId: number;
}): Promise<ILecturesRes> => {
  const { data } = await axiosAPI.get(
    `/lessons/${lessonId}/${contentId}/lectures`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export const getRelatedLesson = async ({
  token,
  teacherId,
  lessonId,
}: {
  teacherId: number;
  token?: string;
  lessonId: number;
}): Promise<ILessonsRes> => {
  const { data } = await axiosAPI.get(
    `/main/${teacherId}/lessons?exceptId=${lessonId}`,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    }
  );
  return data;
};
