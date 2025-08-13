import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import { Member } from "../members/membersSlice"; // Member interface ko reuse karein

// --- Slice State ki Interface ---
interface AdminEditMemberState {
  member: Member | null;
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// --- Initial State ---
const initialState: AdminEditMemberState = {
  member: null,
  fetchStatus: "idle",
  updateStatus: "idle",
  error: null,
};

// --- Async Thunks ---

// 1. Ek member ko ID se fetch karne ke liye Thunk
export const fetchMemberByIdForEdit = createAsyncThunk(
  "adminEditMember/fetchById",
  async (memberId: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/members/${memberId}`
      );
      return data as Member;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch member details"
      );
    }
  }
);

// 2. Member ko update karne ke liye Thunk
export const updateMemberByAdmin = createAsyncThunk(
  "adminEditMember/updateByAdmin",
  async (
    { memberId, formData }: { memberId: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/admin/members/${memberId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data as Member;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update member"
      );
    }
  }
);

// --- Slice Definition ---
const adminEditMemberSlice = createSlice({
  name: "adminEditMember",
  initialState,
  reducers: {
    // Page se jaate waqt state ko reset karne ke liye
    clearEditMemberState: (state) => {
      state.member = null;
      state.fetchStatus = "idle";
      state.updateStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Member Cases
      .addCase(fetchMemberByIdForEdit.pending, (state) => {
        state.fetchStatus = "loading";
        state.member = null;
        state.error = null;
      })
      .addCase(
        fetchMemberByIdForEdit.fulfilled,
        (state, action: PayloadAction<Member>) => {
          state.fetchStatus = "succeeded";
          state.member = action.payload;
        }
      )
      .addCase(fetchMemberByIdForEdit.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.payload as string;
      })

      // Update Member Cases
      .addCase(updateMemberByAdmin.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })
      .addCase(
        updateMemberByAdmin.fulfilled,
        (state, action: PayloadAction<Member>) => {
          state.updateStatus = "succeeded";
          state.member = action.payload; // Update ke baad naya data store karein
        }
      )
      .addCase(updateMemberByAdmin.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearEditMemberState } = adminEditMemberSlice.actions;
export default adminEditMemberSlice.reducer;
