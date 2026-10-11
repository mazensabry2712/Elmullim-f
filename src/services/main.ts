import axiosAPI from "@/config/axios.config";
import {
  ICategoriesRes,
  ICountriesRes,
  IEducationLevelsRes,
  IEducationSystemsRes,
  ISubCategoryRes,
  ISubjectsRes,
} from "@/interfaces/main";
import { ITeacherProfileRes } from "@/interfaces/teachers/teacherProfile";

export interface IPublicTeacher {
  id: number;
  name: string;
  description?: string | null;
  profile_image?: string | null;
  rating: number;
  rating_count: number;
  lessons_count: number;
  subjects: Array<{ id: number; name: string }>;
}

export interface IPublicTeachersRes {
  data: IPublicTeacher[];
}

export interface IPublicTeacherDirectoryRes {
  data: {
    teachers: IPublicTeacher[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}



export const getPublicTeachers = async (limit = 8): Promise<IPublicTeachersRes> => {
  const { data } = await axiosAPI.get("/main/teachers", { params: { limit } });
  return data;
};

export const getPublicTeacherDirectory = async (
  page = 1,
  perPage = 12
): Promise<IPublicTeacherDirectoryRes> => {
  const { data } = await axiosAPI.get("/main/teachers/directory", {
    params: { page, per_page: perPage },
  });
  return data;
};

export const getAllCountries = async (): Promise<ICountriesRes> => {
  const { data } = await axiosAPI.get("/main/countries");
  return data;
};

export const getAllEducationSystems = async (
  countryId: string
): Promise<IEducationSystemsRes> => {
  const { data } = await axiosAPI.get(`/main/${countryId}/education-systems`);
  return data;
};

export const getAllEducationLevels = async (
  educationSystemId: string
): Promise<IEducationLevelsRes> => {
  const { data } = await axiosAPI.get(
    `/main/${educationSystemId}/education-levels`
  );
  return data;
};

export const getAllSubjects = async (
  educationLevelId: string
): Promise<ISubjectsRes> => {
  const { data } = await axiosAPI.get(`/main/${educationLevelId}/subjects`);
  return data;
};

// Categories
export const getCategories = async (): Promise<ICategoriesRes> => {
  const { data } = await axiosAPI.get("/general/categories");
  return data;
};

export const getSubCategory = async (
  categoryId: string
): Promise<ISubCategoryRes> => {
  const { data } = await axiosAPI.get(`/general/${categoryId}/sub-categories`);
  return data;
};

export const getTeacherDetails = async (
  teacherId: string
): Promise<ITeacherProfileRes> => {
  const { data } = await axiosAPI.get(`/main/teachers/${teacherId}/details`);
  return data;
};
{/** users search */}
export const getUserSearch=async(token:string,searchParam:string)=>{
  const {data}=await axiosAPI.get(`/main/search`,{
    params:{
      q:searchParam
    },
    headers:{ Authorization: `Bearer ${token}`
  }
  })
  return data.data
}

