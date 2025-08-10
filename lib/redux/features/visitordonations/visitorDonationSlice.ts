import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

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

export interface VisitorDonation extends DonationFormData {
  _id: string;
  transactionId: string;
  receiptNo?: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInitResponse {
  payment_session_id: string;
  order_id: string;
}

export interface DonationStatusResponse {
  status: "PENDING" | "SUCCESS" | "FAILED";
  receiptNo?: string;
  amount: number;
  createdAt: string;
}

interface VisitorDonationState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  paymentSessionId: string | null;
  orderId: string | null;
  donations: VisitorDonation[];
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  listError: string | null;
  currentDonationStatus: DonationStatusResponse | null;
}

const initialState: VisitorDonationState = {
  status: "idle",
  error: null,
  paymentSessionId: null,
  orderId: null,
  donations: [],
  listStatus: "idle",
  listError: null,
  currentDonationStatus: null,
};

// Initiate donation with correct endpoint
export const initiateVisitorDonation = createAsyncThunk(
  "visitorDonation/initiate",
  async (formData: DonationFormData, { rejectWithValue }) => {
    try {
      console.log("Initiating donation with data:", formData);
      const { data } = await axiosInstance.post(
        "/api/donate/initiate", // Match with server route
        formData
      );
      console.log("Donation initiated successfully:", data);
      return data as PaymentInitResponse;
    } catch (error: any) {
      console.error(
        "Donation initiation failed:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Payment initiation failed"
      );
    }
  }
);

// Check donation status
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

// Fetch all donations for admin
export const fetchAllVisitorDonations = createAsyncThunk(
  "visitorDonation/fetchAllAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/donate/admin/all"); // Match with server route
      return data as VisitorDonation[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch donations"
      );
    }
  }
);

// Delete donation (if you have this functionality)
export const deleteVisitorDonation = createAsyncThunk(
  "visitorDonation/delete",
  async (donationId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/visitor-donations/admin/${donationId}`);
      return donationId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete donation"
      );
    }
  }
);

const visitorDonationSlice = createSlice({
  name: "visitorDonation",
  initialState,
  reducers: {
    resetDonationState: (state) => {
      state.status = "idle";
      state.error = null;
      state.paymentSessionId = null;
      state.orderId = null;
      state.currentDonationStatus = null;
    },
    setOrderId: (state, action: PayloadAction<string>) => {
      state.orderId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.listError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initiate donation cases
      .addCase(initiateVisitorDonation.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.paymentSessionId = null;
        state.orderId = null;
      })
      .addCase(initiateVisitorDonation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.paymentSessionId = action.payload.payment_session_id;
        state.orderId = action.payload.order_id;
        state.error = null;
      })
      .addCase(initiateVisitorDonation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.paymentSessionId = null;
        state.orderId = null;
      })

      // Check donation status cases
      .addCase(checkDonationStatus.pending, (state) => {
        // Don't change main status, just track the checking
      })
      .addCase(checkDonationStatus.fulfilled, (state, action) => {
        state.currentDonationStatus = action.payload;
      })
      .addCase(checkDonationStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Fetch all donations cases
      .addCase(fetchAllVisitorDonations.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchAllVisitorDonations.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.donations = action.payload;
        state.listError = null;
      })
      .addCase(fetchAllVisitorDonations.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      })

      // Delete donation cases
      .addCase(deleteVisitorDonation.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(deleteVisitorDonation.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.donations = state.donations.filter(
          (d) => d._id !== action.payload
        );
      })
      .addCase(deleteVisitorDonation.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      });
  },
});

export const { resetDonationState, setOrderId, clearError } =
  visitorDonationSlice.actions;
export default visitorDonationSlice.reducer;
