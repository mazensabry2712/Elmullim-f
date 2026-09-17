import axiosAPI from "@/config/axios.config";
import { IStudentLocationPayload, IStudentLocationResponse } from "@/services/student/location";

export const updateParentStudentLocation = async ({
  token,
  studentId,
  payload,
}: {
  token: string;
  studentId: number;
  payload: IStudentLocationPayload;
}): Promise<IStudentLocationResponse> => {
  const { data } = await axiosAPI.put(
    `/parent/students/${studentId}/location`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};
