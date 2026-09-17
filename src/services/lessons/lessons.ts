import axiosAPI from "@/config/axios.config";
import { IContentsRes } from "@/interfaces/courses/contents";
import { ILecturesRes } from "@/interfaces/courses/lectures";
import { ILessonRes, ILessonsRes } from "@/interfaces/lessons/lesson";

export interface ILessonFilters {
  q?: string;
  delivery_mode?: "online" | "offline";
  booking_type?: "private" | "group";
  subject_id?: number;
  grade?: string;
  min_price?: number;
  max_price?: number;
  location?: string;
}

export const getAllLessons = async ({
  q,
  token,
  ...filters
}: ILessonFilters & { token?: string }): Promise<ILessonsRes> => {
  const params = new URLSearchParams();

  if (q?.trim()) params.set("q", q.trim());
  if (filters.delivery_mode) params.set("delivery_mode", filters.delivery_mode);
  if (filters.booking_type) params.set("booking_type", filters.booking_type);
  if (filters.subject_id) params.set("subject_id", String(filters.subject_id));
  if (filters.grade?.trim()) params.set("grade", filters.grade.trim());
  if (typeof filters.min_price === "number") params.set("min_price", String(filters.min_price));
  if (typeof filters.max_price === "number") params.set("max_price", String(filters.max_price));
  if (filters.location?.trim()) params.set("location", filters.location.trim());

  const query = params.toString();
  const { data } = await axiosAPI.get(`/lessons/all${query ? `?${query}` : ""}`, {
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
