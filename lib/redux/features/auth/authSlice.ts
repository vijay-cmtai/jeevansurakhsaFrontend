// 📁 File: lib/redux/features/auth/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import { Member } from "../members/membersSlice";
import { RootState } from "../../store";

interface UserInfo extends Member {
  isAdmin?: boolean;
  token?: string;
  role?: "Admin" | "Manager";
}

interface AuthState {
  userInfo: UserInfo | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

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

const initialState: AuthState = {
  userInfo: getUserInfoFromStorage(),
  status: "idle",
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { identifier, password }: { identifier: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post("/api/members/login", {
        identifier,
        password,
      });
      return data as UserInfo;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed.");
    }
  }
);

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
      return { ...data, role: "Admin" } as UserInfo;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Admin login failed."
      );
    }
  }
);

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
      return { ...data, isAdmin: true } as UserInfo;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Dashboard login failed."
      );
    }
  }
);

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
    setCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      state.status = "succeeded";
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      }
    },
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
    const handlePending = (state: AuthState) => {
      state.status = "loading";
      state.error = null;
    };
    const handleRejected = (state: AuthState, action: any) => {
      state.status = "failed";
      state.error = action.payload as string;
    };

    builder
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, (state, action) => {
        authSlice.caseReducers.setCredentials(state, action);
      })
      .addCase(loginUser.rejected, handleRejected)

      .addCase(loginAdmin.pending, handlePending)
      .addCase(loginAdmin.fulfilled, (state, action) => {
        authSlice.caseReducers.setCredentials(state, action);
      })
      .addCase(loginAdmin.rejected, handleRejected)

      .addCase(loginDashboardUser.pending, handlePending)
      .addCase(loginDashboardUser.fulfilled, (state, action) => {
        authSlice.caseReducers.setCredentials(state, action);
      })
      .addCase(loginDashboardUser.rejected, handleRejected)

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
