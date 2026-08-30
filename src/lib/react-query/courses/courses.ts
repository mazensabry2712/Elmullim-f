import QueryKeys from "@/enums";
import {
  getAllCourses,
  getCourseById,
  getCourseContents,
  getCourseLectures,
  getRelatedCourse,
} from "@/services/courses/courses";
import { useQuery } from "@tanstack/react-query";

export const useGetCourses = ({ token, q }: { token?: string; q?: string }) =>
  useQuery({
    queryKey: [QueryKeys.COURSES, q],
    queryFn: () => getAllCourses({ token, q }),
  });

export const useGetCourseById = ({
  token,
  courseId,
}: {
  courseId: number;
  token?: string;
}) =>
  useQuery({
    queryKey: [QueryKeys.COURSE, courseId],
    queryFn: () => getCourseById({ token, courseId }),
    enabled: !!courseId,
  });

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
}: {
  token: string;
  courseId: number;
  contentId: number;
}) =>
  useQuery({
    queryKey: [QueryKeys.COURSE_CONTENTS, courseId, contentId],
    queryFn: () => getCourseLectures({ token, courseId, contentId }),
    enabled: !!courseId && !!contentId && !!token,
  });

export const useGetRelatedCourses = ({
  subCategoryId,
  courseId,
  token,
}: {
  subCategoryId: number;
  courseId: number;
  token?: string;
}) =>
  useQuery({
    queryKey: [QueryKeys.SUB_CATEGORY_COURSES, subCategoryId, courseId],
    queryFn: () => getRelatedCourse({ subCategoryId, courseId, token }),
    enabled: !!subCategoryId && !!courseId,
  });
