import { Banknote, Check, CreditCard, Smartphone } from "lucide-react";
import type { PaymentMethod } from "@/interfaces/payment/payment";

export interface PaymentMethodLabels {
  paymentMethods: string;
  cardPayment: string;
  cardPaymentDescription?: string;
  fawryPayment: string;
  fawryPaymentDescription?: string;
  walletPayment: string;
  walletPaymentDescription?: string;
}

interface Props {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  disabled?: boolean;
  labels: PaymentMethodLabels;
}

const PaymentMethodSelector = ({ value, onChange, disabled = false, labels }: Props) => {
  const methods = [
    {
      id: "card" as const,
      icon: CreditCard,
      title: labels.cardPayment,
      description: labels.cardPaymentDescription,
    },
    {
      id: "fawry" as const,
      icon: Banknote,
      title: labels.fawryPayment,
      description: labels.fawryPaymentDescription,
    },
    {
      id: "wallet" as const,
      icon: Smartphone,
      title: labels.walletPayment,
      description: labels.walletPaymentDescription,
    },
  ];

  return (
    <div className="mt-4 space-y-3" role="radiogroup" aria-label={labels.paymentMethods}>
      {methods.map(({ id, icon: Icon, title, description }) => {
        const selected = value === id;

        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(id)}
            disabled={disabled}
            className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
              selected
                ? "border-main bg-[#F0FAF8] ring-2 ring-main/10"
                : "border-[#DFE8E6] bg-white hover:border-main/40 hover:bg-[#FBFDFC]"
            }`}
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                selected ? "bg-main text-white" : "bg-[#EEF5F6] text-main"
              }`}
            >
              <Icon size={20} aria-hidden="true" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-black-blue">{title}</span>
              {description ? (
                <span className="mt-1 block text-xs leading-5 text-[#7B8583]">{description}</span>
              ) : null}
            </span>

            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                selected ? "border-main bg-main text-white" : "border-[#C9D5D2] bg-white"
              }`}
              aria-hidden="true"
            >
              {selected ? <Check size={13} strokeWidth={3} /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default PaymentMethodSelector;
