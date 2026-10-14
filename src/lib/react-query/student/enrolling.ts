import QueryKeys from "@/enums";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  enrollFreeCourse,
  getMyCourses,
  initiatePayment,
  validatePromoCode,
} from "@/services/student/enrolling";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useEnrollmentSessionScope = () =>
  useSelector((state: RootState) =>
    `${state.auth.sessionVersion}:${state.auth.isAuthenticated ? state.auth.role ?? "authenticated" : "guest"}`
  );

export const useGetMyCourses = (token: string, enabled = true) => {
  const sessionScope = useEnrollmentSessionScope();

  return useQuery({
    queryKey: [QueryKeys.MY_COURSES, sessionScope],
    queryFn: () => getMyCourses(token),
    enabled: enabled && !!token,
  });
};

export const useEnrollFreeCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, courseId }: { token: string; courseId: number }) =>
      enrollFreeCourse({ token, courseId }),
    onSuccess: (_data, variables) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKeys.MY_COURSES] }),
        queryClient.invalidateQueries({ queryKey: [QueryKeys.COURSES] }),
        queryClient.invalidateQueries({ queryKey: [QueryKeys.SUB_CATEGORY_COURSES] }),
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
          queryClient.invalidateQueries({ queryKey: [QueryKeys.SUB_CATEGORY_COURSES] }),
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
