import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

// Type definition for the data coming from your /api/admin/stats endpoint
interface DashboardStats {
  members: {
    total: number;
    active: number;
    new: number;
    blocked: number;
  };
  donations: {
    membershipFee: number;
    visitorDonation: number;
    cashDonation: number;
    userDonation: number;
  };
  receipts: {
    membership: number;
    visitor: number;
    cash: number;
    userDonation: number;
  };
  managers: {
    total: number;
    blocked: number;
  };
}

interface DashboardState {
  stats: DashboardStats | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  status: "idle",
  error: null,
};

// Async Thunk to fetch all dashboard stats at once
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      // Make sure this URL matches what you set in server.js
      const { data } = await axiosInstance.get("/api/admin/stats");
      return data as DashboardStats;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.stats = null;
      });
  },
});

export default dashboardSlice.reducer;
