import QueryKeys from "@/enums";
import {
  enrollFreeCourse,
  enrollFreeLesson,
  getMyCourses,
  getMyLessons,
} from "@/services/student/enrolling";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetMyCourses = (token: string) =>
  useQuery({
    queryKey: [QueryKeys.MY_COURSES],
    queryFn: () => getMyCourses(token),
  });

export const useGetMyLessons = (token: string) =>
  useQuery({
    queryKey: [QueryKeys.MY_LESSONS],
    queryFn: () => getMyLessons(token),
  });

export const useEnrollFreeCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, courseId }: { token: string; courseId: number }) =>
      enrollFreeCourse({ token, courseId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.MY_COURSES],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.COURSES],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.COURSE_LECTURES],
      });
    },
  });
};

export const useEnrollFreeLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, lessonId }: { token: string; lessonId: number }) =>
      enrollFreeLesson({ token, lessonId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.MY_LESSONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.LESSONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.LESSON_LECTURES],
      });
    },
  });
};
