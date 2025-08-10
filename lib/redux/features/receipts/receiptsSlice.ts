import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

// --- TYPE DEFINITIONS ---
// This interface defines the shape of a single receipt object, including the nested member details.
export interface Receipt {
  _id: string;
  receiptNo: string;
  receiptType: "REGISTRATION" | "MEMBER_DONATION" | "VISITOR_DONATION";
  amount: number;
  createdAt: string;
  
  member?: {
    _id: string;
    fullName: string;
    memberId?: string;
    email?: string;
    mobile?: string;
  };
}

// Defines the structure of the entire state managed by this slice.
interface ReceiptsState {
  // State for a logged-in member viewing their own receipts
  myReceipts: Receipt[];
  myReceiptsStatus: "idle" | "loading" | "succeeded" | "failed";

  // State for an admin viewing all receipts
  allReceipts: Receipt[];
  totalAmount: number;
  listStatus: "idle" | "loading" | "succeeded" | "failed";

  // Status for actions like deleting a receipt
  actionStatus: "idle" | "loading" | "succeeded" | "failed";

  // A general field to store any errors from API calls
  error: string | null;
}

// The initial state when the application loads.
const initialState: ReceiptsState = {
  // Member-specific state
  myReceipts: [],
  myReceiptsStatus: "idle",

  // Admin-specific state
  allReceipts: [],
  totalAmount: 0,
  listStatus: "idle",

  // Action status
  actionStatus: "idle",

  // General state
  error: null,
};

// --- ASYNC THUNKS (API Calls) ---

/**
 * @description [MEMBER] Fetches the receipts for the currently logged-in member.
 */
export const fetchMyReceipts = createAsyncThunk(
  "receipts/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/receipts/my-receipts");
      return data as Receipt[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your receipts."
      );
    }
  }
);

/**
 * @description [ADMIN] Fetches all receipts from all members.
 */
export const fetchAllReceipts = createAsyncThunk(
  "receipts/fetchAllAdmin",
  async (_, { rejectWithValue }) => {
    try {
      // The endpoint is the root of receipt routes, e.g., /api/receipts/
      const { data } = await axiosInstance.get("/api/receipts/");
      return data as Receipt[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch all receipts for admin."
      );
    }
  }
);

/**
 * @description [ADMIN] Deletes a specific receipt by its ID.
 */
export const deleteReceipt = createAsyncThunk(
  "receipts/delete",
  async (receiptId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/receipts/${receiptId}`);
      return receiptId; // Return the ID on success for easy removal from state
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete the receipt."
      );
    }
  }
);

// --- THE REDUX SLICE DEFINITION ---

const receiptsSlice = createSlice({
  name: "receipts",
  initialState,
  // Reducers for synchronous state updates, like clearing state on logout
  reducers: {
    clearReceiptsState: (state) => {
      state.myReceipts = [];
      state.myReceiptsStatus = "idle";
      state.allReceipts = [];
      state.listStatus = "idle";
      state.error = null;
    },
  },
  // Reducers for handling the lifecycle of async thunks
  extraReducers: (builder) => {
    builder
      // Cases for: Fetching a single member's receipts
      .addCase(fetchMyReceipts.pending, (state) => {
        state.myReceiptsStatus = "loading";
        state.error = null;
      })
      .addCase(
        fetchMyReceipts.fulfilled,
        (state, action: PayloadAction<Receipt[]>) => {
          state.myReceiptsStatus = "succeeded";
          state.myReceipts = action.payload;
        }
      )
      .addCase(fetchMyReceipts.rejected, (state, action) => {
        state.myReceiptsStatus = "failed";
        state.error = action.payload as string;
      })

      // Cases for: Fetching ALL member receipts (for Admin)
      .addCase(fetchAllReceipts.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(
        fetchAllReceipts.fulfilled,
        (state, action: PayloadAction<Receipt[]>) => {
          state.listStatus = "succeeded";
          state.allReceipts = action.payload;
          // Calculate the total amount from all fetched receipts
          state.totalAmount = action.payload.reduce(
            (sum, receipt) => sum + receipt.amount,
            0
          );
        }
      )
      .addCase(fetchAllReceipts.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload as string;
      })

      // Cases for: Deleting a receipt (for Admin)
      .addCase(deleteReceipt.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(
        deleteReceipt.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionStatus = "succeeded";
          // Find the deleted receipt to subtract its amount from the total
          const deletedReceipt = state.allReceipts.find(
            (r) => r._id === action.payload
          );
          if (deletedReceipt) {
            state.totalAmount -= deletedReceipt.amount;
          }
          // Remove the deleted receipt from the state array
          state.allReceipts = state.allReceipts.filter(
            (r) => r._id !== action.payload
          );
        }
      )
      .addCase(deleteReceipt.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

// Export the synchronous actions to be used in components
export const { clearReceiptsState } = receiptsSlice.actions;

// Export the reducer to be included in the main Redux store
export default receiptsSlice.reducer;
