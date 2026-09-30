import { LogOut } from "lucide-react";
import { useState } from "react";
import Modal from "./shared/Modal";
import cookieService from "@/utils/cookieService";
import { useAppDispatch } from "@/store/store";
import { useUserLogout } from "@/lib/react-query/auth";
import handleResError from "@/utils/handleResponseError";
import Swal from "sweetalert2";
import { logout } from "@/store/features/auth/authSlice";
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
  const token = cookieService.getToken();
  const role = cookieService.getRole();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mutateAsync: logoutUser, isPending } = useUserLogout();
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
    try {
      if (!token || !role) {
        dispatch(logout());
        setOpen(false);
        navigate("/login", { replace: true });
        return;
      }

      const { message, status } = await logoutUser({ role, token });

      if (!status) {
        dispatch(logout());
        setOpen(false);
        navigate("/login", { replace: true });
        return Swal.fire({
          title: copy.error,
          text: message,
          icon: "error",
        });
      }

      dispatch(logout());
      setOpen(false);
      navigate("/login", { replace: true });

      void Swal.fire({
        title: copy.success,
        text: message,
        icon: "success",
      });
    } catch (error) {
      // A logout request failing should never keep the user trapped in an
      // authenticated UI. Revoke the local session and return to login.
      dispatch(logout());
      setOpen(false);
      navigate("/login", { replace: true });
      handleResError(error);
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
