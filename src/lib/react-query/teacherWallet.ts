import { useQuery } from "@tanstack/react-query";
import {
  getTeacherPayouts,
  getTeacherWallet,
} from "@/services/teacherWallet";

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
