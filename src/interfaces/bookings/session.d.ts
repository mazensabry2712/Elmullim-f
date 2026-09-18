export type SessionStatus = "upcoming" | "in_progress" | "completed" | "cancelled";
export type AttendanceStatus = "present" | "absent" | "no_show" | "excused";

export interface IAttendance {
  id: number;
  session_id: number;
  booking_id: number;
  student_id: number;
  status: AttendanceStatus;
  note?: string | null;
  marked_at?: string | null;
  student?: { id: number; name?: string };
}

export interface IBookingSession {
  id: number;
  lesson_id: number;
  start_at: string;
  end_at: string;
  status: SessionStatus;
  meeting_url?: string | null;
  location?: string | null;
  lesson?: {
    id: number;
    title?: string;
  };
  bookings?: Array<{
    id: number;
    student_id: number;
    student?: { id: number; name?: string };
    status?: string;
  }>;
}
