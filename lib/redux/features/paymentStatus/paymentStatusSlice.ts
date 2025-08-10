import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import { VisitorDonation } from "@/lib/redux/features/visitordonations/visitorDonationSlice";

// --- CORRECTED LINE ---
// Add the 'export' keyword so other files can import this type
export interface MemberRecord {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  registrationNo?: string;
  paymentStatus: "Paid" | "Pending";
  createdAt: string;
  amount: number;
}

export interface PaymentStatusResponse {
  success: boolean;
  cashfree_status:
    | "PAID"
    | "ACTIVE"
    | "FAILED"
    | "PENDING"
    | "UNKNOWN"
    | string;
  local_status: "PENDING" | "SUCCESS" | "FAILED" | "Paid";
  transactionRecord: VisitorDonation | MemberRecord;
  message?: string;
  note?: string;
}

interface PaymentStatusState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  paymentDetails: PaymentStatusResponse | null;
}

const initialState: PaymentStatusState = {
  status: "idle",
  error: null,
  paymentDetails: null,
};

export const checkPaymentStatus = createAsyncThunk(
  "paymentStatus/check",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/payment/status/${orderId}`
      );
      return data as PaymentStatusResponse;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch payment status"
      );
    }
  }
);

const paymentStatusSlice = createSlice({
  name: "paymentStatus",
  initialState,
  reducers: {
    resetPaymentStatus: (state) => {
      state.status = "idle";
      state.error = null;
      state.paymentDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkPaymentStatus.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(checkPaymentStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.paymentDetails = action.payload;
      })
      .addCase(checkPaymentStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetPaymentStatus } = paymentStatusSlice.actions;
export default paymentStatusSlice.reducer;
