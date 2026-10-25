import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import QueryKeys from "@/enums";
import {
  getLessonRatingStatus,
  submitLessonRating,
} from "@/services/lessonRating";

const useRatingSessionScope = () =>
  useSelector((state: RootState) =>
    String(state.auth.sessionVersion) + ":" +
    (state.auth.isAuthenticated ? state.auth.role ?? "authenticated" : "guest")
  );

export const useLessonRatingStatus = ({
  token,
  lessonId,
  enabled,
}: {
  token: string;
  lessonId: number;
  enabled: boolean;
}) => {
  const sessionScope = useRatingSessionScope();

  return useQuery({
    queryKey: ["lesson-rating", lessonId, sessionScope],
    queryFn: () => getLessonRatingStatus({ token, lessonId }),
    enabled: enabled && !!token && lessonId > 0,
    staleTime: 15_000,
  });
};

export const useSubmitLessonRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitLessonRating,
    onSuccess: (_response, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["lesson-rating", variables.lessonId],
      });
      void queryClient.invalidateQueries({
        queryKey: [QueryKeys.LESSON, variables.lessonId],
      });
    },
  });
};
