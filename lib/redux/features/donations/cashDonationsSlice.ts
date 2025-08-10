import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

// --- TypeScript Type Definitions ---
export interface CashDonation {
  _id: string;
  receiptNo: string;
  name: string;
  email?: string;
  mobile: string;
  address?: string;
  amount: number;
  panNumber?: string;
  bankName?: string;
  branchName?: string;
  paymentImageUrl?: string;
  receivedBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface PaginationState {
  page: number;
  pages: number;
  totalRecords: number;
}

interface CashDonationsState {
  donations: CashDonation[];
  pagination: PaginationState;
  totalDonationAmount: number;
  selectedDonation: CashDonation | null;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  downloadStatus: "idle" | "loading" | "succeeded" | "failed"; // For download-specific state
  listError: string | null;
  actionError: string | null;
  downloadError: string | null; // For download-specific errors
}

const initialState: CashDonationsState = {
  donations: [],
  pagination: {
    page: 1,
    pages: 1,
    totalRecords: 0,
  },
  totalDonationAmount: 0,
  selectedDonation: null,
  listStatus: "idle",
  actionStatus: "idle",
  downloadStatus: "idle",
  listError: null,
  actionError: null,
  downloadError: null,
};

// --- Async Thunks for API Calls ---

interface FetchParams {
  page?: number;
  limit?: number;
  keyword?: string;
}

export const fetchCashDonations = createAsyncThunk(
  "cashDonations/fetchAll",
  async (params: FetchParams = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/admin/donations/cash", {
        params,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch donations"
      );
    }
  }
);

export const createCashDonation = createAsyncThunk(
  "cashDonations/create",
  async (donationFormData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/admin/donations/cash",
        donationFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data.donation as CashDonation;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create donation"
      );
    }
  }
);

export const deleteCashDonation = createAsyncThunk(
  "cashDonations/delete",
  async (donationId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/admin/donations/cash/${donationId}`);
      return donationId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete donation"
      );
    }
  }
);

export const downloadCashDonationReceipt = createAsyncThunk(
  "cashDonations/downloadReceipt",
  async (
    { donationId, fileName }: { donationId: string; fileName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/api/admin/donations/cash/${donationId}/receipt`,
        { responseType: "blob" } // Expect a file
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      return donationId;
    } catch (error: any) {
      const errorData = await (error.response?.data as Blob)?.text();
      try {
        const errorJson = JSON.parse(errorData);
        return rejectWithValue(
          errorJson.message || "Failed to download receipt"
        );
      } catch (parseError) {
        return rejectWithValue("An unknown error occurred during download");
      }
    }
  }
);

// --- The Slice Definition ---
const cashDonationsSlice = createSlice({
  name: "cashDonations",
  initialState,
  reducers: {
    selectDonation: (state, action: PayloadAction<CashDonation | null>) => {
      state.selectedDonation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetching list
      .addCase(fetchCashDonations.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchCashDonations.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.donations = action.payload.donations;
        state.totalDonationAmount = action.payload.totalDonation;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          totalRecords: action.payload.total,
        };
      })
      .addCase(fetchCashDonations.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      })

      // Creating a donation
      .addCase(createCashDonation.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(createCashDonation.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.donations.unshift(action.payload);
        state.totalDonationAmount += action.payload.amount;
      })
      .addCase(createCashDonation.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })

      // Deleting a donation
      .addCase(deleteCashDonation.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(deleteCashDonation.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const deletedDonation = state.donations.find(
          (d) => d._id === action.payload
        );
        if (deletedDonation) {
          state.totalDonationAmount -= deletedDonation.amount;
        }
        state.donations = state.donations.filter(
          (d) => d._id !== action.payload
        );
      })
      .addCase(deleteCashDonation.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })

      // Downloading a receipt
      .addCase(downloadCashDonationReceipt.pending, (state) => {
        state.downloadStatus = "loading";
        state.downloadError = null;
      })
      .addCase(downloadCashDonationReceipt.fulfilled, (state) => {
        state.downloadStatus = "succeeded";
      })
      .addCase(downloadCashDonationReceipt.rejected, (state, action) => {
        state.downloadStatus = "failed";
        state.downloadError = action.payload as string;
      });
  },
});

export const { selectDonation } = cashDonationsSlice.actions;
export default cashDonationsSlice.reducer;
