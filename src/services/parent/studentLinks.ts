import axiosAPI from "@/config/axios.config";

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export interface IParentStudentLinkRequestsResponse {
  status: boolean;
  message: string | null;
  data: {
    pending_count: number;
    requests: Array<{ requested_at: string }>;
  };
}

export const getParentStudentLinkRequests = async (
  token: string,
): Promise<IParentStudentLinkRequestsResponse> => {
  const { data } = await axiosAPI.get("/parent/student-link-requests", {
    headers: authHeaders(token),
  });
  return data;
};

export const requestParentStudentLink = async ({
  token,
  studentPhone,
}: {
  token: string;
  studentPhone: string;
}): Promise<{ status: boolean; message: string | null; data?: { request_received: boolean } }> => {
  const { data } = await axiosAPI.post(
    "/parent/student-link-requests",
    { student_phone: studentPhone },
    { headers: authHeaders(token) },
  );
  return data;
};

export const unlinkParentStudent = async ({
  token,
  studentId,
}: {
  token: string;
  studentId: number;
}): Promise<{ status: boolean; message: string | null }> => {
  const { data } = await axiosAPI.delete(`/parent/students/${studentId}/link`, {
    headers: authHeaders(token),
  });
  return data;
};
