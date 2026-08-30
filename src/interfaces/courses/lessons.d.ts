import { ITeacher } from "../teachers/teacherProfile";

export interface ILesson {
  id: number;
  price: string;
  title: string;
  hasEnrolled: null;
  logo: string | null;
  description: string;
  teacher: ITeacher;
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
