import { TRole } from "@/types";
import Cookies from "universal-cookie";
import { decryptData, encryptData } from "./encryptData";

class CookieService {
  private cookies: Cookies;

  constructor() {
    this.cookies = new Cookies();
  }

  setToken(token: string, expiresInDays: number = 7) {
    if (!token) throw new Error("Invalid token: Cannot set empty token");

    const expires = new Date();
    expires.setDate(expires.getDate() + expiresInDays);
    this.cookies.set("t_n", token, {
      expires,
      path: "/",
      secure: import.meta.env.VITE_ENV === "production",
    });
  }

  getToken(): string | undefined {
    const token = this.cookies.get("t_n");
    return token && token.trim() !== "" ? token : undefined;
  }

  setRole(role: TRole, expiresInDays: number = 7) {
    if (!role) throw new Error("Invalid role: Cannot set empty role");

    const expires = new Date();
    expires.setDate(expires.getDate() + expiresInDays);
    this.cookies.set("r_l", role, {
      expires,
      path: "/",
      secure: import.meta.env.VITE_ENV === "production",
    });
  }

  getRole(): TRole | undefined {
    const role = this.cookies.get("r_l");
    return role && role.trim() !== "" ? role : undefined;
  }

  clearAllCookies() {
    this.cookies.remove("t_n", { path: "/" });
    this.cookies.remove("r_l", { path: "/" });
  }

  setCanResetPass(role: TRole) {
    const encryptReset = encryptData(role);
    this.cookies.set("_cr_p", encryptReset, {
      path: "/",
      secure: import.meta.env.VITE_ENV === "production",
      expires: new Date(Date.now() + 60 * 60 * 1000),
      sameSite: "strict",
    });
  }

  getCanResetPass(): TRole | undefined {
    const canResetPass = this.cookies.get("_cr_p");
    if (!canResetPass) return undefined;
    const decryptCanReset = decryptData(canResetPass);
    if (
      decryptCanReset !== "student" &&
      decryptCanReset !== "parent" &&
      decryptCanReset !== "teacher"
    )
      return undefined;
    return decryptCanReset;
  }

  clearCanResetPass() {
    this.cookies.remove("_cr_p", { path: "/" });
  }
}

export default new CookieService();
