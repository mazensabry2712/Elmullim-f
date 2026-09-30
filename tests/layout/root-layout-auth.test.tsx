import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

const cookieState = vi.hoisted(() => ({ token: undefined as string | undefined }));
import { I18nProvider } from "@/i18n";
import RootLayout from "@/layout/RootLayout";

const checkAuth = vi.fn();
const dispatch = vi.fn();
const navigate = vi.fn();

vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/lib/react-query/auth", () => ({
  useCheckAuth: () => ({ mutateAsync: checkAuth }),
}));
vi.mock("@/store/store", () => ({
  useAppDispatch: () => dispatch,
}));
vi.mock("@/store/features/auth/authSlice", () => ({
  logout: () => ({ type: "auth/logout" }),
  syncSession: (payload: unknown) => ({ type: "auth/syncSession", payload }),
}));
vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: () => cookieState.token,
  },
}));
vi.mock("react-router-dom", () => ({
  Outlet: () => null,
  ScrollRestoration: () => null,
  useLocation: () => ({ pathname: "/" }),
  useNavigate: () => navigate,
}));

beforeEach(() => {
  vi.clearAllMocks();
  cookieState.token = undefined;
});

describe("RootLayout authentication bootstrap", () => {
  it("revalidates authentication when the tab regains focus", async () => {
    cookieState.token = "student-token";
    checkAuth.mockResolvedValue({
      status: true,
      message: null,
      data: { auth: true, role: "student", "email-verified": true },
    });

    render(
      <I18nProvider>
        <RootLayout />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(checkAuth).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      window.dispatchEvent(new Event("focus"));
    });

    await waitFor(() => {
      expect(checkAuth).toHaveBeenCalledTimes(2);
    });
  });

  it("logs the user out when a revalidation detects an invalid session", async () => {
    cookieState.token = "revoked-token";
    checkAuth.mockResolvedValue({
      status: false,
      message: "Unauthenticated.",
      data: { auth: false },
    });

    render(
      <I18nProvider>
        <RootLayout />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(checkAuth).toHaveBeenCalledWith("revoked-token");
    });

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({ type: "auth/logout" });
      expect(navigate).toHaveBeenCalledWith("/login", { replace: true });
    });
  });

  it("does not call checkAuth when there is no authentication token", async () => {
    render(
      <I18nProvider>
        <RootLayout />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(checkAuth).not.toHaveBeenCalled();
    });
  });
});
