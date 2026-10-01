export type PaymentMethod = "card" | "fawry" | "wallet";

export interface PaymentPricing {
  code: string;
  discount_percent: number;
  original_amount: number;
  discount_amount: number;
  final_amount: number;
}

export interface PaymentInitiationData extends PaymentPricing {
  redirect_url?: string | null;
  payment_required?: boolean;
  payment_method?: PaymentMethod | null;
}

export interface PaymentResponse {
  status: boolean;
  message: string | null;
  data?: PaymentInitiationData | null;
}
