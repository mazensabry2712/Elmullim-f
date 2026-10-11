import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "@/enums";
import {
  getParentStudentLinkRequests,
  requestParentStudentLink,
  unlinkParentStudent,
} from "@/services/parent/studentLinks";

export const parentStudentLinkQueryKey = ["parent", "student-link-requests"] as const;

export const useGetParentStudentLinkRequests = (token: string, enabled = true) =>
  useQuery({
    queryKey: parentStudentLinkQueryKey,
    queryFn: () => getParentStudentLinkRequests(token),
    enabled: enabled && !!token,
    staleTime: 5_000,
  });

export const useRequestParentStudentLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestParentStudentLink,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: parentStudentLinkQueryKey });
    },
  });
};

export const useUnlinkParentStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unlinkParentStudent,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.PROFILE] });
      void queryClient.invalidateQueries({ queryKey: parentStudentLinkQueryKey });
    },
  });
};
