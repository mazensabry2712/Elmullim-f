export type BookingStatus =
  | "booking_requested"
  | "pending_teacher_approval"
  | "accepted"
  | "confirmed"
  | "upcoming"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "rejected"
  | "rescheduled"
  | "no_show"
  | "disputed";

export interface IBookingRelation {
  id: number;
  name?: string;
  title?: string;
  email?: string;
  price?: string | number;
}

export interface IBooking {
  id: number;
  lesson_id: number;
  student_id: number;
  booked_by_type: string;
  booked_by_id: number;
  booking_type: "private" | "group";
  status: BookingStatus;
  requested_start_at: string;
  proposed_start_at?: string | null;
  confirmed_start_at?: string | null;
  duration_minutes?: number | null;
  price: string;
  customer_note?: string | null;
  teacher_note?: string | null;
  lesson?: IBookingRelation;
  student?: IBookingRelation;
  booked_by?: IBookingRelation;
}

export interface IBookingResponse {
  status: boolean;
  message: string | null;
  data: IBooking;
}

export interface IBookingListResponse {
  status: boolean;
  message: string | null;
  data: IBooking[];
}

export interface ICreateBooking {
  student_id: number;
  requested_start_at: string;
  customer_note?: string;
}
