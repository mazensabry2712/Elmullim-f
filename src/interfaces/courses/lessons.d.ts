import { ITeacher } from "../teachers/teacherProfile";

export interface ILesson {
  id: number;
  price: string;
  title: string;
  hasEnrolled: boolean | null;
  logo: string | null;
  description: string;
  teacher: ITeacher;
  subject_id?: number | null;
  grade?: string | null;
  delivery_mode?: "online" | "offline";
  booking_type?: "private" | "group";
  duration_minutes?: number | null;
  sessions_count?: number;
  meeting_url?: string | null;
  location?: string | null;
  offline_visit_type?: string | null;
  max_students?: number | null;
  publishing_status?: "draft" | "pending_approval" | "published" | "rejected" | "unpublished";
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

export interface IGetLessonLecture {
  id?: string;
  token: string;
  contentId: string;
  lessonId: string;
}
