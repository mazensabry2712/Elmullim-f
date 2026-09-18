import QueryKeys from "@/enums";
import {
  createTeacherLesson,
  deleteTeacherLesson,
  getTeacherLessonById,
  getTeacherLessons,
  updateTeacherLesson,
} from "@/services/teacher/lessons";
import { ICreateLesson, IUpdateLesson } from "@/interfaces/teachers/teacherLessons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTeacherLessons = (token: string) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_LESSONS],
    queryFn: () => getTeacherLessons(token),
  });

export const useGetTeacherLessonById = ({
  token,
  id,
}: {
  token: string;
  id: string;
}) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_LESSON, id],
    queryFn: () => getTeacherLessonById({ token, id }),
    enabled: !!id,
  });

export const useCreateTeacherLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      lesson,
    }: {
      token: string;
      lesson: ICreateLesson;
    }) => createTeacherLesson({ token, lesson }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.TEACHER_LESSONS] });
    },
  });
};

export const useUpdateTeacherLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      lesson,
    }: {
      token: string;
      lesson: IUpdateLesson;
    }) => updateTeacherLesson({ token, lesson }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.TEACHER_LESSONS] });
    },
  });
};

export const useDeleteTeacherLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, id }: { token: string; id: string }) =>
      deleteTeacherLesson({ token, id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.TEACHER_LESSONS] });
    },
  });
};
