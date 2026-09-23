import axiosAPI from "@/config/axios.config";
import { ILessonAvailabilityRes } from "@/interfaces/lessons/availability";
import { ILessonRes, ILessonsRes, LessonBookingType, LessonDeliveryMode } from "@/interfaces/lessons/lesson";

export interface ILessonFilterOption {
  id: number;
  name: string;
}

export interface ILessonFilterOptionsRes {
  status: boolean;
  message: string | null;
  data: {
    education_levels: ILessonFilterOption[];
    subjects: ILessonFilterOption[];
  };
}

export interface ILessonFilters {
  q?: string;
  delivery_mode?: LessonDeliveryMode;
  booking_type?: LessonBookingType;
  education_level_id?: number;
  subject_id?: number;
  grade?: string;
  min_price?: number;
  max_price?: number;
  location?: string;
}

export const getLessonFilterOptions = async (): Promise<ILessonFilterOptionsRes> => {
  const { data } = await axiosAPI.get("/lessons/filters");
  return data;
};

export const getAllLessons = async ({
  q,
  token,
  ...filters
}: ILessonFilters & { token?: string }): Promise<ILessonsRes> => {
  const params = new URLSearchParams();

  if (q?.trim()) params.set("q", q.trim());
  if (filters.delivery_mode) params.set("delivery_mode", filters.delivery_mode);
  if (filters.booking_type) params.set("booking_type", filters.booking_type);
  if (filters.education_level_id) params.set("education_level_id", String(filters.education_level_id));
  if (filters.subject_id) params.set("subject_id", String(filters.subject_id));
  if (filters.grade?.trim()) params.set("grade", filters.grade.trim());
  if (typeof filters.min_price === "number") params.set("min_price", String(filters.min_price));
  if (typeof filters.max_price === "number") params.set("max_price", String(filters.max_price));
  if (filters.location?.trim()) params.set("location", filters.location.trim());

  const query = params.toString();

  const { data } = await axiosAPI.get("/lessons/all" + (query ? "?" + query : ""), {
    headers: {
      Authorization: token ? "Bearer " + token : undefined,
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
  const { data } = await axiosAPI.get("/lessons/" + lessonId + "/details", {
    headers: {
      Authorization: token ? "Bearer " + token : undefined,
    },
  });

  return data;
};

export const getLessonAvailability = async (
  lessonId: number
): Promise<ILessonAvailabilityRes> => {
  const { data } = await axiosAPI.get("/lessons/" + lessonId + "/availability");
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
    "/main/" + teacherId + "/lessons?exceptId=" + lessonId,
    {
      headers: {
        Authorization: token ? "Bearer " + token : undefined,
      },
    }
  );

  return data;
};
