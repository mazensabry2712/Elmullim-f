import axiosAPI from "@/config/axios.config";
import { IServiceArea, IServiceAreasResponse } from "@/interfaces/teachers/serviceArea";

const headers = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const getTeacherServiceAreas = async (token: string): Promise<IServiceAreasResponse> => {
  const { data } = await axiosAPI.get("/teacher/service-areas", { headers: headers(token) });
  return data;
};

export const createTeacherServiceArea = async ({ token, areaName }: {
  token: string;
  areaName: string;
}) => {
  const { data } = await axiosAPI.post(
    "/teacher/service-areas",
    { area_name: areaName.trim() },
    { headers: headers(token) }
  );
  return data as { status: boolean; message: string | null; data?: IServiceArea };
};

export const updateTeacherServiceArea = async ({ token, areaId, areaName, isActive }: {
  token: string;
  areaId: number;
  areaName: string;
  isActive: boolean;
}) => {
  const { data } = await axiosAPI.put(
    `/teacher/service-areas/${areaId}`,
    { area_name: areaName.trim(), is_active: isActive },
    { headers: headers(token) }
  );
  return data as { status: boolean; message: string | null; data?: IServiceArea };
};

export const deleteTeacherServiceArea = async ({ token, areaId }: {
  token: string;
  areaId: number;
}) => {
  const { data } = await axiosAPI.delete(
    `/teacher/service-areas/${areaId}`,
    { headers: headers(token) }
  );
  return data as { status: boolean; message: string | null };
};
