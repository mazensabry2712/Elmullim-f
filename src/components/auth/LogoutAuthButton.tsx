import { LoaderCircle, LogOut } from "lucide-react";
import Modal from "../shared/Modal";
import { HTMLAttributes, useState } from "react";
import { toast } from "react-toastify";
import useLogout from "@/hooks/useLogout";
import { useI18n } from "@/i18n";

type TProps = HTMLAttributes<HTMLButtonElement>;

const LogoutAuthButton = ({ ...rest }: TProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useI18n();
  const { performLogout, isPending } = useLogout();

  const copy = {
    en: {
      logout: "Logout",
      confirmation: "Logout Confirmation",
      confirmMessage: "Are you sure you want to log out?",
    },
    ar: {
      logout: "تسجيل الخروج",
      confirmation: "تأكيد تسجيل الخروج",
      confirmMessage: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
    },
  }[language];

  const handleLogout = async () => {
    const { response, error } = await performLogout();
    setIsOpen(false);

    if (response?.status) {
      toast.success(response.message);
      return;
    }

    if (error || response) {
      toast.warning(
        response?.message ||
          (language === "ar"
            ? "تم إنهاء الجلسة محليًا، لكن تعذر تأكيد الإلغاء مع الخادم."
            : "Your session ended locally, but the server could not confirm revocation.")
      );
    }
  };

  return (
    <>
      <button
        {...rest}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsOpen(true);
        }}
        className="bg-destructive rounded-[5px] text-[15px] flex justify-center items-center gap-2 text-white px-4 py-2.5 font-bold capitalize"
      >
        {isPending && (
          <span className="flex-shrink-0 w-6">
            <LoaderCircle className="animate-spin !w-6 !h-6" />
          </span>
        )}
        <span className="flex justify-center items-center gap-2">
          {copy.logout}
          <LogOut size={18} />
        </span>
      </button>

      <Modal
        description={{
          text: copy.confirmMessage,
          color: "text-destructive",
        }}
        isOpen={isOpen}
        onCancel={() => setIsOpen(false)}
        onConfirm={handleLogout}
        confirmText={copy.logout}
        isLoading={isPending}
        title={copy.confirmation}
        onOpenChange={() => setIsOpen(false)}
        variant="destructive"
      />
    </>
  );
};

export default LogoutAuthButton;
