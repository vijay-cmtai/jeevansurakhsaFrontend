// File: lib/redux/features/claims/claimsSlice.js (Pure JavaScript Version)

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

/**
 * @typedef {Object} Claim
 * @property {string} _id
 * @property {{_id: string, fullName: string, profileImageUrl?: string, registrationNo?: string}} deceasedMember
 * @property {string} [deceasedMemberPhotoUrl]
 * @property {string} [deathCertificateUrl]
 * @property {{name: string, accountNumber: string, ifscCode?: string, bankName?: string}} nomineeDetails
 * @property {string} contributionPlan
 * @property {number} contributionAmountRequired
 * @property {string} claimStatus
 * @property {string} dateOfDeath
 * @property {string} createdAt
 */

/**
 * @typedef {Object} ClaimsState
 * @property {Claim[]} claims
 * @property {'idle' | 'loading' | 'succeeded' | 'failed'} listStatus
 * @property {'idle' | 'loading' | 'succeeded' | 'failed'} actionStatus
 * @property {string | null} error
 */

/** @type {ClaimsState} */
const initialState = {
  claims: [],
  listStatus: "idle",
  actionStatus: "idle",
  error: null,
};

export const reportPublicClaim = createAsyncThunk(
  "claims/reportPublic",
  async (claimData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/api/claims", claimData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to report claim"
      );
    }
  }
);

export const fetchPublicClaims = createAsyncThunk(
  "claims/fetchPublic",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/claims/active");
      return data; // No need for 'as Claim[]'
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch active claims"
      );
    }
  }
);

export const fetchClaimsByAdmin = createAsyncThunk(
  "claims/fetchAllAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/claims/admin");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch claims"
      );
    }
  }
);

export const updateClaimByAdmin = createAsyncThunk(
  "claims/updateAdmin",
  async ({ id, claimData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/claims/admin/${id}`,
        claimData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update claim"
      );
    }
  }
);

export const deleteClaimByAdmin = createAsyncThunk(
  "claims/deleteAdmin",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/claims/admin/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete claim"
      );
    }
  }
);

const claimsSlice = createSlice({
  name: "claims",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(reportPublicClaim.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(reportPublicClaim.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(reportPublicClaim.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchPublicClaims.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchPublicClaims.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.claims = action.payload;
      })
      .addCase(fetchPublicClaims.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchClaimsByAdmin.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchClaimsByAdmin.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.claims = action.payload;
      })
      .addCase(fetchClaimsByAdmin.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      })
      .addCase(updateClaimByAdmin.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(updateClaimByAdmin.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const index = state.claims.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.claims[index] = action.payload;
        }
      })
      .addCase(updateClaimByAdmin.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })
      .addCase(deleteClaimByAdmin.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(deleteClaimByAdmin.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.claims = state.claims.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteClaimByAdmin.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      });
  },
});

export default claimsSlice.reducer;
