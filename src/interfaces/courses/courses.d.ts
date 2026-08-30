import { ISubCategory } from "@/interfaces/main";
import { TLevel } from "@/types";
import { ITeacher } from "../teachers/teacherProfile";

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
