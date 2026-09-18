import QueryKeys from "@/enums";
import {
  getAllLessons,
  getLessonAvailability,
  getLessonById,
  getRelatedLesson,
  ILessonFilters,
} from "@/services/lessons/lessons";
import { useQuery } from "@tanstack/react-query";

export const useGetLessons = (filters: ILessonFilters & { token?: string }) =>
  useQuery({
    queryKey: [QueryKeys.LESSONS, filters],
    queryFn: () => getAllLessons(filters),
  });

export const useGetLessonById = ({
  token,
  lessonId,
}: {
  token?: string;
  lessonId: number;
}) =>
  useQuery({
    queryKey: [QueryKeys.LESSON, lessonId],
    queryFn: () => getLessonById({ token, lessonId }),
    enabled: !!lessonId,
  });

export const useGetLessonAvailability = (lessonId: number) =>
  useQuery({
    queryKey: [QueryKeys.LESSON_AVAILABILITY, lessonId],
    queryFn: () => getLessonAvailability(lessonId),
    enabled: !!lessonId,
  });

export const useGetRelatedLesson = ({
  token,
  teacherId,
  lessonId,
}: {
  teacherId: number;
  lessonId: number;
  token?: string;
}) =>
  useQuery({
    queryKey: [QueryKeys.RELATED_LESSON, teacherId, lessonId],
    queryFn: () => getRelatedLesson({ token, teacherId, lessonId }),
    enabled: !!lessonId && !!teacherId,
  });
