import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

interface DonationData {
  amount: number;
  panNumber?: string;
}

interface PaymentInitResponse {
  payment_session_id: string;
  order_id: string;
}

interface MemberDonationState {
  // Donation history ke liye
  history: any[];
  // Statuses
  initiateStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MemberDonationState = {
  history: [],
  initiateStatus: "idle",
  fetchStatus: "idle",
  error: null,
};

// Donation shuru karne ke liye
export const initiateMemberDonation = createAsyncThunk(
  "memberDonation/initiate",
  async (donationData: DonationData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/member-donations",
        donationData
      );
      return data as PaymentInitResponse;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Donation failed."
      );
    }
  }
);

// Donation history fetch karne ke liye
export const fetchMyDonationHistory = createAsyncThunk(
  "memberDonation/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        "/api/member-donations/my-history"
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Could not fetch history."
      );
    }
  }
);

const memberDonationSlice = createSlice({
  name: "memberDonation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Initiate donation cases
      .addCase(initiateMemberDonation.pending, (state) => {
        state.initiateStatus = "loading";
        state.error = null;
      })
      .addCase(initiateMemberDonation.fulfilled, (state) => {
        state.initiateStatus = "succeeded";
      })
      .addCase(initiateMemberDonation.rejected, (state, action) => {
        state.initiateStatus = "failed";
        state.error = action.payload as string;
      })
      // Fetch history cases
      .addCase(fetchMyDonationHistory.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchMyDonationHistory.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.history = action.payload;
      })
      .addCase(fetchMyDonationHistory.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export default memberDonationSlice.reducer;
