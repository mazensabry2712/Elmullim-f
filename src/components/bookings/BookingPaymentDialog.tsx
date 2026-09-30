import { useState } from "react";
import { Banknote, CreditCard, Loader2, Smartphone, X } from "lucide-react";
import { toast } from "react-toastify";
import { useInitiateBookingPayment } from "@/lib/react-query/booking";
import cookieService from "@/utils/cookieService";
import { useI18n } from "@/i18n";
import { getBookingCopy } from "@/pages/bookings/bookingCopy";

interface Props {
  bookingId: number;
  price: string | number;
  isParent?: boolean;
}

const BookingPaymentDialog = ({ bookingId, price, isParent = false }: Props) => {
  const [open, setOpen] = useState(false);
  const paymentMutation = useInitiateBookingPayment();
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const copy = getBookingCopy(language).bookings.payment;

  const submit = async () => {
    try {
      const response = await paymentMutation.mutateAsync({
        token,
        bookingId,
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

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="rounded-md bg-main px-4 py-2 text-sm text-white">
        {copy.pay} {price}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-black-blue">{copy.title}</h2>
                <p className="mt-1 text-sm text-gray-500">{copy.amount}: {price} {copy.currency}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label={copy.close}><X /></button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label={copy.paymentMethods}>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center">
                <CreditCard className="mx-auto mb-2 text-[#194D80]" size={24} aria-hidden="true" />
                <p className="text-sm font-semibold text-black-blue">{copy.cardPayment}</p>
                <p className="mt-1 text-xs text-gray-500">Visa / Mastercard</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center">
                <Banknote className="mx-auto mb-2 text-[#194D80]" size={24} aria-hidden="true" />
                <p className="text-sm font-semibold text-black-blue">{copy.fawryPayment}</p>
                <p className="mt-1 text-xs text-gray-500">Fawry / Kiosk</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center">
                <Smartphone className="mx-auto mb-2 text-[#194D80]" size={24} aria-hidden="true" />
                <p className="text-sm font-semibold text-black-blue">{copy.walletPayment}</p>
                <p className="mt-1 text-xs text-gray-500">{copy.mobileWallets}</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-md border px-4 py-2">
                {copy.cancel}
              </button>
              <button
                type="button"
                onClick={() => void submit()}
                disabled={paymentMutation.isPending}
                className="inline-flex items-center gap-2 rounded-md bg-main px-4 py-2 text-white disabled:opacity-60"
              >
                {paymentMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                {copy.continue}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingPaymentDialog;
