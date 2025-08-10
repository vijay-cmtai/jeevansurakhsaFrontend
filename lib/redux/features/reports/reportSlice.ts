import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

interface ReportState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  downloadingType: string | null; // To track which specific report is downloading
}

const initialState: ReportState = {
  status: "idle",
  error: null,
  downloadingType: null,
};

// --- Async Thunk to Download a Report ---
export const downloadReport = createAsyncThunk(
  "reports/download",
  async (
    { type, fileName }: { type: "new" | "active"; fileName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/api/reports/download/members?type=${type}`,
        {
          responseType: "blob",
        }
      );

      // Create a URL for the file blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { type }; // Return the type on success
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to download report"
      );
    }
  }
);

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(downloadReport.pending, (state, action) => {
        state.status = "loading";
        state.downloadingType = action.meta.arg.type;
        state.error = null;
      })
      .addCase(downloadReport.fulfilled, (state) => {
        state.status = "succeeded";
        state.downloadingType = null;
      })
      .addCase(downloadReport.rejected, (state, action) => {
        state.status = "failed";
        state.downloadingType = null;
        state.error = action.payload as string;
      });
  },
});

export default reportSlice.reducer;
