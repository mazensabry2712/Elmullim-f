import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
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
}));
vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: () => undefined,
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
});

describe("RootLayout authentication bootstrap", () => {
  it("does not call checkAuth when there is no authentication token", async () => {
    render(<RootLayout />);

    await waitFor(() => {
      expect(checkAuth).not.toHaveBeenCalled();
    });
  });
});
