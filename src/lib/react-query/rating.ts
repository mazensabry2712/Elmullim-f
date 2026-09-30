import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "@/enums";
import {
  getGivenRatings,
  RatingActorRole,
  submitRating,
} from "@/services/rating";

export const ratingKeys = {
  given: (role: RatingActorRole, bookingIds: number[] = []) =>
    ["ratings", "given", role, [...bookingIds].sort((a, b) => a - b)] as const,
  givenBase: (role: RatingActorRole) => ["ratings", "given", role] as const,
};

export const useGetGivenRatings = (
  token: string,
  role: RatingActorRole,
  enabled = true,
  bookingIds: number[] = [],
) =>
  useQuery({
    queryKey: ratingKeys.given(role, bookingIds),
    queryFn: () => getGivenRatings({ token, role, bookingIds }),
    enabled: enabled && !!token,
    staleTime: 30_000,
  });

export const useSubmitRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitRating,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ratingKeys.givenBase(variables.actorRole),
      });
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.STUDENTS_RATING] });
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.TEACHER_RATINGS] });
      void queryClient.invalidateQueries({ queryKey: ["schedule", "mine"] });
      void queryClient.invalidateQueries({ queryKey: ["schedule", "teacher"] });
    },
  });
};
