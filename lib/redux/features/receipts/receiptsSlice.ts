import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

// --- TypeScript Type Definitions ---
// These types should match your Payment model and the populated user/member data
export interface Receipt {
  _id: string;
  receiptNo: string;
  paymentType:
    | "MEMBERSHIP_FEE"
    | "MEMBER_DONATION"
    | "VISITOR_DONATION"
    | "CASH_DONATION";
  amount: number;
  paymentMode: "Online" | "Cash";
  transactionId?: string;
  paymentImageUrl?: string; // Added for cash donations
  paymentDate: string;
  createdAt: string;
  user?: {
    // For registered members
    _id: string;
    name: string; // Assuming 'fullName' is aliased or present
    memberId?: string;
    email?: string;
    mobile?: string;
  };
  nonMemberDetails?: {
    // For visitors/cash donations
    name: string;
    email?: string;
    mobile?: string;
  };
}

interface ReceiptsState {
  receipts: Receipt[];
  totalAmount: number;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  listError: string | null;
  actionError: string | null;
}

const initialState: ReceiptsState = {
  receipts: [],
  totalAmount: 0,
  listStatus: "idle",
  actionStatus: "idle",
  listError: null,
  actionError: null,
};

// --- Async Thunks for API Calls ---

interface FetchParams {
  type:
    | "MEMBERSHIP_FEE"
    | "MEMBER_DONATION"
    | "VISITOR_DONATION"
    | "CASH_DONATION"
    | "ALL";
  keyword?: string;
}

// Thunk to fetch receipts based on type and keyword
export const fetchReceipts = createAsyncThunk(
  "receipts/fetchAll",
  async ({ type, keyword = "" }: FetchParams, { rejectWithValue }) => {
    try {
      const params: any = {};
      if (type !== "ALL") {
        params.type = type;
      }
      if (keyword) {
        params.keyword = keyword;
      }

      // CORRECTED URL based on your backend route setup
      const { data } = await axiosInstance.get("/api/receipts/", {
        params,
      });
      return data as Receipt[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch receipts"
      );
    }
  }
);

// Thunk to DELETE a receipt
export const deleteReceipt = createAsyncThunk(
  "receipts/delete",
  async (receiptId: string, { rejectWithValue }) => {
    try {
      // CORRECTED URL
      await axiosInstance.delete(`/api/receipts/${receiptId}`);
      return receiptId; // Return ID for easy removal from state
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete receipt"
      );
    }
  }
);

// --- The Slice Definition ---
const receiptsSlice = createSlice({
  name: "receipts",
  initialState,
  reducers: {
    // Synchronous action to clear state when navigating away, if needed
    clearReceipts: (state) => {
      state.receipts = [];
      state.totalAmount = 0;
      state.listStatus = "idle";
      state.listError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Reducers for fetching list
      .addCase(fetchReceipts.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(
        fetchReceipts.fulfilled,
        (state, action: PayloadAction<Receipt[]>) => {
          state.listStatus = "succeeded";
          state.receipts = action.payload;
          // Calculate total amount on the client-side
          state.totalAmount = action.payload.reduce(
            (sum, receipt) => sum + receipt.amount,
            0
          );
        }
      )
      .addCase(fetchReceipts.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      })

      // Reducers for deleting a receipt
      .addCase(deleteReceipt.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(
        deleteReceipt.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionStatus = "succeeded";
          const deletedReceipt = state.receipts.find(
            (r) => r._id === action.payload
          );
          if (deletedReceipt) {
            state.totalAmount -= deletedReceipt.amount;
          }
          state.receipts = state.receipts.filter(
            (r) => r._id !== action.payload
          );
        }
      )
      .addCase(deleteReceipt.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      });
  },
});

export const { clearReceipts } = receiptsSlice.actions;
export default receiptsSlice.reducer;
