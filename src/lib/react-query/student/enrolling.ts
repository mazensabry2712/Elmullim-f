import QueryKeys from "@/enums";
import {
  enrollFreeCourse,
  getMyCourses,
  initiatePayment,
  validatePromoCode,
} from "@/services/student/enrolling";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetMyCourses = (token: string, enabled = true) =>
  useQuery({
    queryKey: [QueryKeys.MY_COURSES],
    queryFn: () => getMyCourses(token),
    enabled: enabled && !!token,
  });

export const useEnrollFreeCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, courseId }: { token: string; courseId: number }) =>
      enrollFreeCourse({ token, courseId }),
    onSuccess: (_data, variables) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKeys.MY_COURSES] }),
        queryClient.invalidateQueries({ queryKey: [QueryKeys.COURSES] }),
        queryClient.invalidateQueries({ queryKey: [QueryKeys.COURSE, variables.courseId] }),
        queryClient.invalidateQueries({ queryKey: [QueryKeys.COURSE_LECTURES, variables.courseId] }),
      ]),
  });
};

export const useInitiatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initiatePayment,
    onSuccess: (response, variables) => {
      if (response.data?.payment_required === false) {
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: [QueryKeys.MY_COURSES] }),
          queryClient.invalidateQueries({ queryKey: [QueryKeys.COURSES] }),
          queryClient.invalidateQueries({ queryKey: [QueryKeys.COURSE, variables.courseId] }),
          queryClient.invalidateQueries({ queryKey: [QueryKeys.COURSE_LECTURES, variables.courseId] }),
        ]);
      }

      return undefined;
    },
  });
};


export const useValidatePromoCode = () =>
  useMutation({ mutationFn: validatePromoCode });
