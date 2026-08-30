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

