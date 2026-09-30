import axiosAPI from "@/config/axios.config";
import { IBooking, IBookingResponse, ICreateBooking } from "@/interfaces/bookings/booking";
import { IBookingSession } from "@/interfaces/bookings/session";

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  has_more_pages: boolean;
};

export type PaginatedResponse<T> = {
  status: boolean;
  message: string | null;
  data: T[];
  meta: PaginationMeta;
};

export type BookingPaymentMethod = "card" | "fawry" | "wallet";

const pageConfig = (token: string, page: number) => ({
  headers: authHeaders(token),
  ...(page > 1 ? { params: { page } } : {}),
});

export const createBooking = async ({ token, lessonId, booking }: {
  token: string;
  lessonId: number;
  booking: ICreateBooking;
}): Promise<IBookingResponse> => {
  const { data } = await axiosAPI.post(`/lessons/${lessonId}/bookings`, booking, { headers: authHeaders(token) });
  return data;
};

export const getBookings = async ({ token, page = 1 }: { token: string; page?: number }): Promise<PaginatedResponse<IBooking>> => {
  const { data } = await axiosAPI.get("/bookings", pageConfig(token, page));
  return data;
};

export const getTeacherBookings = async ({ token, page = 1 }: { token: string; page?: number }): Promise<PaginatedResponse<IBooking>> => {
  const { data } = await axiosAPI.get("/teacher/bookings", pageConfig(token, page));
  return data;
};

export const getBooking = async ({ token, bookingId }: { token: string; bookingId: number }): Promise<IBookingResponse> => {
  const { data } = await axiosAPI.get(`/bookings/${bookingId}`, { headers: authHeaders(token) });
  return data;
};

export const respondToBookingProposal = async ({ token, bookingId, decision }: {
  token: string;
  bookingId: number;
  decision: "accept" | "reject";
}): Promise<IBookingResponse> => {
  const { data } = await axiosAPI.post(`/bookings/${bookingId}/respond`, { decision }, { headers: authHeaders(token) });
  return data;
};

export const cancelBooking = async ({ token, bookingId }: { token: string; bookingId: number }): Promise<IBookingResponse> => {
  const { data } = await axiosAPI.post(`/bookings/${bookingId}/cancel`, {}, { headers: authHeaders(token) });
  return data;
};

export const acceptBooking = async ({ token, bookingId }: { token: string; bookingId: number }): Promise<IBookingResponse> => {
  const { data } = await axiosAPI.post(`/teacher/bookings/${bookingId}/accept`, {}, { headers: authHeaders(token) });
  return data;
};

export const rejectBooking = async ({ token, bookingId, teacherNote }: {
  token: string;
  bookingId: number;
  teacherNote?: string;
}): Promise<IBookingResponse> => {
  const { data } = await axiosAPI.post(
    `/teacher/bookings/${bookingId}/reject`,
    teacherNote?.trim() ? { teacher_note: teacherNote.trim() } : {},
    { headers: authHeaders(token) }
  );
  return data;
};

export const proposeBookingTime = async ({ token, bookingId, proposedStartAt, teacherNote }: {
  token: string;
  bookingId: number;
  proposedStartAt: string;
  teacherNote?: string;
}): Promise<IBookingResponse> => {
  const { data } = await axiosAPI.post(
    `/teacher/bookings/${bookingId}/propose`,
    { proposed_start_at: proposedStartAt, ...(teacherNote?.trim() ? { teacher_note: teacherNote.trim() } : {}) },
    { headers: authHeaders(token) }
  );
  return data;
};

export const initiateBookingPayment = async ({ token, bookingId, paymentMethod, isParent = false }: {
  token: string;
  bookingId: number;
  paymentMethod: BookingPaymentMethod;
  isParent?: boolean;
}) => {
  const endpoint = isParent ? "/parent/payment/booking/initiate" : "/student/payment/booking/initiate";
  const { data } = await axiosAPI.post(
    endpoint,
    { booking_id: bookingId, payment_method: paymentMethod },
    { headers: authHeaders(token) }
  );
  return data as {
    status: boolean;
    message: string | null;
    data?: {
      redirect_url?: string | null;
      original_amount?: number;
      discount_amount?: number;
      final_amount?: number;
      coupon_code?: string | null;
    };
  };
};

export const getSchedule = async ({ token, page = 1 }: { token: string; page?: number }): Promise<PaginatedResponse<IBookingSession>> => {
  const { data } = await axiosAPI.get("/schedule", pageConfig(token, page));
  return data;
};

export const getTeacherSchedule = async ({ token, page = 1 }: { token: string; page?: number }): Promise<PaginatedResponse<IBookingSession>> => {
  const { data } = await axiosAPI.get("/teacher/schedule", pageConfig(token, page));
  return data;
};

export const joinBookingSession = async ({ token, bookingId }: { token: string; bookingId: number }) => {
  const { data } = await axiosAPI.post(`/bookings/${bookingId}/join`, {}, { headers: authHeaders(token) });
  return data as {
    status: boolean;
    message: string | null;
    data?: { session_id: number; meeting_url?: string | null; location?: string | null; start_at: string; end_at: string };
  };
};

export const updateSessionMeetingLink = async ({ token, sessionId, meetingUrl }: {
  token: string;
  sessionId: number;
  meetingUrl: string;
}) => {
  const { data } = await axiosAPI.put(
    "/teacher/sessions/" + sessionId + "/meeting-link",
    { meeting_url: meetingUrl.trim() },
    { headers: authHeaders(token) }
  );
  return data as { status: boolean; message: string | null; data?: IBookingSession };
};

export const updateSessionStatus = async ({ token, sessionId, status }: {
  token: string;
  sessionId: number;
  status: "in_progress" | "completed" | "cancelled";
}) => {
  const { data } = await axiosAPI.post(`/teacher/sessions/${sessionId}/status`, { status }, { headers: authHeaders(token) });
  return data;
};

export const markSessionAttendance = async ({ token, sessionId, bookingId, status, note }: {
  token: string;
  sessionId: number;
  bookingId: number;
  status: "present" | "absent" | "no_show" | "excused";
  note?: string;
}) => {
  const { data } = await axiosAPI.post(
    `/teacher/sessions/${sessionId}/attendance`,
    { booking_id: bookingId, status, ...(note?.trim() ? { note: note.trim() } : {}) },
    { headers: authHeaders(token) }
  );
  return data;
};
