import { TRole } from "@/types";

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface ICheckAuth {
  status: boolean;
  message: string | null;
  data: {
    auth: boolean;
    "email-verified": boolean;
    role: TRole;
  };
}

export interface ILoginRes {
  status: boolean;
  message: string;
  data: {
    token: string;
  };
}

export interface IStudentRegister {
  email: string;
  password: string;
  name: string;
  address: string;
  phone: string;
  education_level_id: string;
  gender: string;
}

export interface IParentRegister {
  email: string;
  password: string;
  name: string;
  education_level_id: string;
  phone: string;
  students: string[];
  gender: string;
}

export interface ITeacherRegister {
  email: string;
  password: string;
  name: string;
  phone: string;
  course_type: string[];
  education_level_id: string;
  subjects: string[];
  gender: string;
}

export interface IUpdatePassword {
  token: string;
  password: string;
  password_confirmation: string;
  role: TRole;
}

export interface IResetPassword {
  role: TRole;
  code: string;
  password: string;
  password_confirmation: string;
}
