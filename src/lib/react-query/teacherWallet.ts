import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTeacherPayout,
  getTeacherPayouts,
  getTeacherWallet,
} from "@/services/teacherWallet";
import type { CreateTeacherPayoutPayload } from "@/services/teacherWallet";

export const teacherWalletKeys = {
  wallet: () => ["teacher-wallet"] as const,
  payouts: () => ["teacher-payouts"] as const,
};

export const useGetTeacherWallet = ({
  token,
  enabled = true,
}: {
  token: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: teacherWalletKeys.wallet(),
    queryFn: () => getTeacherWallet(token),
    enabled: enabled && !!token,
    staleTime: 30_000,
  });

export const useGetTeacherPayouts = ({
  token,
  page = 1,
  enabled = true,
}: {
  token: string;
  page?: number;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: [...teacherWalletKeys.payouts(), page],
    queryFn: () => getTeacherPayouts(token, page),
    enabled: enabled && !!token,
    placeholderData: (previous) => previous,
  });

export const useCreateTeacherPayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      payload,
    }: {
      token: string;
      payload: CreateTeacherPayoutPayload;
    }) => createTeacherPayout({ token, payload }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: teacherWalletKeys.wallet() }),
        queryClient.invalidateQueries({ queryKey: teacherWalletKeys.payouts() }),
      ]);
    },
  });
};
