import { createSlice } from "@reduxjs/toolkit";

// Helper function to get a cookie value
const getCookieValue = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const initialState = {
  user: getCookieValue("token") ? { token: getCookieValue("token") } : null,
  isSidebarOpen: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      document.cookie = `token=${action.payload.token}; path=/;`;
      console.log("Token set: ", action.payload);
    },
    logout: (state) => {
      state.user = null;
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { setCredentials, logout, setOpenSidebar } = authSlice.actions;

export default authSlice.reducer;
