import axiosAPI from "@/config/axios.config";
import { IStatusMsg } from "@/interfaces";
import { ICoursesRes } from "@/interfaces/courses/courses";

export interface IPaymentInitiateResponse extends IStatusMsg {
  data?: {
    redirect_url?: string | null;
  } | null;
}

export const getMyCourses = async (token: string): Promise<ICoursesRes> => {
  const { data } = await axiosAPI.get("/student/enrolling/courses", {
    headers: { Authorization: "Bearer " + token },
  });
  return data;
};

export const enrollFreeCourse = async ({
  token,
  courseId,
}: {
  token: string;
  courseId: number;
}): Promise<IStatusMsg> => {
  const { data } = await axiosAPI.post(
    "/student/enrolling/courses/" + courseId + "/enroll",
    {},
    { headers: { Authorization: "Bearer " + token } }
  );
  return data;
};

export interface IPaymentStatusResponse extends IStatusMsg {
  data?: {
    status?: "pending" | "success" | "failed";
    transaction_id?: number | null;
    course_id?: number | null;
  } | null;
}

export const getPaymentStatus = async ({
  orderId,
  signature,
}: {
  orderId: number;
  signature: string;
}): Promise<IPaymentStatusResponse> => {
  const { data } = await axiosAPI.get("/student/payment/status", {
    params: { order: orderId, sig: signature },
  });
  return data;
};

export const initiatePayment = async ({
  token,
  walletNumber,
  courseId,
}: {
  token: string;
  walletNumber: string;
  courseId: number;
}): Promise<IPaymentInitiateResponse> => {
  const { data } = await axiosAPI.post(
    "/student/payment/intiate",
    {
      wallet_number: walletNumber,
      orderable_type: "courses",
      orderable_id: courseId,
    },
    { headers: { Authorization: "Bearer " + token } }
  );
  return data;
};
