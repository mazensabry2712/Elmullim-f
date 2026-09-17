import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptBooking,
  cancelBooking,
  createBooking,
  getBooking,
  getBookings,
  getTeacherBookings,
  getSchedule,
  getTeacherSchedule,
  initiateBookingPayment,
  proposeBookingTime,
  rejectBooking,
  respondToBookingProposal,
  updateSessionStatus,
} from "@/services/booking";

export const bookingKeys = {
  all: ["bookings"] as const,
  mine: (token: string) => ["bookings", "mine", token] as const,
  teacher: (token: string) => ["bookings", "teacher", token] as const,
  detail: (bookingId?: number) => ["booking", bookingId] as const,
  schedule: (token: string) => ["schedule", "mine", token] as const,
  teacherSchedule: (token: string) => ["schedule", "teacher", token] as const,
};

const invalidateBookingViews = (queryClient: ReturnType<typeof useQueryClient>, token: string, bookingId?: number) => {
  queryClient.invalidateQueries({ queryKey: bookingKeys.mine(token) });
  queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
  queryClient.invalidateQueries({ queryKey: bookingKeys.schedule(token) });
  queryClient.invalidateQueries({ queryKey: bookingKeys.teacherSchedule(token) });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: (_data, variables) => invalidateBookingViews(queryClient, variables.token),
  });
};

export const useGetBookings = ({ token, enabled = true }: { token: string; enabled?: boolean }) =>
  useQuery({ queryKey: bookingKeys.mine(token), queryFn: () => getBookings({ token }), enabled: enabled && !!token });

export const useGetTeacherBookings = ({ token, enabled = true }: { token: string; enabled?: boolean }) =>
  useQuery({ queryKey: bookingKeys.teacher(token), queryFn: () => getTeacherBookings({ token }), enabled: enabled && !!token });

export const useGetBooking = ({ token, bookingId, enabled = true }: { token: string; bookingId?: number; enabled?: boolean }) =>
  useQuery({
    queryKey: bookingKeys.detail(bookingId),
    queryFn: () => getBooking({ token, bookingId: bookingId as number }),
    enabled: enabled && !!bookingId && !!token,
  });

export const useGetSchedule = ({ token, enabled = true }: { token: string; enabled?: boolean }) =>
  useQuery({ queryKey: bookingKeys.schedule(token), queryFn: () => getSchedule({ token }), enabled: enabled && !!token });

export const useGetTeacherSchedule = ({ token, enabled = true }: { token: string; enabled?: boolean }) =>
  useQuery({ queryKey: bookingKeys.teacherSchedule(token), queryFn: () => getTeacherSchedule({ token }), enabled: enabled && !!token });

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: (_data, variables) => invalidateBookingViews(queryClient, variables.token, variables.bookingId),
  });
};

export const useRespondToBookingProposal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: respondToBookingProposal,
    onSuccess: (_data, variables) => invalidateBookingViews(queryClient, variables.token, variables.bookingId),
  });
};

export const useAcceptBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptBooking,
    onSuccess: (_data, variables) => invalidateBookingViews(queryClient, variables.token, variables.bookingId),
  });
};

export const useRejectBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectBooking,
    onSuccess: (_data, variables) => invalidateBookingViews(queryClient, variables.token, variables.bookingId),
  });
};

export const useProposeBookingTime = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: proposeBookingTime,
    onSuccess: (_data, variables) => invalidateBookingViews(queryClient, variables.token, variables.bookingId),
  });
};

export const useInitiateBookingPayment = () => useMutation({ mutationFn: initiateBookingPayment });

export const useUpdateSessionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSessionStatus,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.mine(variables.token) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.schedule(variables.token) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.teacherSchedule(variables.token) });
    },
  });
};
