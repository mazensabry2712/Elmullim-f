import axiosAPI from "@/config/axios.config";
import { IContentsRes } from "@/interfaces/courses/contents";
import { ICourseRes, ICoursesRes } from "@/interfaces/courses/courses";
import { ILecturesRes } from "@/interfaces/courses/lectures";

export const getAllCourses = async ({
  q,
  token,
}: {
  q?: string;
  token?: string;
}): Promise<ICoursesRes> => {
  const { data } = await axiosAPI.get(`/courses/all${q ? `?q=${q}` : ""}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  return data;
};

export const getCourseById = async ({
  token,
  courseId,
}: {
  token?: string;
  courseId: number;
}): Promise<ICourseRes> => {
  const { data } = await axiosAPI.get(`/courses/${courseId}/details`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  return data;
};

export const getCourseContents = async (
  courseId: number
): Promise<IContentsRes> => {
  const { data } = await axiosAPI.get(`/courses/${courseId}/contents`);
  return data;
};

export const getCourseLectures = async ({
  token,
  courseId,
  contentId,
}: {
  token: string;
  courseId: number;
  contentId: number;
}): Promise<ILecturesRes> => {
  const { data } = await axiosAPI.get(
    `/courses/${courseId}/${contentId}/lectures`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export const getRelatedCourse = async ({
  subCategoryId,
  courseId,
  token,
}: {
  subCategoryId: number;
  courseId: number;
  token?: string;
}): Promise<ICoursesRes> => {
  const { data } = await axiosAPI.get(
    `/general/${subCategoryId}/courses?exceptId=${courseId}`,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    }
  );
  return data;
};
