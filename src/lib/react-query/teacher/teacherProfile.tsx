import QueryKeys from "@/enums";
import { IUpdateTeacherProfile } from "@/interfaces/teachers/teacherProfile";
import {
  getTeacherProfile,
  getTeacherRatings,
  updateTeacherProfile,
} from "@/services/teacher/teacherProfile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTeacherProfile = (token: string, enabled = true) =>
  useQuery({
    queryKey: [QueryKeys.PROFILE, "teacher"],
    queryFn: () => getTeacherProfile(token),
    enabled: enabled && !!token,
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

export const useGetTeacherRatings = (token: string, enabled = true) =>
  useQuery({
    queryKey: [QueryKeys.TEACHER_RATINGS],
    queryFn: () => getTeacherRatings(token),
    enabled: enabled && !!token,
  });
