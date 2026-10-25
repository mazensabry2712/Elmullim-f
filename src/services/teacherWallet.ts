import axiosAPI from "@/config/axios.config";

const authHeaders = (token: string) => ({
  Authorization: "Bearer " + token,
});

export type TeacherPayoutMethod = "wallet" | "bank_card" | "instant_bank" | "post";

export type TeacherWallet = {
  total: number;
  lesson_enrollments: number;
  course_enrollments: number;
  withdrawn: number;
  reserved?: number;
  available_balance?: number;
  payouts_enabled?: boolean;
};

export type TeacherPayout = {
  id: number;
  amount: number | string;
  created_at: string;
  updated_at: string;
  status: string;
  transaction_id: string | number | null;
  client_reference_id: string | null;
  payout_method?: TeacherPayoutMethod | string;
};

export type CreateTeacherPayoutPayload = {
  amount: number;
  payout_method: TeacherPayoutMethod;
  wallet_issuer?: "vodafone" | "etisalat" | "orange" | "bank_wallet";
  wallet_number?: string;
  full_name?: string;
  bank_card_number?: string;
  bank_code?: string;
  national_id?: string;
};

export type CreateTeacherPayoutResponse = {
  status: boolean;
  message: unknown;
  data?: TeacherPayout;
};

export type TeacherPayoutsResponse = {
  status: boolean;
  message: string | null;
  data: TeacherPayout[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    has_more_pages: boolean;
  };
};

export const getTeacherWallet = async (
  token: string,
): Promise<{ status: boolean; message: string | null; data: TeacherWallet }> => {
  const { data } = await axiosAPI.get("/teacher/wallet", {
    headers: authHeaders(token),
  });

  return data;
};

export const getTeacherPayouts = async (
  token: string,
  page = 1,
): Promise<TeacherPayoutsResponse> => {
  const { data } = await axiosAPI.get("/teacher/payouts", {
    headers: authHeaders(token),
    ...(page > 1 ? { params: { page } } : {}),
  });

  return data;
};

export const createTeacherPayout = async ({
  token,
  payload,
}: {
  token: string;
  payload: CreateTeacherPayoutPayload;
}): Promise<CreateTeacherPayoutResponse> => {
  const { data } = await axiosAPI.post("/teacher/payouts", payload, {
    headers: authHeaders(token),
  });

  return data;
};
