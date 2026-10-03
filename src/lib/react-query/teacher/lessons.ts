import QueryKeys from "@/enums";
import {
  createTeacherLesson,
  deleteTeacherLesson,
  getTeacherLessonById,
  getTeacherLessons,
  getTeacherLessonSummary,
  resubmitTeacherLesson,
  unpublishTeacherLesson,
  updateTeacherLesson,
} from "@/services/teacher/lessons";
import { ICreateLesson, IUpdateLesson } from "@/interfaces/teachers/teacherLessons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTeacherLessons = (token: string, enabled = true) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_LESSONS],
    queryFn: () => getTeacherLessons(token),
    enabled: enabled && !!token,
  });

export const useGetTeacherLessonSummary = (token: string, enabled = true) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_LESSONS, "summary"],
    queryFn: () => getTeacherLessonSummary(token),
    enabled: enabled && !!token,
    staleTime: 30_000,
  });

export const useGetTeacherLessonById = ({
  token,
  id,
  enabled = true,
}: {
  token: string;
  id: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_LESSON, id],
    queryFn: () => getTeacherLessonById({ token, id }),
    enabled: enabled && !!id && !!token,
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
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.TEACHER_LESSONS, "summary"] });
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
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_LESSONS],
      });
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_LESSON, String(variables.lesson.id)],
      });
    },
  });
};

export const useResubmitTeacherLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, id }: { token: string; id: number }) =>
      resubmitTeacherLesson({ token, id }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.TEACHER_LESSONS] });
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.TEACHER_LESSONS, "summary"] });
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_LESSON, String(variables.id)],
      });
    },
  });
};

export const useUnpublishTeacherLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, id }: { token: string; id: number }) =>
      unpublishTeacherLesson({ token, id }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.TEACHER_LESSONS] });
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_LESSON, String(variables.id)],
      });
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
