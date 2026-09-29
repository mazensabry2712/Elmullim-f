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
  updateSessionMeetingLink,
  markSessionAttendance,
} from "@/services/booking";

export const bookingKeys = {
  all: ["bookings"] as const,
  mine: () => ["bookings", "mine"] as const,
  teacher: () => ["bookings", "teacher"] as const,
  detail: (bookingId?: number) => ["booking", bookingId] as const,
  schedule: () => ["schedule", "mine"] as const,
  teacherSchedule: () => ["schedule", "teacher"] as const,
};

const invalidateBookingViews = (queryClient: ReturnType<typeof useQueryClient>, token: string, bookingId?: number) => {
  queryClient.invalidateQueries({ queryKey: bookingKeys.mine() });
  queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
  queryClient.invalidateQueries({ queryKey: bookingKeys.schedule() });
  queryClient.invalidateQueries({ queryKey: bookingKeys.teacherSchedule() });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: (_data, variables) => invalidateBookingViews(queryClient, variables.token),
  });
};

export const useGetBookings = ({ token, page = 1, enabled = true }: { token: string; page?: number; enabled?: boolean }) =>
  useQuery({
    queryKey: [...bookingKeys.mine(token), page],
    queryFn: () => getBookings({ token, page }),
    enabled: enabled && !!token,
    placeholderData: (previous) => previous,
  });

export const useGetTeacherBookings = ({ token, page = 1, enabled = true }: { token: string; page?: number; enabled?: boolean }) =>
  useQuery({
    queryKey: [...bookingKeys.teacher(), page],
    queryFn: () => getTeacherBookings({ token, page }),
    enabled: enabled && !!token,
    placeholderData: (previous) => previous,
  });

export const useGetBooking = ({ token, bookingId, enabled = true }: { token: string; bookingId?: number; enabled?: boolean }) =>
  useQuery({
    queryKey: bookingKeys.detail(bookingId),
    queryFn: () => getBooking({ token, bookingId: bookingId as number }),
    enabled: enabled && !!bookingId && !!token,
  });

export const useGetSchedule = ({ token, page = 1, enabled = true }: { token: string; page?: number; enabled?: boolean }) =>
  useQuery({
    queryKey: [...bookingKeys.schedule(token), page],
    queryFn: () => getSchedule({ token, page }),
    enabled: enabled && !!token,
    placeholderData: (previous) => previous,
  });

export const useGetTeacherSchedule = ({ token, page = 1, enabled = true }: { token: string; page?: number; enabled?: boolean }) =>
  useQuery({
    queryKey: [...bookingKeys.teacherSchedule(token), page],
    queryFn: () => getTeacherSchedule({ token, page }),
    enabled: enabled && !!token,
    placeholderData: (previous) => previous,
  });

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

export const useMarkSessionAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markSessionAttendance,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.teacherSchedule(variables.token) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.schedule(variables.token) });
    },
  });
};

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

export const useUpdateSessionMeetingLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSessionMeetingLink,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.schedule(variables.token) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.teacherSchedule(variables.token) });
    },
  });
};
