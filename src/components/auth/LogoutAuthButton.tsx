import cookieService from "@/utils/cookieService";
import { LoaderCircle, LogOut } from "lucide-react";
import Modal from "../shared/Modal";
import { HTMLAttributes, useState } from "react";
import { toast } from "react-toastify";
import handleResError from "@/utils/handleResponseError";
import { logout } from "@/store/features/auth/authSlice";
import { useUserLogout } from "@/lib/react-query/auth";
import { useAppDispatch } from "@/store/store";

type TProps = HTMLAttributes<HTMLButtonElement>;

const LogoutAuthButton = ({ ...rest }: TProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const token = cookieService.getToken()!;
  const role = cookieService.getRole()!;

  const dispatch = useAppDispatch();
  const { mutateAsync: logoutUser, isPending } = useUserLogout();

  const handleLogout = async () => {
    try {
      const { message, status } = await logoutUser({ role, token });
      if (!status) return toast.error(message);
      toast.success(message);
      dispatch(logout());
    } catch (error) {
      handleResError(error);
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
          Logout
          <LogOut size={18} />
        </span>
      </button>

      <Modal
        description={{
          text: "Are you sure you want to do logout?",
          color: "text-destructive",
        }}
        isOpen={isOpen}
        onCancel={() => setIsOpen(false)}
        onConfirm={handleLogout}
        confirmText="Logout"
        isLoading={isPending}
        title="Logout Confirmation"
        onOpenChange={() => setIsOpen(!isOpen)}
        variant="destructive"
      />
    </>
  );
};

export default LogoutAuthButton;
