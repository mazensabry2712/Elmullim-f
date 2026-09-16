import { useMutation, useQuery } from "@tanstack/react-query";
import { createBooking, getBooking } from "@/services/booking";

export const useCreateBooking = () =>
  useMutation({
    mutationFn: createBooking,
  });

export const useGetBooking = ({
  token,
  bookingId,
  enabled = true,
}: {
  token: string;
  bookingId?: number;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking({ token, bookingId: bookingId as number }),
    enabled: enabled && !!bookingId && !!token,
  });
