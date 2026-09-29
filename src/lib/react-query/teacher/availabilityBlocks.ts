import QueryKeys from "@/enums";
import {
  createTeacherAvailabilityBlock,
  deleteTeacherAvailabilityBlock,
  getTeacherAvailabilityBlocks,
} from "@/services/teacher/availabilityBlocks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTeacherAvailabilityBlocks = (token: string) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_AVAILABILITY_BLOCKS],
    queryFn: () => getTeacherAvailabilityBlocks(token),
    enabled: !!token,
  });

export const useCreateTeacherAvailabilityBlock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeacherAvailabilityBlock,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_AVAILABILITY_BLOCKS],
      });
    },
  });
};

export const useDeleteTeacherAvailabilityBlock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeacherAvailabilityBlock,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_AVAILABILITY_BLOCKS],
      });
    },
  });
};
