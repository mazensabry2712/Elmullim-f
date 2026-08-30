import { TGender, TRole, TUserSearchType } from "@/types";
import { ICategory } from "./main.d";
export interface ICountry {
  id: number;
  name: string;
  code: string;
}

export interface ICountriesRes {
  status: boolean;
  data: ICountry[];
}

export interface IEducationSystem {
  id: number;
  name: string;
  country: ICountry;
}

export interface IEducationSystemsRes {
  status: boolean;
  data: IEducationSystem[];
}

export interface IEducationLevel {
  id: number;
  name: string;
  description: string;
  education_system: IEducationSystem;
}

export interface IEducationLevelsRes {
  status: true;
  data: IEducationLevel[];
}

export interface ISubject {
  id: number;
  name: string;
  education_level: IEducationLevel;
}

export interface ISubjectsRes {
  status: boolean;
  data: ISubject[];
}

export interface IFavoriteSubject {
  id: number;
  name: string;
  education_level: IEducationLevel;
}

export interface ICategory {
  id: number;
  name: string;
  description: string;
  image: null | string;
}

export interface ICategoriesRes {
  status: boolean;
  data: ICategory[];
}

export interface ISubCategory {
  id: number;
  name: strings;
  description: string;
  image: null | string;
  category: ICategory;
}

export interface ISubCategoryRes {
  status: boolean;
  data: ISubCategory[];
}

export interface ISubCategoryCourse {
  id: number;
  title: string;
  description: string;
  image: string;
  level: string;
  price: string;
  sub_category: ISubCategory;
  created_at: string;
  updated_at: string;
}
export interface UserDetails{
  address:string;
  conversation:string | null;
  description:string | null;
  education_level:IEducationLevel;
  email:string;
  favourite_subjects:IFavoriteSubject[];
  gender:TGender;
  id:string;
  name:string;
  phone:string;
  profile_image:string;
}
export interface IUserSearch{
  id:string;
  type:TUserSearchType;
  details:UserDetails;
}