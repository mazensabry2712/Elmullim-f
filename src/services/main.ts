import axiosAPI from "@/config/axios.config";
import {
  ICategoriesRes,
  ICountriesRes,
  IEducationLevel,
  IEducationLevelsRes,
  IEducationSystemsRes,
  ISubCategory,
  ISubCategoryRes,
  ISubjectsRes,
} from "@/interfaces/main";
import type { ILessonsRes } from "@/interfaces/lessons/lesson";

export interface IPublicTeacherSubject {
  id: number;
  name: string;
  image?: string | null;
  education_level?: IEducationLevel | null;
}

export interface IPublicTeacher {
  id: number;
  name: string;
  description?: string | null;
  experince?: number | null;
  qualification?: string | null;
  profile_image?: string | null;
  education_level?: IEducationLevel | null;
  course_types?: string[] | string | null;
  gender?: string | null;
  rating: number;
  rating_count: number;
  courses_count?: number;
  lessons_count: number;
  subjects: IPublicTeacherSubject[];
}

export interface IPublicTeacherDetailsRes {
  status: boolean;
  message: string | null;
  data: IPublicTeacher;
}

export interface IPublicTeacherCategory {
  id: number;
  name: string;
  education_level_id: number;
  education_level_name: string | null;
  teachers_count: number;
}

export interface IPublicTeacherCategoriesRes {
  status: boolean;
  message: string | null;
  data: IPublicTeacherCategory[];
}

export interface IPublicTeacherCourse {
  id: number;
  title: string;
  description?: string | null;
  image?: string | null;
  level: string;
  price: string | number;
  sub_category?: ISubCategory | null;
  teacher?: IPublicTeacher;
  hasEnrolled?: boolean | null;
}

export interface IPublicTeacherCoursesRes {
  status: boolean;
  message: string | null;
  data: IPublicTeacherCourse[];
}

export interface IPublicTeachersRes {
  status: boolean;
  message: string | null;
  data: IPublicTeacher[];
}

export interface IPublicTeacherDirectoryRes {
  status: boolean;
  message: string | null;
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
  perPage = 12,
  subjectId?: number
): Promise<IPublicTeacherDirectoryRes> => {
  const { data } = await axiosAPI.get("/main/teachers/directory", {
    params: {
      page,
      per_page: perPage,
      ...(subjectId ? { subject_id: subjectId } : {}),
    },
  });
  return data;
};

export const getPublicTeacherCategories = async (): Promise<IPublicTeacherCategoriesRes> => {
  const { data } = await axiosAPI.get("/main/teachers/subjects");
  return data;
};

export const getTeacherDetails = async (
  teacherId: string | number
): Promise<IPublicTeacherDetailsRes> => {
  const { data } = await axiosAPI.get(`/main/teachers/${teacherId}/details`);
  return data;
};

export const getPublicTeacherCourses = async (
  teacherId: string | number
): Promise<IPublicTeacherCoursesRes> => {
  const { data } = await axiosAPI.get(`/main/${teacherId}/courses`);
  return data;
};

export const getPublicTeacherLessons = async (
  teacherId: string | number
): Promise<ILessonsRes> => {
  const { data } = await axiosAPI.get(`/main/${teacherId}/lessons`);
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
  const { data } = await axiosAPI.get(
    `/main/${educationLevelId}/subjects`
  );
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
