import { TGender } from "@/types";
import { IEducationLevel, IFavoriteSubject } from "../main";

export interface IStudentProfile {
  id?: number;
  name: string;
  phone: string;
  address: string | null;
  email: string;
  gender: TGender;
  profile_image: string;
  description: string | null;
  education_level: IEducationLevel;
  favourite_subjects: IFavoriteSubject[];
  latitude?: string | number | null;
  longitude?: string | number | null;
  location_updated_at?: string | null;
}

export interface IStudentProfileRes {
  status: boolean;
  data: IStudentProfile;
  message: null | string;
}

export interface IUpdateStudentProfile {
  token: string;
  dataForm: {
    email: string;
    name: string;
    phone: string;
    address: string;
    education_level_id: string;
    gender: string;
    description?: string;
    profile_image?: File;
    favourite_subjects?: string[];
  };
}

export interface IRating {
  rateable: {
    id: number;
    type: string;
    name: string;
    image: string | null;
  };
  rate: number;
  description: string;
  created_at: string;
}

export interface IRatingRes {
  status: boolean;
  data: IRating[];
  message: null | string;
}
