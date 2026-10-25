import axiosAPI from "@/config/axios.config";

export interface LessonRatingBooking {
  booking_id: number;
  student_name: string | null;
  booking_status: string;
  session_completed: boolean;
  can_rate: boolean;
  has_rated: boolean;
  rating: number | null;
  description: string | null;
}

export interface LessonRatingStatus {
  lesson_id: number;
  rating_average: number | null;
  rating_count: number;
  bookings: LessonRatingBooking[];
}

export interface LessonRatingStatusResponse {
  status: boolean;
  message: string | null;
  data: LessonRatingStatus;
}

export interface LessonRatingInput {
  token: string;
  lessonId: number;
  bookingId: number;
  rate: number;
  description: string;
}

const authHeaders = (token: string) => ({
  Authorization: "Bearer " + token,
});

export const getLessonRatingStatus = async ({
  token,
  lessonId,
}: {
  token: string;
  lessonId: number;
}): Promise<LessonRatingStatusResponse> => {
  const { data } = await axiosAPI.get(
    "/lessons/" + lessonId + "/rating",
    { headers: authHeaders(token) },
  );
  return data;
};

export const submitLessonRating = async ({
  token,
  lessonId,
  bookingId,
  rate,
  description,
}: LessonRatingInput): Promise<{ status: boolean; message: string | null }> => {
  const { data } = await axiosAPI.post(
    "/lessons/" + lessonId + "/rating",
    {
      booking_id: bookingId,
      rate,
      description: description.trim(),
    },
    { headers: authHeaders(token) },
  );
  return data;
};
