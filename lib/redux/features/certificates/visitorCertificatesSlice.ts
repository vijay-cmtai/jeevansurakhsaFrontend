import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

// --- TypeScript Type Definitions ---
export interface VisitorCertificate {
  _id: string;
  certificateNo: string;
  name: string;
  fatherName: string;
  mobile: string;
  email?: string;
  programName: string;
  templateId: string;
  certificateUrl: string;
  generatedBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface PaginationState {
  page: number;
  pages: number;
  total: number;
}

interface VisitorCertificatesState {
  certificates: VisitorCertificate[];
  pagination: PaginationState;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed"; // For create/delete
  downloadStatus: "idle" | "loading" | "succeeded" | "failed"; // For downloads
  listError: string | null;
  actionError: string | null;
  downloadError: string | null;
}

const initialState: VisitorCertificatesState = {
  certificates: [],
  pagination: { page: 1, pages: 1, total: 0 },
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

export const fetchVisitorCertificates = createAsyncThunk(
  "visitorCertificates/fetchAll",
  async (params: FetchParams = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        "/api/admin/visitor-certificates",
        { params }
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch certificates"
      );
    }
  }
);

interface GenerateParams {
  name: string;
  fatherName: string;
  mobile: string;
  email?: string;
  programName: string;
  templateId: string;
}
export const generateVisitorCertificate = createAsyncThunk(
  "visitorCertificates/generate",
  async (formData: GenerateParams, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/admin/visitor-certificates/generate",
        formData
      );
      return data.certificate as VisitorCertificate;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate certificate"
      );
    }
  }
);

export const deleteVisitorCertificate = createAsyncThunk(
  "visitorCertificates/delete",
  async (certificateId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `/api/admin/visitor-certificates/${certificateId}`
      );
      return certificateId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete certificate"
      );
    }
  }
);

export const downloadVisitorCertificate = createAsyncThunk(
  "visitorCertificates/download",
  async (
    { certificateId, fileName }: { certificateId: string; fileName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/api/admin/visitor-certificates/download/${certificateId}`,
        {
          responseType: "blob", // Expect a binary file as the response
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Set the suggested filename
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      return certificateId; // Return the ID on success for tracking
    } catch (error: any) {
      // Try to parse the error blob to see if there's a JSON message inside
      const errorData = await (error.response?.data as Blob)?.text();
      try {
        const errorJson = JSON.parse(errorData);
        return rejectWithValue(
          errorJson.message || "Failed to download certificate"
        );
      } catch (parseError) {
        return rejectWithValue("An unknown error occurred during download");
      }
    }
  }
);

// --- The Slice Definition ---
const visitorCertificatesSlice = createSlice({
  name: "visitorCertificates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Reducers for fetching list
      .addCase(fetchVisitorCertificates.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchVisitorCertificates.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.certificates = action.payload.certificates;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(fetchVisitorCertificates.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      })

      // Reducers for generating a certificate
      .addCase(generateVisitorCertificate.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(generateVisitorCertificate.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.certificates.unshift(action.payload);
      })
      .addCase(generateVisitorCertificate.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })

      // Reducers for deleting a certificate
      .addCase(deleteVisitorCertificate.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(deleteVisitorCertificate.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.certificates = state.certificates.filter(
          (c) => c._id !== action.payload
        );
      })
      .addCase(deleteVisitorCertificate.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })

      // Reducers for the download action
      .addCase(downloadVisitorCertificate.pending, (state) => {
        state.downloadStatus = "loading";
        state.downloadError = null;
      })
      .addCase(downloadVisitorCertificate.fulfilled, (state) => {
        state.downloadStatus = "succeeded";
      })
      .addCase(downloadVisitorCertificate.rejected, (state, action) => {
        state.downloadStatus = "failed";
        state.downloadError = action.payload as string;
      });
  },
});

export default visitorCertificatesSlice.reducer;
