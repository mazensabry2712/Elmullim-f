import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTeacherServiceArea,
  deleteTeacherServiceArea,
  getTeacherServiceAreas,
  updateTeacherServiceArea,
} from "@/services/teacher/serviceAreas";

export const serviceAreaKeys = {
  all: ["teacher-service-areas"] as const,
  mine: (token: string) => ["teacher-service-areas", token] as const,
};

export const useGetTeacherServiceAreas = (token: string, enabled = true) =>
  useQuery({
    queryKey: serviceAreaKeys.mine(token),
    queryFn: () => getTeacherServiceAreas(token),
    enabled: enabled && !!token,
  });

export const useCreateTeacherServiceArea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTeacherServiceArea,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceAreaKeys.mine(variables.token) });
    },
  });
};

export const useUpdateTeacherServiceArea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTeacherServiceArea,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceAreaKeys.mine(variables.token) });
    },
  });
};

export const useDeleteTeacherServiceArea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTeacherServiceArea,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceAreaKeys.mine(variables.token) });
    },
  });
};
