import { LogOut } from "lucide-react";
import { useState } from "react";
import Modal from "./shared/Modal";
import useLogout from "@/hooks/useLogout";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n";
import { getAuthCopy } from "@/i18n/authCopy";

interface LogoutModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

const LogoutModal = ({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  showTrigger = true,
}: LogoutModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const { performLogout, isPending } = useLogout();
  const { language } = useI18n();
  const copy = getAuthCopy(language);

  const isOpen = controlledOpen ?? internalOpen;

  const setOpen = (nextOpen: boolean) => {
    if (controlledOnOpenChange) {
      controlledOnOpenChange(nextOpen);
      return;
    }

    setInternalOpen(nextOpen);
  };

  const handleLogout = async () => {
    const { response, error } = await performLogout();
    setOpen(false);

    if (response?.status) {
      void Swal.fire({
        title: copy.success,
        text: response.message,
        icon: "success",
      });
      return;
    }

    if (error || response) {
      void Swal.fire({
        title: copy.error,
        text: response?.message ?? (
          language === "ar"
            ? "تم إنهاء الجلسة على هذا الجهاز، لكن تعذر التواصل مع الخادم."
            : "Your session ended on this device, but the server could not be reached."
        ),
        icon: "warning",
      });
    }
  };

  return (
    <>
      {showTrigger && (
        <button
          type="button"
          className="flex items-center gap-2 hover:bg-white-gray w-full px-2 py-1.5 text-sm font-sora font-medium rounded-[5px] transition-all duration-300 ease-in-out text-destructive"
          onClick={() => setOpen(true)}
        >
          <LogOut className="h-4 w-4" /> {copy.logout}
        </button>
      )}

      <Modal
        isOpen={isOpen}
        onOpenChange={() => setOpen(false)}
        title={copy.logout}
        description={{ text: copy.logoutQuestion, color: "text-destructive" }}
        isLoading={isPending}
        confirmText={copy.logout}
        onConfirm={handleLogout}
        showFooter
      />
    </>
  );
};

export default LogoutModal;
