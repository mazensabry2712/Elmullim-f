import QueryKeys from "@/enums";
import { IUserSearch } from "@/interfaces/main";
import {
  getCategories,
  getAllCountries,
  getAllEducationLevels,
  getAllEducationSystems,
  getAllSubjects,
  getSubCategory,
  getUserSearch,
} from "@/services/main";
import { useQuery } from "@tanstack/react-query";

export const useGetAllCountries = () =>
  useQuery({
    queryKey: [QueryKeys.COUNTRIES],
    queryFn: () => getAllCountries(),
  });

export const useGetAllEducationSystems = (countryId: string) =>
  useQuery({
    queryKey: [QueryKeys.EDUCATION_SYSTEMS, countryId],
    queryFn: () => getAllEducationSystems(countryId),
    enabled: !!countryId,
  });

export const useGetAllEducationLevels = (educationSystemId: string) =>
  useQuery({
    queryKey: [QueryKeys.EDUCATIONS_LEVELS, educationSystemId],
    queryFn: () => getAllEducationLevels(educationSystemId),
    enabled: !!educationSystemId,
  });

export const useGetAllSubjects = (educationLevelId: string) =>
  useQuery({
    queryKey: [QueryKeys.SUBJECTS, educationLevelId],
    queryFn: () => getAllSubjects(educationLevelId),
    enabled: !!educationLevelId,
  });

// Categories
export const useGetCategories = () =>
  useQuery({
    queryKey: [QueryKeys.CATEGORIES],
    queryFn: () => getCategories(),
  });

export const useGetSubCategory = (categoryId: string) =>
  useQuery({
    queryKey: [QueryKeys.SUB_CATEGORIES, categoryId],
    queryFn: () => getSubCategory(categoryId),
    enabled: !!categoryId,
  });
// users search
export const useGetUserSearch=(token:string,searchParam:string)=>{
  return useQuery<IUserSearch[]>({
    queryKey:["search-user",searchParam],
    queryFn:()=>getUserSearch(token,searchParam),
    enabled:!!searchParam
  })
}  
