import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  token: localStorage.getItem("token") || null, // Store token in the state
  isSidebarOpen: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload; // Assuming action.payload contains both user and token
      state.user = user;
      state.token = token;

      // Store both user info and token in localStorage
      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;

      // Remove both user info and token from localStorage
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
    },
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { setCredentials, logout, setOpenSidebar } = authSlice.actions;

export default authSlice.reducer;
