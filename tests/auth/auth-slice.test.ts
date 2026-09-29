import { beforeEach, describe, expect, it, vi } from "vitest";

const { setTokenMock, setRoleMock, clearAllCookiesMock } = vi.hoisted(() => ({
  setTokenMock: vi.fn(),
  setRoleMock: vi.fn(),
  clearAllCookiesMock: vi.fn(),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: vi.fn(() => undefined),
    getRole: vi.fn(() => undefined),
    setToken: setTokenMock,
    setRole: setRoleMock,
    clearAllCookies: clearAllCookiesMock,
  },
}));

import authReducer, {
  login,
  logout,
} from "@/store/features/auth/authSlice";

describe("auth session isolation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new session version on every login", () => {
    const state = authReducer(undefined, login({ token: "token-a", role: "student" }));

    expect(state.isAuthenticated).toBe(true);
    expect(state.role).toBe("student");
    expect(state.sessionVersion).toBe(1);
    expect(setTokenMock).toHaveBeenCalledWith("token-a", 3);
    expect(setRoleMock).toHaveBeenCalledWith("student", 3);
  });

  it("increments the session version when logging out", () => {
    const loggedIn = authReducer(
      undefined,
      login({ token: "token-a", role: "teacher" })
    );
    const state = authReducer(loggedIn, logout());

    expect(state.isAuthenticated).toBe(false);
    expect(state.role).toBeNull();
    expect(state.sessionVersion).toBe(2);
    expect(clearAllCookiesMock).toHaveBeenCalledTimes(1);
  });

  it("increments again when the same role logs in a second time", () => {
    const firstLogin = authReducer(
      undefined,
      login({ token: "token-a", role: "parent" })
    );
    const secondLogin = authReducer(
      firstLogin,
      login({ token: "token-b", role: "parent" })
    );

    expect(secondLogin.role).toBe("parent");
    expect(secondLogin.sessionVersion).toBe(2);
    expect(setTokenMock).toHaveBeenLastCalledWith("token-b", 3);
  });
});
