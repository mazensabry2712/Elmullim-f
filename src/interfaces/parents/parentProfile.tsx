import { TGender } from "@/types";
import { IEducationLevel } from "../main";
import { IStudentProfile } from "../students/studentProfile";

export interface IParentProfile {
  name: string;
  email: string;
  gender: TGender;
  description: string | null;
  phone: string;
  profile_image: string;
  education_level: IEducationLevel;
  students: IStudentProfile[];
}
export interface IParentProfileRes {
  status: boolean;
  message: string | null;
  data: IParentProfile;
}

export interface IUpdateParentProfile {
  token: string;
  dataForm: {
    name: string;
    email: string;
    gender: string;
    description?: string;
    phone: string;
    profile_image?: File;
    country_id: string;
    education_system_id: string;
    education_level_id: string;
  };
}

