import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { useInitiateBookingPayment } from "@/lib/react-query/booking";
import cookieService from "@/utils/cookieService";

interface Props {
  bookingId: number;
  price: string | number;
  isParent?: boolean;
}

const BookingPaymentDialog = ({ bookingId, price, isParent = false }: Props) => {
  const [open, setOpen] = useState(false);
  const [walletNumber, setWalletNumber] = useState("");
  const paymentMutation = useInitiateBookingPayment();
  const token = cookieService.getToken() || "";

  const submit = async () => {
    if (!/^01[0125][0-9]{8}$/.test(walletNumber)) {
      toast.error("Enter a valid Egyptian wallet number.");
      return;
    }

    try {
      const response = await paymentMutation.mutateAsync({
        token,
        bookingId,
        walletNumber,
        isParent,
      });

      if (!response.status) {
        toast.error(response.message || "Could not initialize payment.");
        return;
      }

      if (response.data?.redirect_url) {
        window.location.assign(response.data.redirect_url);
        return;
      }

      toast.success("Payment initialized. Complete the wallet approval.");
      setOpen(false);
      setWalletNumber("");
    } catch {
      toast.error("Could not initialize payment.");
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="rounded-md bg-main px-4 py-2 text-sm text-white">
        Pay {price}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-black-blue">Booking payment</h2>
                <p className="mt-1 text-sm text-gray-500">Amount: {price} EGP</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close"><X /></button>
            </div>

            <label className="mt-6 block text-sm font-medium" htmlFor={`wallet-${bookingId}`}>
              Wallet number
              <input
                id={`wallet-${bookingId}`}
                value={walletNumber}
                onChange={(event) => setWalletNumber(event.target.value)}
                inputMode="numeric"
                autoComplete="tel"
                placeholder="01012345678"
                maxLength={11}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </label>

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-md border px-4 py-2">Cancel</button>
              <button
                type="button"
                onClick={() => void submit()}
                disabled={paymentMutation.isPending}
                className="inline-flex items-center gap-2 rounded-md bg-main px-4 py-2 text-white disabled:opacity-60"
              >
                {paymentMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingPaymentDialog;
