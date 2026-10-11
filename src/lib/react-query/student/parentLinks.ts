import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import QueryKeys from "@/enums";
import {
  getStudentParentLinks,
  respondToStudentParentLink,
  unlinkStudentParent,
} from "@/services/student/parentLinks";

export const studentParentLinksQueryKey = ["student", "parent-links"] as const;

export const useGetStudentParentLinks = (token: string, enabled = true) =>
  useQuery({
    queryKey: studentParentLinksQueryKey,
    queryFn: () => getStudentParentLinks(token),
    enabled: enabled && !!token,
    staleTime: 5_000,
  });

const useInvalidateParentLinks = () => {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: studentParentLinksQueryKey });
    void queryClient.invalidateQueries({ queryKey: [QueryKeys.PROFILE] });
  };
};

export const useRespondToStudentParentLink = () => {
  const invalidate = useInvalidateParentLinks();
  return useMutation({
    mutationFn: respondToStudentParentLink,
    onSuccess: invalidate,
  });
};

export const useUnlinkStudentParent = () => {
  const invalidate = useInvalidateParentLinks();
  return useMutation({
    mutationFn: unlinkStudentParent,
    onSuccess: invalidate,
  });
};
