import { ITeacher } from "../teachers/teacherProfile";

export type LessonDeliveryMode = "online" | "offline";
export type LessonBookingType = "private" | "group";
export type LessonPublishingStatus =
  | "draft"
  | "pending_approval"
  | "published"
  | "rejected"
  | "unpublished";

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
  subject_id?: number | null;
  grade?: string | null;
  title: string;
  description: string;
  logo: string | null;
  price: string;
  delivery_mode?: LessonDeliveryMode;
  booking_type?: LessonBookingType;
  duration_minutes?: number | null;
  sessions_count?: number;
  meeting_url?: string | null;
  location?: string | null;
  offline_visit_type?: string | null;
  max_students?: number | null;
  publishing_status?: LessonPublishingStatus;
  created_at: string;
  updated_at: string;
}

export interface ILessonRes {
  status: boolean;
  message: string | null;
  data: ILesson;
}

export interface ILessonsRes {
  status: boolean;
  message: string | null;
  data: ILesson[];
}
