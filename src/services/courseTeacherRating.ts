import axiosAPI from "@/config/axios.config";

export interface CourseTeacherRatingStatus {
  course_id: number;
  teacher_id: number;
  teacher_name: string | null;
  eligible: boolean;
  has_rated: boolean;
  rating: number | null;
  description: string | null;
}

export interface CourseTeacherRatingStatusResponse {
  status: boolean;
  message: string | null;
  data: CourseTeacherRatingStatus;
}

export interface CourseTeacherRatingInput {
  token: string;
  courseId: number;
  rate: number;
  description: string;
}

const authHeaders = (token: string) => ({
  Authorization: "Bearer " + token,
});

export const getCourseTeacherRatingStatus = async ({
  token,
  courseId,
}: {
  token: string;
  courseId: number;
}): Promise<CourseTeacherRatingStatusResponse> => {
  const { data } = await axiosAPI.get(
    "/student/rating/courses/" + courseId,
    { headers: authHeaders(token) },
  );
  return data;
};

export const submitCourseTeacherRating = async ({
  token,
  courseId,
  rate,
  description,
}: CourseTeacherRatingInput): Promise<{ status: boolean; message: string | null }> => {
  const { data } = await axiosAPI.post(
    "/student/rating/courses/" + courseId + "/rate",
    { rate, description: description.trim() },
    { headers: authHeaders(token) },
  );
  return data;
};
