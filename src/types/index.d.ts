import { AxiosError } from "axios";

export type TGender = "male" | "female";
export type TRole = "parent" | "student" | "teacher";
export type TUserSearchType = "familes" | "students" | "teachers";
export type TCourseType = "private" | "online" | "general";
export type TLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type AxiosResErr = AxiosError<{ message: string }>;
