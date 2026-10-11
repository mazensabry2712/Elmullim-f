import axiosAPI from "@/config/axios.config";

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export interface IStudentParentLink {
  id: number;
  name: string;
  profile_image: string;
  status: "pending" | "active";
  requested_at: string;
}

export interface IStudentParentLinksResponse {
  status: boolean;
  message: string | null;
  data: { links: IStudentParentLink[] };
}

export const getStudentParentLinks = async (
  token: string,
): Promise<IStudentParentLinksResponse> => {
  const { data } = await axiosAPI.get("/student/parent-links", {
    headers: authHeaders(token),
  });
  return data;
};

export const respondToStudentParentLink = async ({
  token,
  familyId,
  decision,
}: {
  token: string;
  familyId: number;
  decision: "accept" | "reject";
}): Promise<{ status: boolean; message: string | null; data?: { status: string } }> => {
  const { data } = await axiosAPI.post(
    `/student/parent-links/${familyId}/respond`,
    { decision },
    { headers: authHeaders(token) },
  );
  return data;
};

export const unlinkStudentParent = async ({
  token,
  familyId,
}: {
  token: string;
  familyId: number;
}): Promise<{ status: boolean; message: string | null }> => {
  const { data } = await axiosAPI.delete(`/student/parents/${familyId}/link`, {
    headers: authHeaders(token),
  });
  return data;
};
