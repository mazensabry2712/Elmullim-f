import axiosAPI from "@/config/axios.config";
import { IBooking, IBookingResponse, ICreateBooking } from "@/interfaces/bookings/booking";

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const createBooking = async ({
  token,
  lessonId,
  booking,
}: {
  token: string;
  lessonId: number;
  booking: ICreateBooking;
}): Promise<IBookingResponse> => {
  const { data } = await axiosAPI.post(`/lessons/${lessonId}/bookings`, booking, {
    headers: authHeaders(token),
  });

  return data;
};

export const getBookings = async ({ token }: { token: string }) => {
  const { data } = await axiosAPI.get<{ status: boolean; message: string | null; data: IBooking[] }>(
    "/bookings",
    { headers: authHeaders(token) }
  );

  return data;
};

export const getTeacherBookings = async ({ token }: { token: string }) => {
  const { data } = await axiosAPI.get<{ status: boolean; message: string | null; data: IBooking[] }>(
    "/teacher/bookings",
    { headers: authHeaders(token) }
  );

  return data;
};

export const getBooking = async ({
  token,
  bookingId,
}: {
  token: string;
  bookingId: number;
}): Promise<IBookingResponse> => {
  const { data } = await axiosAPI.get(`/bookings/${bookingId}`, {
    headers: authHeaders(token),
  });

  return data;
};

export const respondToBookingProposal = async ({
  token,
  bookingId,
  decision,
}: {
  token: string;
  bookingId: number;
  decision: "accept" | "reject";
}): Promise<IBookingResponse> => {
  const { data } = await axiosAPI.post(
    `/bookings/${bookingId}/respond`,
    { decision },
    { headers: authHeaders(token) }
  );

  return data;
};

export const cancelBooking = async ({
  token,
  bookingId,
}: {
  token: string;
  bookingId: number;
}): Promise<IBookingResponse> => {
  const { data } = await axiosAPI.post(
    `/bookings/${bookingId}/cancel`,
    {},
    { headers: authHeaders(token) }
  );

  return data;
};

export const acceptBooking = async ({ token, bookingId }: { token: string; bookingId: number }) => {
  const { data } = await axiosAPI.post(
    `/teacher/bookings/${bookingId}/accept`,
    {},
    { headers: authHeaders(token) }
  );

  return data as IBookingResponse;
};

export const rejectBooking = async ({
  token,
  bookingId,
  teacherNote,
}: {
  token: string;
  bookingId: number;
  teacherNote?: string;
}) => {
  const { data } = await axiosAPI.post(
    `/teacher/bookings/${bookingId}/reject`,
    teacherNote?.trim() ? { teacher_note: teacherNote.trim() } : {},
    { headers: authHeaders(token) }
  );

  return data as IBookingResponse;
};

export const proposeBookingTime = async ({
  token,
  bookingId,
  proposedStartAt,
  teacherNote,
}: {
  token: string;
  bookingId: number;
  proposedStartAt: string;
  teacherNote?: string;
}) => {
  const { data } = await axiosAPI.post(
    `/teacher/bookings/${bookingId}/propose`,
    {
      proposed_start_at: proposedStartAt,
      ...(teacherNote?.trim() ? { teacher_note: teacherNote.trim() } : {}),
    },
    { headers: authHeaders(token) }
  );

  return data as IBookingResponse;
};
