import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useUserLogout } from "@/lib/react-query/auth";
import { logout as clearAuthSession } from "@/store/features/auth/authSlice";
import { useAppDispatch } from "@/store/store";
import cookieService from "@/utils/cookieService";
import type { IStatusMsg } from "@/interfaces";

export interface LogoutOutcome {
  response?: IStatusMsg;
  error?: unknown;
}

const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mutateAsync: logoutUser, isPending } = useUserLogout();

  const performLogout = useCallback(async (): Promise<LogoutOutcome> => {
    const token = cookieService.getToken();
    const role = cookieService.getRole();

    let response: IStatusMsg | undefined;
    let error: unknown;

    try {
      if (token && role) {
        response = await logoutUser({ token, role });
      }
    } catch (caughtError) {
      error = caughtError;
    } finally {
      dispatch(clearAuthSession());
      navigate("/login", { replace: true });
    }

    return { response, error };
  }, [dispatch, logoutUser, navigate]);

  return {
    performLogout,
    isPending,
  };
};

export default useLogout;
