import QueryKeys from "@/enums";
import {
  getAllCourses,
  getCourseById,
  getCourseContents,
  getCourseLectures,
  getRelatedCourse,
} from "@/services/courses/courses";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useQuery } from "@tanstack/react-query";

const useCourseSessionScope = () =>
  useSelector((state: RootState) =>
    `${state.auth.sessionVersion}:${state.auth.isAuthenticated ? state.auth.role ?? "authenticated" : "guest"}`
  );

export const useGetCourses = ({
  token,
  q,
}: {
  token?: string;
  q?: string;
}) => {
  const sessionScope = useCourseSessionScope();

  return useQuery({
    queryKey: [QueryKeys.COURSES, q, sessionScope],
    queryFn: () => getAllCourses({ token, q }),
  });
};

export const useGetCourseById = ({
  token,
  courseId,
}: {
  courseId: number;
  token?: string;
}) => {
  const sessionScope = useCourseSessionScope();

  return useQuery({
    queryKey: [QueryKeys.COURSE, courseId, sessionScope],
    queryFn: () => getCourseById({ token, courseId }),
    enabled: !!courseId,
  });
};

export const useGetCourseContents = (courseId: number) =>
  useQuery({
    queryKey: [QueryKeys.COURSE_CONTENTS, courseId],
    queryFn: () => getCourseContents(courseId),
    enabled: !!courseId,
  });

export const useGetCourseLectures = ({
  token,
  courseId,
  contentId,
  enabled = true,
}: {
  token: string;
  courseId: number;
  contentId: number;
  enabled?: boolean;
}) => {
  const sessionScope = useCourseSessionScope();

  return useQuery({
    queryKey: [QueryKeys.COURSE_LECTURES, courseId, contentId, sessionScope],
    queryFn: () => getCourseLectures({ token, courseId, contentId }),
    enabled: enabled && !!courseId && !!contentId && !!token,
  });
};

export const useGetRelatedCourses = ({
  subCategoryId,
  courseId,
  token,
}: {
  subCategoryId: number;
  courseId: number;
  token?: string;
}) => {
  const sessionScope = useCourseSessionScope();

  return useQuery({
    queryKey: [QueryKeys.SUB_CATEGORY_COURSES, subCategoryId, courseId, sessionScope],
    queryFn: () => getRelatedCourse({ subCategoryId, courseId, token }),
    enabled: !!subCategoryId && !!courseId,
  });
};
