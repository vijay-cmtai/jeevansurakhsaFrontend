import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import { Member } from "../members/membersSlice";

export type EligibleMember = Member;

export interface GeneratedCertificate {
  _id: string;
  certificateNo: string;
  member: EligibleMember;
  fatherName: string;
  programName: string;
  certificateUrl?: string;
  generatedBy: {
    _id?: string;
    name: string;
  };
  createdAt: string;
}

export interface MyCertificate {
  _id: string;
  certificateNo: string;
  fatherName: string;
  programName: string;
  certificateUrl: string;
  createdAt: string;
}

interface MemberCertificatesState {
  eligibleMembers: EligibleMember[];
  generatedCertificates: GeneratedCertificate[];
  myCertificates: MyCertificate[];
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  listError: string | null;
  actionError: string | null;
}

const initialState: MemberCertificatesState = {
  eligibleMembers: [],
  generatedCertificates: [],
  myCertificates: [],
  listStatus: "idle",
  actionStatus: "idle",
  listError: null,
  actionError: null,
};

export const fetchEligibleMembers = createAsyncThunk(
  "memberCertificates/fetchEligible",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        "/api/admin/member-certificates/eligible"
      );
      return data as EligibleMember[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch eligible members"
      );
    }
  }
);

export const fetchGeneratedCertificates = createAsyncThunk(
  "memberCertificates/fetchGenerated",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        "/api/admin/member-certificates/generated"
      );
      return data as GeneratedCertificate[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch generated certificates"
      );
    }
  }
);

interface GenerateParams {
  memberId: string;
  fatherName: string;
  programName: string;
  templateId: string;
}

export const generateCertificate = createAsyncThunk(
  "memberCertificates/generate",
  async ({ memberId, ...body }: GenerateParams, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/admin/member-certificates/generate/${memberId}`,
        body
      );
      return data.certificate as GeneratedCertificate;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate certificate"
      );
    }
  }
);

export const deleteCertificate = createAsyncThunk(
  "memberCertificates/delete",
  async (certificateId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `/api/admin/member-certificates/${certificateId}`
      );
      return certificateId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete certificate"
      );
    }
  }
);

export const fetchMyCertificates = createAsyncThunk(
  "memberCertificates/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/members/my-certificates");
      return data as MyCertificate[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your certificates"
      );
    }
  }
);

const memberCertificatesSlice = createSlice({
  name: "memberCertificates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEligibleMembers.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(
        fetchEligibleMembers.fulfilled,
        (state, action: PayloadAction<EligibleMember[]>) => {
          state.listStatus = "succeeded";
          state.eligibleMembers = action.payload;
        }
      )
      .addCase(fetchEligibleMembers.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      })
      .addCase(fetchGeneratedCertificates.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(
        fetchGeneratedCertificates.fulfilled,
        (state, action: PayloadAction<GeneratedCertificate[]>) => {
          state.listStatus = "succeeded";
          state.generatedCertificates = action.payload;
        }
      )
      .addCase(fetchGeneratedCertificates.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      })
      .addCase(generateCertificate.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(
        generateCertificate.fulfilled,
        (state, action: PayloadAction<GeneratedCertificate>) => {
          state.actionStatus = "succeeded";
          const newCertificate = action.payload;
          state.generatedCertificates.unshift(newCertificate);
          state.eligibleMembers = state.eligibleMembers.filter(
            (member) => member._id !== newCertificate.member._id
          );
        }
      )
      .addCase(generateCertificate.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })
      .addCase(deleteCertificate.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(
        deleteCertificate.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionStatus = "succeeded";
          const deletedId = action.payload;
          state.generatedCertificates = state.generatedCertificates.filter(
            (cert) => cert._id !== deletedId
          );
        }
      )
      .addCase(deleteCertificate.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })
      .addCase(fetchMyCertificates.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(
        fetchMyCertificates.fulfilled,
        (state, action: PayloadAction<MyCertificate[]>) => {
          state.listStatus = "succeeded";
          state.myCertificates = action.payload;
        }
      )
      .addCase(fetchMyCertificates.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      });
  },
});

export default memberCertificatesSlice.reducer;
