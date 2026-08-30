import QueryKeys from "@/enums";
import { IUpdateParentProfile } from "@/interfaces/parents/parentProfile";
import {
  getParentProfile,
  updateParentProfile,
} from "@/services/parent/parentProfile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetParentProfile = (token: string) =>
  useQuery({
    queryKey: [QueryKeys.PROFILE],
    queryFn: () => getParentProfile(token),
  });

export const useUpdateParentProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, dataForm }: IUpdateParentProfile) =>
      updateParentProfile({ token, dataForm }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.PROFILE],
      });
    },
  });
};
