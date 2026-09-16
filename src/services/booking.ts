import axiosAPI from "@/config/axios.config";
import { IBookingResponse, ICreateBooking } from "@/interfaces/bookings/booking";

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
  const { data } = await axiosAPI.post(
    `/lessons/${lessonId}/bookings`,
    booking,
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
