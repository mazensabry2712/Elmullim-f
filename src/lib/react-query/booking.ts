import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptBooking,
  cancelBooking,
  createBooking,
  getBooking,
  getBookings,
  getTeacherBookings,
  proposeBookingTime,
  rejectBooking,
  respondToBookingProposal,
} from "@/services/booking";

export const bookingKeys = {
  all: ["bookings"] as const,
  mine: (token: string) => ["bookings", "mine", token] as const,
  teacher: (token: string) => ["bookings", "teacher", token] as const,
  detail: (bookingId?: number) => ["booking", bookingId] as const,
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.mine(variables.token) });
    },
  });
};

export const useGetBookings = ({ token, enabled = true }: { token: string; enabled?: boolean }) =>
  useQuery({
    queryKey: bookingKeys.mine(token),
    queryFn: () => getBookings({ token }),
    enabled: enabled && !!token,
  });

export const useGetTeacherBookings = ({ token, enabled = true }: { token: string; enabled?: boolean }) =>
  useQuery({
    queryKey: bookingKeys.teacher(token),
    queryFn: () => getTeacherBookings({ token }),
    enabled: enabled && !!token,
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
    queryKey: bookingKeys.detail(bookingId),
    queryFn: () => getBooking({ token, bookingId: bookingId as number }),
    enabled: enabled && !!bookingId && !!token,
  });

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.mine(variables.token) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.bookingId) });
    },
  });
};

export const useRespondToBookingProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: respondToBookingProposal,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.mine(variables.token) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.bookingId) });
    },
  });
};

export const useAcceptBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptBooking,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.teacher(variables.token) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.bookingId) });
    },
  });
};

export const useRejectBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectBooking,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.teacher(variables.token) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.bookingId) });
    },
  });
};

export const useProposeBookingTime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: proposeBookingTime,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.teacher(variables.token) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.bookingId) });
    },
  });
};
