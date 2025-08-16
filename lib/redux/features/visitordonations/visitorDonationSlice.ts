// File: lib/redux/features/visitordonations/visitorDonationSlice.js

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

// --- TypeScript Interfaces ---

// Data jo user donation form mein bharta hai
export interface DonationFormData {
  name: string;
  email?: string;
  mobile: string;
  address?: string;
  amount: number;
  panNumber?: string;
  bankName?: string;
  branchName?: string;
}

// Database se aane wala poora donation object
export interface VisitorDonation extends DonationFormData {
  _id: string;
  transactionId: string;
  receiptNo?: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

// Donation initiate karne par backend se milne wala response
export interface PaymentInitResponse {
  payment_session_id: string;
  order_id: string;
}

// Donation status check karne par milne wala response
export interface DonationStatusResponse {
  status: "PENDING" | "SUCCESS" | "FAILED";
  receiptNo?: string;
  amount: number;
  createdAt: string;
}

// Slice ki state ka structure
interface VisitorDonationState {
  // Donation initiate karne ke liye status
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  paymentSessionId: string | null;
  orderId: string | null;

  // Admin panel mein donations ki list ke liye status
  donations: VisitorDonation[];
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  listError: string | null;

  // List par kiye jaane wale actions (jaise delete) ke liye alag status
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  actionError: string | null;

  // Current donation ka status track karne ke liye
  currentDonationStatus: DonationStatusResponse | null;
}

// Initial State
const initialState: VisitorDonationState = {
  status: "idle",
  error: null,
  paymentSessionId: null,
  orderId: null,
  donations: [],
  listStatus: "idle",
  listError: null,
  actionStatus: "idle",
  actionError: null,
  currentDonationStatus: null,
};

// --- Async Thunks (API Calls) ---

// 1. Donation initiate karne ke liye
export const initiateVisitorDonation = createAsyncThunk(
  "visitorDonation/initiate",
  async (formData: DonationFormData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/donate/initiate",
        formData
      );
      return data as PaymentInitResponse;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Payment initiation failed"
      );
    }
  }
);

// 2. Donation ka status check karne ke liye
export const checkDonationStatus = createAsyncThunk(
  "visitorDonation/checkStatus",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/donate/status/${orderId}`);
      return data as DonationStatusResponse;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to check donation status"
      );
    }
  }
);

// 3. Admin ke liye saare donations fetch karne ke liye
export const fetchAllVisitorDonations = createAsyncThunk(
  "visitorDonation/fetchAllAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/donate/admin/all");
      return data as VisitorDonation[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch donations"
      );
    }
  }
);

// 4. Admin dwara ek donation delete karne ke liye
export const deleteVisitorDonation = createAsyncThunk(
  "visitorDonation/delete",
  async (donationId: string, { rejectWithValue }) => {
    try {
      // Backend route se match karta hua URL
      await axiosInstance.delete(`/api/donate/admin/${donationId}`);
      return donationId; // Success par ID wapas bhejte hain
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete donation"
      );
    }
  }
);

// --- Slice Definition ---
const visitorDonationSlice = createSlice({
  name: "visitorDonation",
  initialState,
  reducers: {
    // State ko reset karne ke liye
    resetDonationState: (state) => {
      state.status = "idle";
      state.error = null;
      state.paymentSessionId = null;
      state.orderId = null;
      state.currentDonationStatus = null;
    },
    // Error clear karne ke liye
    clearError: (state) => {
      state.error = null;
      state.listError = null;
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initiate donation
      .addCase(initiateVisitorDonation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(initiateVisitorDonation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.paymentSessionId = action.payload.payment_session_id;
        state.orderId = action.payload.order_id;
      })
      .addCase(initiateVisitorDonation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Check donation status
      .addCase(checkDonationStatus.fulfilled, (state, action) => {
        state.currentDonationStatus = action.payload;
      })
      .addCase(checkDonationStatus.rejected, (state, action) => {
        state.error = action.payload as string; // Status page par error dikhane ke liye
      })

      // Fetch all donations (List)
      .addCase(fetchAllVisitorDonations.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchAllVisitorDonations.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.donations = action.payload;
      })
      .addCase(fetchAllVisitorDonations.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      })

      // Delete a donation (Action)
      .addCase(deleteVisitorDonation.pending, (state) => {
        state.actionStatus = "loading"; // Sirf actionStatus ko loading karte hain
        state.actionError = null;
      })
      .addCase(deleteVisitorDonation.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        // State se us donation ko filter karke hata dete hain jiska ID match karta hai
        state.donations = state.donations.filter(
          (d) => d._id !== action.payload
        );
      })
      .addCase(deleteVisitorDonation.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      });
  },
});

export const { resetDonationState, clearError } = visitorDonationSlice.actions;

export default visitorDonationSlice.reducer;
