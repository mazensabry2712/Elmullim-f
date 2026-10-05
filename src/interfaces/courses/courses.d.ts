import { ISubCategory } from "@/interfaces/main";
import { TLevel } from "@/types";
import { ITeacher } from "../teachers/teacherProfile";

export type CoursePublishingStatus = "draft" | "pending_approval" | "published" | "rejected";

export interface ICourse {
  id: number;
  title: string;
  description: string;
  image: string;
  level: TLevel;
  price: string;
  sub_category: ISubCategory;
  created_at: string;
  updated_at: string;
  hasEnrolled: null | boolean;
  teacher: ITeacher;
  publishing_status: CoursePublishingStatus;
  publishing_note: string | null;
}

export interface ICourseRes {
  status: boolean;
  message: null | string;
  data: ICourse;
}

export interface ICoursesRes {
  status: boolean;
  message: null | string;
  data: ICourse[];
}
