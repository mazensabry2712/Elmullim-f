import { ICreateLessonAvailabilitySlot } from "@/interfaces/lessons/availability";
import { LessonBookingType, LessonDeliveryMode } from "@/interfaces/lessons/lesson";

export interface ICreateLesson {
  education_level_id: number;
  subject_id: number;
  grade: string;
  delivery_mode: LessonDeliveryMode;
  booking_type: LessonBookingType;
  title: string;
  description: string;
  duration_minutes: number;
  price: number;
  sessions_count: number;
  meeting_url?: string;
  location?: string;
  offline_visit_type?: "teacher_to_student" | "student_to_teacher" | "";
  service_area_ids?: number[];
  max_students?: number;
  availability: ICreateLessonAvailabilitySlot[];
  logo: File;
}

export interface IUpdateLesson extends Omit<ICreateLesson, "logo" | "availability"> {
  id: number;
  logo?: File;
  availability?: ICreateLessonAvailabilitySlot[];
}
