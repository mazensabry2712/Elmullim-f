import axiosAPI from "@/config/axios.config";
import {
  IServiceAreaInput,
  IServiceAreaRes,
  IServiceAreasRes,
} from "@/interfaces/teacher/serviceAreas";

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const getTeacherServiceAreas = async (
  token: string
): Promise<IServiceAreasRes> => {
  const { data } = await axiosAPI.get("/teacher/service-areas", {
    headers: authHeaders(token),
  });
  return data;
};

export const createTeacherServiceArea = async ({
  token,
  payload,
}: {
  token: string;
  payload: IServiceAreaInput;
}): Promise<IServiceAreaRes> => {
  const { data } = await axiosAPI.post("/teacher/service-areas", payload, {
    headers: authHeaders(token),
  });
  return data;
};

export const updateTeacherServiceArea = async ({
  token,
  id,
  payload,
}: {
  token: string;
  id: number;
  payload: Partial<IServiceAreaInput>;
}): Promise<IServiceAreaRes> => {
  const { data } = await axiosAPI.put(`/teacher/service-areas/${id}`, payload, {
    headers: authHeaders(token),
  });
  return data;
};

export const deleteTeacherServiceArea = async ({
  token,
  id,
}: {
  token: string;
  id: number;
}): Promise<{ status: boolean; message: string | null }> => {
  const { data } = await axiosAPI.delete(`/teacher/service-areas/${id}`, {
    headers: authHeaders(token),
  });
  return data;
};

export const getTeacherLessonServiceAreas = async ({
  token,
  lessonId,
}: {
  token: string;
  lessonId: number;
}): Promise<IServiceAreasRes> => {
  const { data } = await axiosAPI.get(
    `/teacher/lessons/${lessonId}/service-areas`,
    { headers: authHeaders(token) }
  );
  return data;
};

export const replaceTeacherLessonServiceAreas = async ({
  token,
  lessonId,
  serviceAreaIds,
}: {
  token: string;
  lessonId: number;
  serviceAreaIds: number[];
}): Promise<IServiceAreasRes> => {
  const { data } = await axiosAPI.put(
    `/teacher/lessons/${lessonId}/service-areas`,
    { service_area_ids: serviceAreaIds },
    { headers: authHeaders(token) }
  );
  return data;
};
