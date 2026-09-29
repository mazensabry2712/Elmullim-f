import axiosAPI from "@/config/axios.config";
import {
  ITeacherAvailabilityBlock,
  ITeacherAvailabilityBlocksRes,
} from "@/interfaces/lessons/availability";

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const getTeacherAvailabilityBlocks = async (
  token: string
): Promise<ITeacherAvailabilityBlocksRes> => {
  const { data } = await axiosAPI.get("/teacher/availability-blocks", {
    headers: authHeaders(token),
  });
  return data;
};

export const createTeacherAvailabilityBlock = async ({
  token,
  startsAt,
  endsAt,
  reason,
}: {
  token: string;
  startsAt: string;
  endsAt: string;
  reason?: string;
}): Promise<{
  status: boolean;
  message: string | null;
  data: ITeacherAvailabilityBlock;
}> => {
  const { data } = await axiosAPI.post(
    "/teacher/availability-blocks",
    {
      starts_at: startsAt,
      ends_at: endsAt,
      ...(reason?.trim() ? { reason: reason.trim() } : {}),
    },
    { headers: authHeaders(token) }
  );
  return data;
};

export const deleteTeacherAvailabilityBlock = async ({
  token,
  id,
}: {
  token: string;
  id: number;
}): Promise<{ status: boolean; message: string | null }> => {
  const { data } = await axiosAPI.delete(`/teacher/availability-blocks/${id}`, {
    headers: authHeaders(token),
  });
  return data;
};
