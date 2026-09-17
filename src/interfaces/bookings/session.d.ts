export type SessionStatus = "upcoming" | "in_progress" | "completed" | "cancelled";

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
