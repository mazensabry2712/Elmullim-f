import axiosAPI from "@/config/axios.config";
import { IStatusMsg } from "@/interfaces";
import { ICoursesRes } from "@/interfaces/courses/courses";
import type { PaymentInitiationData, PaymentMethod, PaymentResponse, PaymentPricing } from "@/interfaces/payment/payment";

export type { PaymentMethod } from "@/interfaces/payment/payment";
export type IPaymentPricing = PaymentPricing;
export type IPaymentInitiateResponse = PaymentResponse & {
  data?: PaymentInitiationData | null;
};

export interface IPromoCodeResponse extends IStatusMsg {
  data?: PaymentPricing | null;
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
    payment_method?: PaymentMethod | null;
    transaction_id?: number | null;
    orderable_type?: "courses" | "bookings" | null;
    orderable_id?: number | null;
    course_id?: number | null;
    booking_id?: number | null;
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

export const validatePromoCode = async ({
  token,
  courseId,
  code,
}: {
  token: string;
  courseId: number;
  code: string;
}): Promise<IPromoCodeResponse> => {
  const { data } = await axiosAPI.post(
    "/student/payment/course/coupon/validate",
    { course_id: courseId, code },
    { headers: { Authorization: "Bearer " + token } }
  );
  return data;
};

export const initiatePayment = async ({
  token,
  courseId,
  promoCode,
  paymentMethod,
}: {
  token: string;
  courseId: number;
  promoCode?: string;
  paymentMethod: PaymentMethod;
}): Promise<IPaymentInitiateResponse> => {
  const { data } = await axiosAPI.post(
    "/student/payment/course/initiate",
    {
      course_id: courseId,
      payment_method: paymentMethod,
      ...(promoCode?.trim() ? { promo_code: promoCode.trim() } : {}),
    },
    { headers: { Authorization: "Bearer " + token } }
  );
  return data;
};
