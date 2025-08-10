import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios"; // Using your globally configured axios instance

// --- TYPE DEFINITIONS ---

// Defines the shape of a single donation object, including the nested member details.
interface Donation {
  _id: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  transactionId: string;
  receiptNo?: string;
  createdAt: string;
  member: {
    // The 'member' field will be populated by the backend
    _id: string;
    fullName: string;
    email: string;
    mobile?: string; // Optional, but good to have
    memberId?: string; // Optional, for display in the admin panel
  };
}

// Defines the structure of the entire state managed by this slice.
interface DonationState {
  // For individual members viewing their own history
  history: Donation[];
  historyStatus: "idle" | "loading" | "succeeded" | "failed";

  // For admins viewing all donations
  allDonations: Donation[];
  allDonationsStatus: "idle" | "loading" | "succeeded" | "failed";

  // For the process of creating and verifying a single donation
  initiateStatus: "idle" | "loading" | "succeeded" | "failed";
  verifyStatus: "idle" | "loading" | "succeeded" | "failed";
  currentDonation: Donation | null;

  // A general field to store any errors
  error: string | null;
}

// The initial state when the application loads.
const initialState: DonationState = {
  // Member-specific state
  history: [],
  historyStatus: "idle",
  // Admin-specific state
  allDonations: [],
  allDonationsStatus: "idle",
  // Transaction-specific state
  initiateStatus: "idle",
  verifyStatus: "idle",
  currentDonation: null,
  // General state
  error: null,
};

// --- ASYNC THUNKS (API Calls) ---

/**
 * @description [MEMBER] Initiates the donation process for a logged-in member.
 */
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

/**
 * @description [MEMBER] Verifies the payment status of a donation after returning from the gateway.
 */
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

/**
 * @description [MEMBER] Fetches the donation history for the currently logged-in member.
 */
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

/**
 * @description [ADMIN] Fetches all member donations from all users.
 */
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

// --- THE REDUX SLICE ---

const memberDonationSlice = createSlice({
  name: "memberDonation",
  initialState,
  reducers: {
    // A utility action to reset the state, useful for cleaning up.
    resetDonationState: (state) => {
      state.initiateStatus = "idle";
      state.verifyStatus = "idle";
      state.currentDonation = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Cases for: Initiating a donation
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

      // Cases for: Verifying a payment
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

      // Cases for: Fetching a single member's history
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
      })

      // ✅ Cases for: Fetching ALL member donations (for Admin)
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
      });
  },
});

export const { resetDonationState } = memberDonationSlice.actions;
export default memberDonationSlice.reducer;
