import QueryKeys from "@/enums";
import { IUpdateStudentProfile } from "@/interfaces/students/studentProfile";
import {
  getStudentCourses,
  getStudentLessons,
  getStudentProfile,
  getStudentRatings,
  updateStudentProfile,
} from "@/services/student/studentProfile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetStudentProfile = (token: string) =>
  useQuery({
    queryKey: [QueryKeys.PROFILE],
    queryFn: () => getStudentProfile(token),
  });

export const useUpdateStudentProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, dataForm }: IUpdateStudentProfile) =>
      updateStudentProfile({ token, dataForm }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.PROFILE],
      });
    },
  });
};

export const useGetStudentRatings = (token: string) =>
  useQuery({
    queryKey: [QueryKeys.STUDENTS_RATING],
    queryFn: () => getStudentRatings(token),
  });

export const useGetStudentCourses = (token: string) =>
  useQuery({
    queryKey: [QueryKeys.COURSES],
    queryFn: () => getStudentCourses(token),
  });

export const useGetStudentLessons = (token: string) =>
  useQuery({
    queryKey: [QueryKeys.LESSONS],
    queryFn: () => getStudentLessons(token),
  });
