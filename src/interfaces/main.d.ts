import { TUserSearchType } from "@/types";

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
  name: string;
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

export interface UserDetails {
  id: number;
  name: string;
  profile_image: string;
  conversation: string | null;
}

export interface IUserSearch {
  id: number;
  type: TUserSearchType;
  details: UserDetails;
}
