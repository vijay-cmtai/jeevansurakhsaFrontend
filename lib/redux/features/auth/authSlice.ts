// 📁 File: lib/redux/features/auth/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import { Member } from "../members/membersSlice";
import { isAxiosError } from "axios";
import { RootState } from "../../store";

// Interface to define the shape of user data in the Redux state
interface UserInfo extends Member {
  isAdmin?: boolean;
  token?: string;
  role?: "Admin" | "Manager";
}

// Interface to define the shape of the entire auth slice state
interface AuthState {
  userInfo: UserInfo | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Helper function to safely get user info from localStorage on initial load
const getUserInfoFromStorage = (): UserInfo | null => {
  if (typeof window !== "undefined") {
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString) {
      try {
        return JSON.parse(userInfoString);
      } catch (error) {
        console.error("Failed to parse userInfo from localStorage", error);
        localStorage.removeItem("userInfo");
        return null;
      }
    }
  }
  return null;
};

// The initial state of the auth slice
const initialState: AuthState = {
  userInfo: getUserInfoFromStorage(),
  status: "idle",
  error: null,
};

// --- Async Thunk for PUBLIC MEMBER LOGIN ---
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post("/api/members/login", {
        email,
        password,
      });
      return data as UserInfo;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed.");
    }
  }
);

// --- Async Thunk for HARDCODED SUPER ADMIN LOGIN ---
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post("/api/admin/login", {
        email,
        password,
      });
      // ✅✅✅ YAHAN PAR FIX HAI ✅✅✅
      // Backend se aaye response mein 'role' field ko manually add karein.
      // Isse Redux state hamesha consistent rahega.
      return { ...data, role: "Admin" } as UserInfo;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Admin login failed."
      );
    }
  }
);

// --- Async Thunk for DATABASE-BASED ADMINS & MANAGERS ---
export const loginDashboardUser = createAsyncThunk(
  "auth/loginDashboardUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post("/api/admin/manager/login", {
        email,
        password,
      });
      // Set 'isAdmin' to true for both Admins and Managers for redirection purposes.
      return { ...data, isAdmin: true } as UserInfo;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Dashboard login failed."
      );
    }
  }
);

// --- Async Thunk to fetch Member's own profile ---
export const getMemberProfile = createAsyncThunk(
  "auth/getMemberProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.userInfo?.token;
      if (!token) {
        return rejectWithValue("Not authenticated.");
      }
      const { data } = await axiosInstance.get("/api/members/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data as Member;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile."
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer to set user credentials after a successful login
    setCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      state.status = "succeeded";
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      }
    },
    // Reducer to handle user logout
    logout: (state) => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("userInfo");
      }
      delete axiosInstance.defaults.headers.common["Authorization"];
      state.userInfo = null;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    // Helper functions to reduce code duplication
    const handlePending = (state: AuthState) => {
      state.status = "loading";
      state.error = null;
    };
    const handleRejected = (state: AuthState, action: any) => {
      state.status = "failed";
      state.error = action.payload as string;
    };

    builder
      // Member Login Lifecycle
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, (state, action) => {
        authSlice.caseReducers.setCredentials(state, action);
      })
      .addCase(loginUser.rejected, handleRejected)

      // Hardcoded Admin Login Lifecycle
      .addCase(loginAdmin.pending, handlePending)
      .addCase(loginAdmin.fulfilled, (state, action) => {
        authSlice.caseReducers.setCredentials(state, action);
      })
      .addCase(loginAdmin.rejected, handleRejected)

      // Database Admin/Manager Login Lifecycle
      .addCase(loginDashboardUser.pending, handlePending)
      .addCase(loginDashboardUser.fulfilled, (state, action) => {
        authSlice.caseReducers.setCredentials(state, action);
      })
      .addCase(loginDashboardUser.rejected, handleRejected)

      // Get Member Profile Lifecycle
      .addCase(getMemberProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getMemberProfile.fulfilled,
        (state, action: PayloadAction<Member>) => {
          state.status = "succeeded";
          if (state.userInfo) {
            state.userInfo = { ...state.userInfo, ...action.payload };
            localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
          }
        }
      )
      .addCase(getMemberProfile.rejected, handleRejected);
  },
});

export const { logout, setCredentials } = authSlice.actions;

export default authSlice.reducer;
