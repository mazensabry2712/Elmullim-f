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
  offline_visit_type?: string;
  max_students?: number;
  logo: File;
}

export interface IUpdateLesson extends Omit<ICreateLesson, "logo"> {
  id: number;
  logo?: File;
}

export interface IDeleteLessonLecture {
  token: string;
  id: string;
  contentId: string;
  lessonId: string;
}

export interface IUploadLessonVideo {
  token: string;
  video: File;
  lessonId: string;
  contentId: string;
  lectureId: string;
}
