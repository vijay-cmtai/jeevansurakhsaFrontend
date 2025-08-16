import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios"; // Using your globally configured axios instance

// --- TYPE DEFINITIONS ---
interface Donation {
  _id: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  transactionId: string;
  receiptNo?: string;
  createdAt: string;
  member: {
    _id: string;
    fullName: string;
    email: string;
    mobile?: string;
    memberId?: string;
  };
}

interface DonationState {
  history: Donation[];
  historyStatus: "idle" | "loading" | "succeeded" | "failed";
  allDonations: Donation[];
  allDonationsStatus: "idle" | "loading" | "succeeded" | "failed";
  initiateStatus: "idle" | "loading" | "succeeded" | "failed";
  verifyStatus: "idle" | "loading" | "succeeded" | "failed";
  currentDonation: Donation | null;
  error: string | null;
}

const initialState: DonationState = {
  history: [],
  historyStatus: "idle",
  allDonations: [],
  allDonationsStatus: "idle",
  initiateStatus: "idle",
  verifyStatus: "idle",
  currentDonation: null,
  error: null,
};

// --- ASYNC THUNKS (API Calls) ---
export const initiateMemberDonation = createAsyncThunk(
  "memberDonation/initiate",
  async (
    donationData: { amount: number; panNumber?: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/member-donations",
        donationData
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to start donation process."
      );
    }
  }
);

export const verifyMemberPayment = createAsyncThunk(
  "memberDonation/verify",
  async (order_id: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/member-donations/verify",
        { order_id }
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Payment verification failed."
      );
    }
  }
);

export const fetchMyDonationHistory = createAsyncThunk(
  "memberDonation/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        "/api/member-donations/my-history"
      );
      return data as Donation[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Could not fetch your donation history."
      );
    }
  }
);

export const fetchAllMemberDonations = createAsyncThunk(
  "memberDonation/fetchAllAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        "/api/member-donations/admin/all"
      );
      return data as Donation[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all member donations."
      );
    }
  }
);

// ================================================================
// ▼▼▼▼▼ YEH NAYA THUNK ADD KIYA GAYA HAI ▼▼▼▼▼
// ================================================================
export const deleteMemberDonation = createAsyncThunk(
  "memberDonation/deleteAdmin",
  async (donationId: string, { rejectWithValue }) => {
    try {
      // Apne backend API route se match karein
      await axiosInstance.delete(`/api/member-donations/admin/${donationId}`);
      return donationId; // Success par ID wapas bhejein
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete donation."
      );
    }
  }
);
// ================================================================

// --- THE REDUX SLICE ---
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
      // ... aapke maujooda extraReducers
      .addCase(fetchAllMemberDonations.pending, (state) => {
        state.allDonationsStatus = "loading";
        state.error = null;
      })
      .addCase(fetchAllMemberDonations.fulfilled, (state, action) => {
        state.allDonationsStatus = "succeeded";
        state.allDonations = action.payload;
      })
      .addCase(fetchAllMemberDonations.rejected, (state, action) => {
        state.allDonationsStatus = "failed";
        state.error = action.payload as string;
      })

      // ================================================================
      // ▼▼▼▼▼ YEH EXTRA REDUCERS ADD KIYE GAYE HAIN ▼▼▼▼▼
      // ================================================================
      .addCase(deleteMemberDonation.pending, (state) => {
        state.allDonationsStatus = "loading";
      })
      .addCase(deleteMemberDonation.fulfilled, (state, action) => {
        state.allDonationsStatus = "succeeded";
        state.allDonations = state.allDonations.filter(
          (donation) => donation._id !== action.payload
        );
      })
      .addCase(deleteMemberDonation.rejected, (state, action) => {
        state.allDonationsStatus = "failed";
        state.error = action.payload as string;
      });
    // ================================================================
  },
});

export const { resetDonationState } = memberDonationSlice.actions;
export default memberDonationSlice.reducer;
