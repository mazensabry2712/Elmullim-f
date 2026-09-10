import QueryKeys from "@/enums";
import {
  enrollFreeCourse,
  enrollFreeLesson,
  getMyCourses,
  getMyLessons,
  initiatePayment,
} from "@/services/student/enrolling";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetMyCourses = (token: string) =>
  useQuery({ queryKey: [QueryKeys.MY_COURSES], queryFn: () => getMyCourses(token) });

export const useGetMyLessons = (token: string) =>
  useQuery({ queryKey: [QueryKeys.MY_LESSONS], queryFn: () => getMyLessons(token) });

export const useEnrollFreeCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, courseId }: { token: string; courseId: number }) =>
      enrollFreeCourse({ token, courseId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.MY_COURSES] });
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.COURSES] });
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.COURSE_LECTURES] });
    },
  });
};

export const useEnrollFreeLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, lessonId }: { token: string; lessonId: number }) =>
      enrollFreeLesson({ token, lessonId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.MY_LESSONS] });
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.LESSONS] });
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.LESSON_LECTURES] });
    },
  });
};

export const useInitiatePayment = () =>
  useMutation({ mutationFn: initiatePayment });
