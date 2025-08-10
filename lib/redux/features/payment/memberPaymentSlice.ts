import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

// Backend se aane wala response
interface PaymentInitResponse {
  payment_session_id: string;
  order_id: string;
}

interface MemberPaymentState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MemberPaymentState = {
  status: "idle",
  error: null,
};

// Yeh thunk backend /api/payment/member-payment endpoint ko call karega
export const initiateMemberPayment = createAsyncThunk(
  "payment/initiateMemberPayment",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/api/payment/member-payment");
      return data as PaymentInitResponse;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to initiate payment."
      );
    }
  }
);

const memberPaymentSlice = createSlice({
  name: "memberPayment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initiateMemberPayment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(initiateMemberPayment.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(initiateMemberPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default memberPaymentSlice.reducer;
