import QueryKeys from "@/enums";
import {
  IServiceAreaInput,
  IServiceAreaRes,
} from "@/interfaces/teacher/serviceAreas";
import {
  createTeacherServiceArea,
  deleteTeacherServiceArea,
  getTeacherLessonServiceAreas,
  getTeacherServiceAreas,
  replaceTeacherLessonServiceAreas,
  updateTeacherServiceArea,
} from "@/services/teacher/serviceAreas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTeacherServiceAreas = (token: string) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_SERVICE_AREAS],
    queryFn: () => getTeacherServiceAreas(token),
    enabled: !!token,
  });

export const useCreateTeacherServiceArea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, payload }: { token: string; payload: IServiceAreaInput }) =>
      createTeacherServiceArea({ token, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TEACHER_SERVICE_AREAS] });
    },
  });
};

export const useUpdateTeacherServiceArea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      id,
      payload,
    }: {
      token: string;
      id: number;
      payload: Partial<IServiceAreaInput>;
    }) => updateTeacherServiceArea({ token, id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TEACHER_SERVICE_AREAS] });
    },
  });
};

export const useDeleteTeacherServiceArea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, id }: { token: string; id: number }) =>
      deleteTeacherServiceArea({ token, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TEACHER_SERVICE_AREAS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TEACHER_LESSON_SERVICE_AREAS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TEACHER_LESSONS] });
    },
  });
};

export const useGetTeacherLessonServiceAreas = ({
  token,
  lessonId,
}: {
  token: string;
  lessonId: number;
}) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_LESSON_SERVICE_AREAS, lessonId],
    queryFn: () => getTeacherLessonServiceAreas({ token, lessonId }),
    enabled: !!token && !!lessonId,
  });

export const useReplaceTeacherLessonServiceAreas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      lessonId,
      serviceAreaIds,
    }: {
      token: string;
      lessonId: number;
      serviceAreaIds: number[];
    }) => replaceTeacherLessonServiceAreas({ token, lessonId, serviceAreaIds }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TEACHER_LESSON_SERVICE_AREAS, variables.lessonId] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TEACHER_LESSONS] });
    },
  });
};

export type TeacherServiceAreaMutationResponse = IServiceAreaRes;
