import QueryKeys from "@/enums";
import { IUserSearch } from "@/interfaces/main";
import {
  getCategories,
  getAllCountries,
  getAllEducationLevels,
  getAllEducationSystems,
  getPublicSubjectsForEducationLevel,
  getTeacherSubjects,
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

export const useGetPublicSubjectsForEducationLevel = (educationLevelId: string) =>
  useQuery({
    queryKey: [QueryKeys.SUBJECTS, "public", educationLevelId],
    queryFn: () => getPublicSubjectsForEducationLevel(educationLevelId),
    enabled: !!educationLevelId,
  });

export const useGetTeacherSubjects = (educationLevelId: string) =>
  useQuery({
    queryKey: [QueryKeys.SUBJECTS, "teacher", educationLevelId],
    queryFn: () => getTeacherSubjects(educationLevelId),
    enabled: !!educationLevelId,
  });

// Keep the previous hook available for compatibility. It is public-filtered.
export const useGetAllSubjects = useGetPublicSubjectsForEducationLevel;

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
export const useGetUserSearch = (
  token: string,
  searchParam: string,
  enabled = true
) => {
  return useQuery<IUserSearch[]>({
    queryKey: ["search-user", searchParam],
    queryFn: () => getUserSearch(token, searchParam),
    enabled: enabled && !!token && !!searchParam,
  });
};  
