import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

// The data structure returned from the backend
interface PaymentInitResponse {
  payment_session_id: string;
  order_id: string;
}

// The state for this feature
interface MemberPaymentState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  paymentSessionId: string | null;
  orderId: string | null;
}

const initialState: MemberPaymentState = {
  status: "idle",
  error: null,
  paymentSessionId: null,
  orderId: null,
};

// Async Thunk to initiate the member payment
export const initiateMemberPayment = createAsyncThunk(
  "memberPayment/initiate",
  async (_, { rejectWithValue }) => {
    try {
      // This calls the protected POST /api/payment/member/pay endpoint.
      // Axios will automatically add the member's auth token.
      const { data } = await axiosInstance.post("/api/payment/member/pay");
      return data as PaymentInitResponse;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Payment initiation failed"
      );
    }
  }
);

const memberPaymentSlice = createSlice({
  name: "memberPayment",
  initialState,
  reducers: {
    resetMemberPaymentState: (state) => {
      state.status = "idle";
      state.error = null;
      state.paymentSessionId = null;
      state.orderId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateMemberPayment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(initiateMemberPayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.paymentSessionId = action.payload.payment_session_id;
        state.orderId = action.payload.order_id;
      })
      .addCase(initiateMemberPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetMemberPaymentState } = memberPaymentSlice.actions;
export default memberPaymentSlice.reducer;
