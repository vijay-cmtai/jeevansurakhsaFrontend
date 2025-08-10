import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

// --- SUB-INTERFACES FOR NESTED DATA ---
export interface Nominee {
  name: string;
  relation: string;
  age: number | string;
  gender: string;
  percentage: number | string;
}

export interface Address {
  houseNumber: string;
  street: string;
  cityVillage: string;
  pincode: string;
}

export interface Employment {
  type: string;
  department: string;
  companyName: string;
  contributionPlan: string;
}

// --- COMPLETE MEMBER INTERFACE ---
export interface Member {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  state: string;
  district: string;
  volunteerCode?: string;
  panNumber?: string;
  address?: Address;
  employment?: Employment;
  nominees?: Nominee[];
  membershipStatus: "Pending" | "Active" | "Blocked" | "Inactive";
  paymentStatus: "Pending" | "Paid" | "Failed";
  registrationNo?: string;
  profileImageUrl?: string;
  panImageUrl?: string;
  verifiedByAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  blockedAt?: string;
  blockedBy?: {
    fullName: string;
    email: string;
  };
}

interface PaginationState {
  page: number;
  pages: number;
  total: number;
  limit: number;
}

interface MembersState {
  newMembers: Member[];
  activeMembers: Member[];
  allMembers: Member[];
  blockedMembers: Member[];
  newMembersPagination: PaginationState;
  activeMembersPagination: PaginationState;
  allMembersPagination: PaginationState;
  blockedMembersPagination: PaginationState;
  selectedMember: Member | null;
  selectedIds: string[];
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  listError: string | null;
  actionError: string | null;
}

const initialPagination: PaginationState = {
  page: 1,
  pages: 1,
  total: 0,
  limit: 10,
};

const initialState: MembersState = {
  newMembers: [],
  activeMembers: [],
  allMembers: [],
  blockedMembers: [],
  newMembersPagination: initialPagination,
  activeMembersPagination: initialPagination,
  allMembersPagination: initialPagination,
  blockedMembersPagination: initialPagination,
  selectedMember: null,
  selectedIds: [],
  listStatus: "idle",
  actionStatus: "idle",
  listError: null,
  actionError: null,
};

// --- Async Thunks ---
interface FetchParams {
  page?: number;
  limit?: number;
  keyword?: string;
}

export const fetchNewMembers = createAsyncThunk(
  "members/fetchNew",
  async (params: FetchParams = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/members/new`, {
        params,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch new members"
      );
    }
  }
);

export const fetchActiveMembers = createAsyncThunk(
  "members/fetchActive",
  async (params: FetchParams = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/members/active`, {
        params,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch active members"
      );
    }
  }
);

export const fetchBlockedMembers = createAsyncThunk(
  "members/fetchBlocked",
  async (params: FetchParams = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/members/blocked`, {
        params,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blocked members"
      );
    }
  }
);

export const fetchMemberById = createAsyncThunk(
  "members/fetchById",
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

interface FetchAllParams extends FetchParams {
  status?: string;
}
export const fetchAllMembers = createAsyncThunk(
  "members/fetchAll",
  async (params: FetchAllParams = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/all-users/`, { params });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all members"
      );
    }
  }
);

export const verifyMember = createAsyncThunk(
  "members/verify",
  async (memberId: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/admin/members/${memberId}/verify`
      );
      return data.member;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify member"
      );
    }
  }
);

export const updateMemberByAdmin = createAsyncThunk(
  "members/updateByAdmin",
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

export const changeMemberStatusByAdmin = createAsyncThunk(
  "members/changeStatusByAdmin",
  async (
    {
      memberId,
      status,
      notes,
    }: {
      memberId: string;
      status: "Blocked" | "Inactive" | "Active";
      notes?: string;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      await axiosInstance.put(`/api/admin/members/${memberId}/status`, {
        status,
        notes,
      });
      const state = getState() as { members: MembersState };
      const member = [
        ...state.members.activeMembers,
        ...state.members.blockedMembers,
        ...state.members.allMembers,
      ].find((m) => m._id === memberId);
      return {
        member: member ? { ...member, membershipStatus: status } : null,
        oldStatus: member?.membershipStatus,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

export const deleteMember = createAsyncThunk(
  "members/delete",
  async (memberId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/admin/members/${memberId}`);
      return memberId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete member"
      );
    }
  }
);

export const deleteBulkMembers = createAsyncThunk(
  "members/deleteBulk",
  async (ids: string[], { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(`/api/all-users/delete-bulk`, {
        ids,
      });
      return { deletedIds: ids, message: data.message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete members"
      );
    }
  }
);

// --- USER-FACING ASYNC THUNK ---
export const updateMemberProfile = createAsyncThunk(
  "members/updateProfile",
  async (profileData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/members/profile`,
        profileData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data as Member;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// --- The Slice Definition ---
const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    toggleSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.selectedIds.indexOf(id);
      if (index >= 0) {
        state.selectedIds.splice(index, 1);
      } else {
        state.selectedIds.push(id);
      }
    },
    toggleSelectAll: (state, action: PayloadAction<string[]>) => {
      const pageIds = action.payload;
      const allSelectedOnPage = pageIds.every((id) =>
        state.selectedIds.includes(id)
      );
      if (allSelectedOnPage) {
        state.selectedIds = state.selectedIds.filter(
          (id) => !pageIds.includes(id)
        );
      } else {
        const newIds = pageIds.filter((id) => !state.selectedIds.includes(id));
        state.selectedIds.push(...newIds);
      }
    },
    clearSelection: (state) => {
      state.selectedIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Fetch Cases
      .addCase(fetchNewMembers.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchNewMembers.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.newMembers = action.payload.members;
        state.newMembersPagination = {
          ...state.newMembersPagination,
          ...action.payload,
        };
      })
      .addCase(fetchNewMembers.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      })
      .addCase(fetchActiveMembers.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchActiveMembers.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.activeMembers = action.payload.members;
        state.activeMembersPagination = {
          ...state.activeMembersPagination,
          ...action.payload,
        };
      })
      .addCase(fetchActiveMembers.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      })
      .addCase(fetchBlockedMembers.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchBlockedMembers.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.blockedMembers = action.payload.members;
        state.blockedMembersPagination = {
          ...state.blockedMembersPagination,
          ...action.payload,
        };
      })
      .addCase(fetchBlockedMembers.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      })
      .addCase(fetchAllMembers.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchAllMembers.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.allMembers = action.payload.members;
        state.allMembersPagination = {
          ...state.allMembersPagination,
          ...action.payload,
        };
      })
      .addCase(fetchAllMembers.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      })
      .addCase(fetchMemberById.pending, (state) => {
        state.listStatus = "loading";
        state.selectedMember = null;
      })
      .addCase(fetchMemberById.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.selectedMember = action.payload;
      })
      .addCase(fetchMemberById.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      })

      // Admin Action Cases
      .addCase(verifyMember.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(verifyMember.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.newMembers = state.newMembers.filter(
          (m) => m._id !== action.payload._id
        );
      })
      .addCase(verifyMember.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })
      .addCase(updateMemberByAdmin.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(updateMemberByAdmin.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const updatedMember = action.payload;
        const listsToUpdate: (keyof MembersState)[] = [
          "newMembers",
          "activeMembers",
          "allMembers",
          "blockedMembers",
        ];
        listsToUpdate.forEach((key) => {
          const list = state[key] as Member[];
          if (Array.isArray(list)) {
            const index = list.findIndex((m) => m._id === updatedMember._id);
            if (index !== -1) list[index] = updatedMember;
          }
        });
        state.selectedMember = updatedMember;
      })
      .addCase(updateMemberByAdmin.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })
      .addCase(changeMemberStatusByAdmin.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(changeMemberStatusByAdmin.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const { member } = action.payload;
        if (!member) return;
        state.activeMembers = state.activeMembers.filter(
          (m) => m._id !== member._id
        );
        state.blockedMembers = state.blockedMembers.filter(
          (m) => m._id !== member._id
        );
        if (member.membershipStatus === "Blocked")
          state.blockedMembers.unshift(member);
        else if (member.membershipStatus === "Active")
          state.activeMembers.unshift(member);
        const allMembersIndex = state.allMembers.findIndex(
          (m) => m._id === member._id
        );
        if (allMembersIndex !== -1) state.allMembers[allMembersIndex] = member;
      })
      .addCase(changeMemberStatusByAdmin.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })
      .addCase(deleteMember.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const memberId = action.payload;
        state.newMembers = state.newMembers.filter((m) => m._id !== memberId);
        state.activeMembers = state.activeMembers.filter(
          (m) => m._id !== memberId
        );
        state.allMembers = state.allMembers.filter((m) => m._id !== memberId);
        state.blockedMembers = state.blockedMembers.filter(
          (m) => m._id !== memberId
        );
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })
      .addCase(deleteBulkMembers.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(deleteBulkMembers.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const { deletedIds } = action.payload;
        state.allMembers = state.allMembers.filter(
          (m) => !deletedIds.includes(m._id)
        );
        state.newMembers = state.newMembers.filter(
          (m) => !deletedIds.includes(m._id)
        );
        state.activeMembers = state.activeMembers.filter(
          (m) => !deletedIds.includes(m._id)
        );
        state.blockedMembers = state.blockedMembers.filter(
          (m) => !deletedIds.includes(m._id)
        );
        state.selectedIds = [];
      })
      .addCase(deleteBulkMembers.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })

      // --- User Profile Update Cases ---
      .addCase(updateMemberProfile.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(updateMemberProfile.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.selectedMember = action.payload;
      })
      .addCase(updateMemberProfile.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      });
  },
});

export const { toggleSelection, toggleSelectAll, clearSelection } =
  membersSlice.actions;
export default membersSlice.reducer;
