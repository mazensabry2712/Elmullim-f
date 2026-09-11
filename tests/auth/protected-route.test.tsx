import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const useSelectorMock = vi.fn();
const getTokenMock = vi.fn();
const getRoleMock = vi.fn();

vi.mock("react-redux", () => ({
  useSelector: (selector: unknown) => useSelectorMock(selector),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: () => getTokenMock(),
    getRole: () => getRoleMock(),
  },
}));

vi.mock("react-router-dom", () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate">{to}</div>,
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getTokenMock.mockReturnValue("student-token");
    getRoleMock.mockReturnValue("student");
    useSelectorMock.mockReturnValue({ isAuthenticated: true });
  });

  it("redirects unauthenticated users to login", () => {
    getTokenMock.mockReturnValue(undefined);
    useSelectorMock.mockReturnValue({ isAuthenticated: false });

    render(
      <ProtectedRoute>
        <div>protected content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId("navigate")).toHaveTextContent("/login");
    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
  });

  it("redirects an authenticated user with the wrong role to unauthorized", () => {
    getRoleMock.mockReturnValue("teacher");

    render(
      <ProtectedRoute requiredRole="student">
        <div>student content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId("navigate")).toHaveTextContent("/unauthorized");
    expect(screen.queryByText("student content")).not.toBeInTheDocument();
  });

  it("renders protected content for an authenticated user with the required role", () => {
    render(
      <ProtectedRoute requiredRole="student">
        <div>student content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("student content")).toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
  });
});
