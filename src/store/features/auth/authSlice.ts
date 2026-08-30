import { TRole } from "@/types";
import cookieService from "@/utils/cookieService";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAuthState {
  isAuthenticated: boolean;
}

const initialState: IAuthState = {
  isAuthenticated: !!cookieService.getToken(),
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
      // Set the token and role in cookies
      cookieService.setToken(action.payload.token, 3);
      cookieService.setRole(action.payload.role, 3);
    },

    logout: (state) => {
      state.isAuthenticated = false;
      cookieService.clearAllCookies();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
