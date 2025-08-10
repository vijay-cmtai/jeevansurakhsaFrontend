import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Or your configured axiosInstance

// Data types
interface Donation {
  _id: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  transactionId: string;
  receiptNo?: string;
  createdAt: string;
  member: { fullName: string; email: string };
}
interface DonationState {
  initiateStatus: "idle" | "loading" | "succeeded" | "failed";
  verifyStatus: "idle" | "loading" | "succeeded" | "failed";
  historyStatus: "idle" | "loading" | "succeeded" | "failed";
  currentDonation: Donation | null;
  history: Donation[];
  error: string | null;
}
const initialState: DonationState = {
  initiateStatus: "idle",
  verifyStatus: "idle",
  historyStatus: "idle",
  currentDonation: null,
  history: [],
  error: null,
};

// Async Thunks
export const initiateMemberDonation = createAsyncThunk(
  "memberDonation/initiate",
  async (
    donationData: { amount: number; panNumber?: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post("/api/member-donations", donationData);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to start donation."
      );
    }
  }
);
export const verifyMemberPayment = createAsyncThunk(
  "memberDonation/verify",
  async (order_id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/member-donations/verify", {
        order_id,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Verification failed."
      );
    }
  }
);
export const fetchMyDonationHistory = createAsyncThunk(
  "memberDonation/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/member-donations/my-history");
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Could not fetch history."
      );
    }
  }
);

// Slice
const memberDonationSlice = createSlice({
  name: "memberDonation",
  initialState,
  reducers: {
    resetDonationState: (state) => {
      state.initiateStatus = "idle";
      state.verifyStatus = "idle";
      state.currentDonation = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateMemberDonation.pending, (state) => {
        state.initiateStatus = "loading";
      })
      .addCase(initiateMemberDonation.fulfilled, (state) => {
        state.initiateStatus = "succeeded";
      })
      .addCase(initiateMemberDonation.rejected, (state, action) => {
        state.initiateStatus = "failed";
        state.error = action.payload as string;
      })
      .addCase(verifyMemberPayment.pending, (state) => {
        state.verifyStatus = "loading";
      })
      .addCase(verifyMemberPayment.fulfilled, (state, action) => {
        state.verifyStatus = "succeeded";
        state.currentDonation = action.payload;
      })
      .addCase(verifyMemberPayment.rejected, (state, action) => {
        state.verifyStatus = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchMyDonationHistory.pending, (state) => {
        state.historyStatus = "loading";
      })
      .addCase(fetchMyDonationHistory.fulfilled, (state, action) => {
        state.historyStatus = "succeeded";
        state.history = action.payload;
      })
      .addCase(fetchMyDonationHistory.rejected, (state, action) => {
        state.historyStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetDonationState } = memberDonationSlice.actions;
export default memberDonationSlice.reducer;
