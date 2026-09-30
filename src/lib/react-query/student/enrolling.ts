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
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.MY_COURSES] });
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.COURSES] });
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.COURSE_LECTURES] });
    },
  });
};

export const useInitiatePayment = () =>
  useMutation({ mutationFn: initiatePayment });


export const useValidatePromoCode = () =>
  useMutation({ mutationFn: validatePromoCode });
