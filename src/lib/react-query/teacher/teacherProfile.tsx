import QueryKeys from "@/enums";
import { IUpdateTeacherProfile } from "@/interfaces/teachers/teacherProfile";
import {
  getTeacherProfile,
  getTeacherRatings,
  updateTeacherProfile,
} from "@/services/teacher/teacherProfile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTeacherProfile = (token: string) =>
  useQuery({
    queryKey: [QueryKeys.PROFILE],
    queryFn: () => getTeacherProfile(token),
  });

export const useUpdateTeacherProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, dataForm }: IUpdateTeacherProfile) =>
      updateTeacherProfile({ token, dataForm }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.PROFILE],
      });
    },
  });
};

export const useGetTeacherRatings = (token: string) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_RATINGS],
    queryFn: () => getTeacherRatings(token),
  });
