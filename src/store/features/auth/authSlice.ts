import { TRole } from "@/types";
import cookieService from "@/utils/cookieService";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAuthState {
  isAuthenticated: boolean;
  role: TRole | null;
  sessionVersion: number;
}

const initialState: IAuthState = {
  isAuthenticated: !!cookieService.getToken(),
  role: cookieService.getRole() ?? null,
  sessionVersion: 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        token: string;
        role: TRole;
      }>
    ) => {
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.sessionVersion += 1;
      // Set the token and role in cookies
      cookieService.setToken(action.payload.token, 3);
      cookieService.setRole(action.payload.role, 3);
    },

    syncSession: (state, action: PayloadAction<{ role: TRole }>) => {
      state.isAuthenticated = true;
      state.role = action.payload.role;
      cookieService.setRole(action.payload.role, 3);
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.role = null;
      state.sessionVersion += 1;
      cookieService.clearAllCookies();
    },
  },
});

export const { login, syncSession, logout } = authSlice.actions;
export default authSlice.reducer;
