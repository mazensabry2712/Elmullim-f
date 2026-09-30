import axiosAPI from "@/config/axios.config";
import { IRatingRes } from "@/interfaces/students/studentProfile";

export type RatingActorRole = "student" | "parent" | "teacher";
export type RatingTargetType = "teacher" | "student";

interface SubmitRatingInput {
  token: string;
  actorRole: RatingActorRole;
  targetType: RatingTargetType;
  targetId: number;
  bookingId: number;
  rate: number;
  description: string;
}

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

const getGivenRatingsEndpoint = (role: RatingActorRole) => {
  switch (role) {
    case "student":
      return "/student/rating/given-all";
    case "parent":
      return "/parent/ratings/given-all";
    case "teacher":
      return "/teacher/rating/given-all";
  }
};

const getRatingEndpoint = (
  actorRole: RatingActorRole,
  targetType: RatingTargetType,
  targetId: number,
) => {
  if (actorRole === "student" && targetType === "teacher") {
    return `/student/rating/${targetId}/rate`;
  }

  if (actorRole === "parent" && targetType === "teacher") {
    return `/parent/ratings/${targetId}/rate`;
  }

  if (actorRole === "parent" && targetType === "student") {
    return `/parent/ratings/students/${targetId}/rate`;
  }

  if (actorRole === "teacher" && targetType === "student") {
    return `/teacher/rating/students/${targetId}/rate`;
  }

  throw new Error("Invalid rating direction.");
};

export const getGivenRatings = async ({
  token,
  role,
}: {
  token: string;
  role: RatingActorRole;
}): Promise<IRatingRes> => {
  const { data } = await axiosAPI.get(getGivenRatingsEndpoint(role), {
    headers: authHeaders(token),
  });

  return data;
};

export const submitRating = async ({
  token,
  actorRole,
  targetType,
  targetId,
  bookingId,
  rate,
  description,
}: SubmitRatingInput): Promise<{ status: boolean; message: string | null }> => {
  const { data } = await axiosAPI.post(
    getRatingEndpoint(actorRole, targetType, targetId),
    {
      booking_id: bookingId,
      rate,
      description: description.trim(),
    },
    { headers: authHeaders(token) },
  );

  return data;
};
