import { TCourseType, TGender } from "@/types";
import { IEducationLevel, ISubject } from "../main";

export interface ITeacher {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  description: string | null;
  experince: number | null;
  qualification: string | null;
  cv: string;
  profile_image: string;
  education_level: IEducationLevel;
  course_types: TCourseType[];
  gender: TGender;
  subjects: ISubject[];
  conversation: null;
  courses_count: number;
  lessons_count: number;
  rating: number;
}
export interface ITeacherProfileRes {
  status: boolean;
  message: null | string;
  data: ITeacher;
}

export interface IUpdateTeacherProfile {
  token: string;
  dataForm: {
    name: string;
    email: string;
    phone: string;
    course_type: string[];
    education_level_id: string;
    subjects: string[];
    gender: string;
    description?: string;
    experince: number;
    qualification: string;
    cv?: File;
    profile_image?: File;
  };
}
