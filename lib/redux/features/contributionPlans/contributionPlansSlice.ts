import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

// --- TYPESCRIPT INTERFACES TO MATCH BACKEND SCHEMA ---

// Individual plan detail
interface Plan {
  _id: string;
  planDetails: string;
}

// Department containing multiple plans
interface Department {
  _id: string;
  departmentName: string;
  plans: Plan[];
}

// Company containing multiple departments
interface Company {
  _id: string;
  companyName: string;
  departments: Department[];
}

// The main group document for an employment type
export interface ContributionGroup {
  _id: string;
  recordId: string;
  employmentType: string;
  companies: Company[];
  createdBy: string; // Ref to the User/Admin
  createdAt: string;
  updatedAt: string;
}

interface ContributionState {
  groups: ContributionGroup[];
  selectedGroup: ContributionGroup | null;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  listError: string | null;
  actionError: string | null;
}

const initialState: ContributionState = {
  groups: [],
  selectedGroup: null,
  listStatus: "idle",
  actionStatus: "idle",
  listError: null,
  actionError: null,
};

// --- TYPES FOR THE PAYLOAD OF THE NEW DYNAMIC FORM ---

// This matches the nested structure of your form state
interface AddPlanData {
  departmentName: string;
  plans: string[];
}
interface AddCompanyData {
  companyName: string;
  departments: AddPlanData[];
}
export interface AddGroupParams {
  employmentType: string;
  companies: AddCompanyData[];
}

// --- ASYNC THUNKS ---

export const fetchContributionGroups = createAsyncThunk(
  "contributionPlans/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/contribution-plans/");
      return data as ContributionGroup[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch groups"
      );
    }
  }
);

// This is the updated thunk for creating/updating a group
export const addOrUpdatePlan = createAsyncThunk(
  "contributionPlans/addOrUpdate",
  async (groupData: AddGroupParams, { rejectWithValue }) => {
    // The payload type is now AddGroupParams
    try {
      const { data } = await axiosInstance.post(
        "/api/contribution-plans/",
        groupData
      );
      return data as ContributionGroup;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add/update group"
      );
    }
  }
);

export const deleteContributionGroup = createAsyncThunk(
  "contributionPlans/delete",
  async (groupId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/contribution-plans/${groupId}`);
      return groupId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete group"
      );
    }
  }
);

// --- The Slice Definition ---
const contributionPlansSlice = createSlice({
  name: "contributionPlans",
  initialState,
  reducers: {
    selectGroupForEdit: (
      state,
      action: PayloadAction<ContributionGroup | null>
    ) => {
      state.selectedGroup = action.payload;
    },
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetching groups
      .addCase(fetchContributionGroups.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchContributionGroups.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.groups = action.payload;
      })
      .addCase(fetchContributionGroups.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      })

      // Adding/Updating a group
      .addCase(addOrUpdatePlan.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(addOrUpdatePlan.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const updatedGroup = action.payload;
        const index = state.groups.findIndex((g) => g._id === updatedGroup._id);

        // If the group already exists, update it. Otherwise, add it to the start of the list.
        if (index !== -1) {
          state.groups[index] = updatedGroup;
        } else {
          state.groups.unshift(updatedGroup);
        }
      })
      .addCase(addOrUpdatePlan.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })

      // Deleting a group
      .addCase(deleteContributionGroup.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(deleteContributionGroup.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.groups = state.groups.filter((g) => g._id !== action.payload);
      })
      .addCase(deleteContributionGroup.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      });
  },
});

export const { selectGroupForEdit, resetActionStatus } =
  contributionPlansSlice.actions;
export default contributionPlansSlice.reducer;
