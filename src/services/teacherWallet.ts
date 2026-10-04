import axiosAPI from "@/config/axios.config";

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export type TeacherWallet = {
  total: number;
  lesson_enrollments: number;
  course_enrollments: number;
  withdrawn: number;
};

export type TeacherPayout = {
  id: number;
  amount: number | string;
  created_at: string;
  updated_at: string;
  status: string;
  transaction_id: number | null;
  client_reference_id: string;
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

export const getTeacherWallet = async (token: string): Promise<{ status: boolean; message: string | null; data: TeacherWallet }> => {
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
