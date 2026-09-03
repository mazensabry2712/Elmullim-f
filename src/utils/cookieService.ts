import { TRole } from "@/types";
import Cookies from "universal-cookie";

class CookieService {
  private cookies: Cookies;

  constructor() {
    this.cookies = new Cookies();
  }

  private getCookieOptions(expiresInDays: number = 7) {
    const expires = new Date();
    expires.setDate(expires.getDate() + expiresInDays);

    return {
      expires,
      path: "/",
      secure: import.meta.env.VITE_ENV === "production",
      sameSite: "strict" as const,
    };
  }

  setToken(token: string, expiresInDays: number = 7) {
    if (!token) throw new Error("Invalid token: Cannot set empty token");

    this.cookies.set("t_n", token, this.getCookieOptions(expiresInDays));
  }

  getToken(): string | undefined {
    const token = this.cookies.get("t_n");
    return token && token.trim() !== "" ? token : undefined;
  }

  setRole(role: TRole, expiresInDays: number = 7) {
    if (!role) throw new Error("Invalid role: Cannot set empty role");

    this.cookies.set("r_l", role, this.getCookieOptions(expiresInDays));
  }

  getRole(): TRole | undefined {
    const role = this.cookies.get("r_l");
    return role && role.trim() !== "" ? role : undefined;
  }

  clearAllCookies() {
    this.cookies.remove("t_n", { path: "/" });
    this.cookies.remove("r_l", { path: "/" });
    this.cookies.remove("_cr_p", { path: "/" });
  }

  setCanResetPass(role: TRole) {
    this.cookies.set("_cr_p", role, {
      ...this.getCookieOptions(1 / 24),
    });
  }

  getCanResetPass(): TRole | undefined {
    const canResetPass = this.cookies.get("_cr_p");
    if (
      canResetPass !== "student" &&
      canResetPass !== "parent" &&
      canResetPass !== "teacher"
    ) {
      return undefined;
    }

    return canResetPass;
  }

  clearCanResetPass() {
    this.cookies.remove("_cr_p", { path: "/" });
  }
}

export default new CookieService();
