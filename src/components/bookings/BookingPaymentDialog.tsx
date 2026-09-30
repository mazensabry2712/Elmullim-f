import { useState } from "react";
import { Banknote, Check, CreditCard, Loader2, Smartphone, X } from "lucide-react";
import { toast } from "react-toastify";
import { useInitiateBookingPayment } from "@/lib/react-query/booking";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";
import { getBookingCopy } from "@/pages/bookings/bookingCopy";
import type { BookingPaymentMethod } from "@/services/booking";

interface Props {
  bookingId: number;
  price: string | number;
  isParent?: boolean;
}

const BookingPaymentDialog = ({ bookingId, price, isParent = false }: Props) => {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<BookingPaymentMethod>("card");
  const paymentMutation = useInitiateBookingPayment();
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const copy = getBookingCopy(language).bookings.payment;

  const methods: Array<{
    id: BookingPaymentMethod;
    icon: typeof CreditCard;
    title: string;
    description: string;
  }> = [
    { id: "card", icon: CreditCard, title: copy.cardPayment, description: "Visa / Mastercard" },
    { id: "fawry", icon: Banknote, title: copy.fawryPayment, description: "Fawry / Kiosk" },
    { id: "wallet", icon: Smartphone, title: copy.walletPayment, description: copy.mobileWallets },
  ];

  const submit = async () => {
    try {
      const response = await paymentMutation.mutateAsync({
        token,
        bookingId,
        paymentMethod,
        isParent,
      });

      if (!response.status) {
        toast.error(response.message || copy.couldNotInitialize);
        return;
      }

      if (response.data?.redirect_url) {
        window.location.assign(response.data.redirect_url);
        return;
      }

      toast.success(copy.initialized);
      setOpen(false);
    } catch {
      toast.error(copy.couldNotInitialize);
    }
  };

  const close = () => {
    if (paymentMutation.isPending) return;
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setPaymentMethod("card");
          paymentMutation.reset();
          setOpen(true);
        }}
        className="rounded-xl bg-main px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-main/90"
      >
        {copy.pay} {price}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6" role="dialog" aria-modal="true">
          <div className="w-full max-w-xl rounded-3xl border border-[#E0E8E6] bg-white p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-main">{copy.paymentMethods}</p>
                <h2 className="mt-1 text-2xl font-bold text-black-blue">{copy.title}</h2>
                <p className="mt-1 text-sm text-[#6E7977]">
                  {copy.amount}: <span className="font-semibold text-black-blue">{price} {copy.currency}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={copy.close}
                className="rounded-xl p-2 text-[#687371] transition hover:bg-[#F0F5F4] hover:text-black-blue"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 space-y-3" role="radiogroup" aria-label={copy.paymentMethods}>
              {methods.map(({ id, icon: Icon, title, description }) => {
                const selected = paymentMethod === id;

                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setPaymentMethod(id)}
                    disabled={paymentMutation.isPending}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left transition focus:outline-none focus:ring-2 focus:ring-main/20 disabled:cursor-not-allowed disabled:opacity-60 ${
                      selected
                        ? "border-main bg-[#F0FAF8] ring-2 ring-main/10"
                        : "border-[#DFE8E6] bg-[#FBFDFC] hover:border-main/40 hover:bg-white"
                    }`}
                  >
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      selected ? "bg-main text-white" : "bg-[#EEF5F6] text-main"
                    }`}>
                      <Icon size={20} aria-hidden="true" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-black-blue">{title}</span>
                      <span className="mt-1 block text-xs leading-5 text-[#78827F]">{description}</span>
                    </span>

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        selected ? "border-main bg-main text-white" : "border-[#C8D5D2] bg-white"
                      }`}
                      aria-hidden="true"
                    >
                      {selected ? <Check size={13} strokeWidth={3} /> : null}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#F7FAF9] px-4 py-3">
              <span className="text-sm text-[#687371]">{copy.amount}</span>
              <span className="text-lg font-extrabold text-black-blue">{price} {copy.currency}</span>
            </div>

            {paymentMutation.isError ? (
              <p role="alert" className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
                {copy.couldNotInitialize}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={close}
                disabled={paymentMutation.isPending}
                className="rounded-xl border border-[#DDE5E3] bg-white px-5 py-3 text-sm font-semibold text-black-blue transition hover:border-main hover:text-main disabled:opacity-60"
              >
                {copy.cancel}
              </button>
              <button
                type="button"
                onClick={() => void submit()}
                disabled={paymentMutation.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-main px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(25,77,80,0.16)] transition hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paymentMutation.isPending ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
                {paymentMutation.isPending ? copy.initialized : copy.continue}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingPaymentDialog;
