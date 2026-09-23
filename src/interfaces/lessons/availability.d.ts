export interface ILessonBookingOption {
  slot_id: number;
  local_time: string;
  requested_start_at: string;
  available_seats: number | null;
  is_available: boolean;
  timezone: string;
}

export interface ILessonAvailabilitySlot {
  id: number;
  lesson_id?: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  timezone: string;
  is_active: boolean;
  booking_options?: ILessonBookingOption[];
}

export interface ILessonAvailabilityRes {
  status: boolean;
  message: string | null;
  data: ILessonAvailabilitySlot[];
}

export interface ILessonBookingOptionsRes {
  status: boolean;
  message: string | null;
  data: ILessonBookingOption[];
}

export interface ITeacherAvailabilityBlock {
  id: number;
  teacher_id: number;
  starts_at: string;
  ends_at: string;
  reason: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ITeacherAvailabilityBlocksRes {
  status: boolean;
  message: string | null;
  data: ITeacherAvailabilityBlock[];
}

export interface ICreateLessonAvailabilitySlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  timezone: string;
}
