import QueryKeys from "@/enums";
import {
  getAllLessons,
  getLessonFilterOptions,
  getLessonAvailability,
  getLessonBookingOptions,
  getLessonById,
  getRelatedLesson,
  ILessonFilters,
} from "@/services/lessons/lessons";
import { useQuery } from "@tanstack/react-query";

export const useGetLessonFilterOptions = () =>
  useQuery({
    queryKey: ["LESSON_FILTER_OPTIONS"],
    queryFn: getLessonFilterOptions,
  });

export const useGetLessons = (
  filters: ILessonFilters & { token?: string; enabled?: boolean }
) => {
  const { token, enabled = true, ...queryFilters } = filters;

  return useQuery({
    queryKey: [QueryKeys.LESSONS, queryFilters],
    queryFn: () => getAllLessons({ ...queryFilters, token }),
    enabled,
  });
};

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

export const useGetLessonBookingOptions = (
  lessonId: number,
  date?: string
) =>
  useQuery({
    queryKey: ["LESSON_BOOKING_OPTIONS", lessonId, date],
    queryFn: () => getLessonBookingOptions(lessonId, date as string),
    enabled: !!lessonId && !!date,
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
