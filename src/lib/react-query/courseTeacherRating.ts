import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import QueryKeys from "@/enums";
import {
  getCourseTeacherRatingStatus,
  submitCourseTeacherRating,
} from "@/services/courseTeacherRating";

const useRatingSessionScope = () =>
  useSelector((state: RootState) =>
    String(state.auth.sessionVersion) + ":" +
    (state.auth.isAuthenticated ? state.auth.role ?? "authenticated" : "guest")
  );

export const courseTeacherRatingKeys = {
  status: (courseId: number, sessionScope: string) =>
    ["course-teacher-rating", courseId, sessionScope] as const,
};

export const useCourseTeacherRatingStatus = ({
  token,
  courseId,
}: {
  token: string;
  courseId: number;
}) => {
  const sessionScope = useRatingSessionScope();

  return useQuery({
    queryKey: courseTeacherRatingKeys.status(courseId, sessionScope),
    queryFn: () => getCourseTeacherRatingStatus({ token, courseId }),
    enabled: !!token && courseId > 0,
    staleTime: 15_000,
  });
};

export const useSubmitCourseTeacherRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitCourseTeacherRating,
    onSuccess: (_response, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["course-teacher-rating", variables.courseId],
      });
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.COURSE, variables.courseId],
      });
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.TEACHER_RATINGS],
      });
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.STUDENTS_RATING],
      });
    },
  });
};
