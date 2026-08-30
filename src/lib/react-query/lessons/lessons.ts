import QueryKeys from "@/enums";
import {
  getAllLessons,
  getLessonById,
  getLessonContents,
  getLessonLectures,
  getRelatedLesson,
} from "@/services/lessons/lessons";
import { useQuery } from "@tanstack/react-query";

export const useGetLessons = ({ q, token }: { token?: string; q?: string }) =>
  useQuery({
    queryKey: [QueryKeys.LESSONS, q],
    queryFn: () => getAllLessons({ q, token }),
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

export const useGetLessonContents = (lessonId: number) =>
  useQuery({
    queryKey: [QueryKeys.LESSON_CONTENT, lessonId],
    queryFn: () => getLessonContents(lessonId),
    enabled: !!lessonId,
  });

export const useGetLessonLectures = ({
  token,
  lessonId,
  contentId,
}: {
  token: string;
  lessonId: number;
  contentId: number;
}) =>
  useQuery({
    queryKey: [QueryKeys.LESSON_LECTURES, lessonId, contentId],
    queryFn: () => getLessonLectures({ token, lessonId, contentId }),
    enabled: !!lessonId && !!contentId,
  });

export const useGetRelatedLesson = ({
  token,
  teacherId,
  lessonId,
}: {
  teacherId: number;
  token?: string;
  lessonId: number;
}) =>
  useQuery({
    queryKey: [QueryKeys.RELATED_LESSON, teacherId, lessonId],
    queryFn: () => getRelatedLesson({ token, teacherId, lessonId }),
    enabled: !!lessonId && !!teacherId,
  });
