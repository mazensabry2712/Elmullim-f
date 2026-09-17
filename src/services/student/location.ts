import axiosAPI from "@/config/axios.config";

export interface IStudentLocationPayload {
  address: string;
  latitude: number;
  longitude: number;
}

export interface IStudentLocationResponse {
  status: boolean;
  message: string | null;
  data: {
    id: number;
    address: string;
    latitude: string | number | null;
    longitude: string | number | null;
    location_updated_at: string | null;
  };
}

export const updateStudentLocation = async ({
  token,
  payload,
}: {
  token: string;
  payload: IStudentLocationPayload;
}): Promise<IStudentLocationResponse> => {
  const { data } = await axiosAPI.put("/student/location", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
