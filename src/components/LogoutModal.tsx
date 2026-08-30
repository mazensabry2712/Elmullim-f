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

const LogoutModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const token = cookieService.getToken()!;
  const role = cookieService.getRole()!;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mutateAsync: logoutUser, isPending } = useUserLogout();

  const handleLogout = async () => {
    try {
      const { message, status } = await logoutUser({ role, token });
      if (!status)
        return Swal.fire({
          title: "Error",
          text: message,
          icon: "error",
        });

      Swal.fire({
        title: "Success",
        text: message,
        icon: "success",
      });
      dispatch(logout());
      setIsOpen(false);
      navigate("/login");
    } catch (error) {
      handleResError(error);
    } finally {
      setIsOpen(false);
    }
  };
  return (
    <>
      <button
        className="flex items-center gap-2 hover:bg-white-gray w-full px-2 py-1.5 text-sm font-sora font-medium rounded-[5px] transition-all duration-300 ease-in-out text-destructive"
        onClick={() => setIsOpen(true)}
      >
        <LogOut className="h-4 w-4" /> Logout
      </button>

      <Modal
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        title="Logout"
        description={{
          text: "Are you sure you want to logout?",
          color: "text-destructive",
        }}
        isLoading={isPending}
        confirmText="Logout"
        onConfirm={handleLogout}
        showFooter
      />
    </>
  );
};

export default LogoutModal;
