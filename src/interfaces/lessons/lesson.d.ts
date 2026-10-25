import { ITeacher } from "../teachers/teacherProfile";
import { ILessonAvailabilitySlot } from "./availability";
import { IServiceAreaListItem } from "../teacher/serviceAreas";

export type LessonDeliveryMode = "online" | "offline";
export type LessonBookingType = "private" | "group";
export type LessonPublishingStatus =
  | "draft"
  | "pending_approval"
  | "published"
  | "rejected"
  | "unpublished";

export type LessonOperationalStatus =
  | "available"
  | "scheduled"
  | "full"
  | "booking_expired"
  | "ended"
  | "not_published";

/**
 * Public lesson-domain contract.
 *
 * A Lesson is an educational offering created by a teacher. It is not a
 * Course enrollment record; a student's participation is represented by a
 * Booking.
 */
export interface ILesson {
  id: number;
  teacher: ITeacher;
  education_level_id?: number | null;
  education_level_name?: string | null;
  subject_id?: number | null;
  subject_name?: string | null;
  grade?: string | null;
  title: string;
  description: string;
  logo: string | null;
  /** Average public rating for this specific lesson, not the teacher. */
  rating_average?: number | null;
  /** Number of completed-booking ratings for this specific lesson. */
  rating_count?: number;
  price: string;
  delivery_mode?: LessonDeliveryMode;
  booking_type?: LessonBookingType;
  duration_minutes?: number | null;
  sessions_count?: number;
  meeting_url?: string | null;
  /** @deprecated Physical lesson location is derived from the teacher/student profile or service areas. */
  location?: string | null;
  offline_visit_type?: "teacher_to_student" | "student_to_teacher" | null;
  service_areas?: IServiceAreaListItem[];
  max_students?: number | null;
  publishing_status?: LessonPublishingStatus;
  publishing_note?: string | null;
  booking_opens_at?: string | null;
  booking_closes_at?: string | null;
  ends_at?: string | null;
  operational_status?: LessonOperationalStatus;
  is_bookable?: boolean;
  seats_remaining?: number | null;
  location_match?: {
    eligible: boolean;
    distance_km: number;
  } | null;
  bookings_count?: number;
  active_bookings_count?: number;
  availability?: ILessonAvailabilitySlot[];
  created_at: string;
  updated_at: string;
}

export interface ILessonRes {
  status: boolean;
  message: string | null;
  data: ILesson;
}

export interface ITeacherLessonListItem extends Omit<ILesson, "teacher"> {
  teacher?: ITeacher;
  availability_count?: number;
  service_area_count?: number;
}

export interface ILessonsRes {
  status: boolean;
  message: string | null;
  data: ILesson[];
}

export interface ITeacherLessonsRes {
  status: boolean;
  message: string | null;
  data: ITeacherLessonListItem[];
}
