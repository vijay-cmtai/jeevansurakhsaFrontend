import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

export interface EmploymentConfigData {
  _id: string;
  employmentTypes: string[];
  departments: string[];
  companyNames: string[];
  contributionPlans: string[];
}

interface EmploymentConfigState {
  configData: EmploymentConfigData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  lastActionType: string | null;
}

const initialState: EmploymentConfigState = {
  configData: null,
  status: "idle",
  actionStatus: "idle",
  error: null,
  lastActionType: null,
};

export const fetchEmploymentConfig = createAsyncThunk(
  "employmentConfig/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/employment-config/");
      return data as EmploymentConfigData;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch config"
      );
    }
  }
);

export const addConfigItem = createAsyncThunk(
  "employmentConfig/addItem",
  async (
    { itemType, name }: { itemType: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/employment-config/${itemType}`,
        { name }
      );
      return { data, itemType };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateConfigItem = createAsyncThunk(
  "employmentConfig/updateItem",
  async (
    {
      itemType,
      oldName,
      newName,
    }: { itemType: string; oldName: string; newName: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/employment-config/${itemType}`,
        { oldName, newName }
      );
      return { data, itemType };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteConfigItem = createAsyncThunk(
  "employmentConfig/deleteItem",
  async (
    { itemType, name }: { itemType: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/employment-config/${itemType}`,
        { data: { name } }
      );
      return { data, itemType };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const employmentConfigSlice = createSlice({
  name: "employmentConfig",
  initialState,
  reducers: {
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handleActionPending = (state: EmploymentConfigState, action: any) => {
      state.actionStatus = "loading";
      state.lastActionType = action.meta.arg.itemType;
    };
    const handleActionRejected = (
      state: EmploymentConfigState,
      action: any
    ) => {
      state.actionStatus = "failed";
      state.error = action.payload;
      state.lastActionType = null;
    };
    const handleActionFulfilled = (
      state: EmploymentConfigState,
      action: PayloadAction<{ data: EmploymentConfigData; itemType: string }>
    ) => {
      state.actionStatus = "succeeded";
      state.configData = action.payload.data;
      state.lastActionType = null;
    };

    builder.addCase(fetchEmploymentConfig.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchEmploymentConfig.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.configData = action.payload;
    });
    builder.addCase(fetchEmploymentConfig.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    builder.addCase(addConfigItem.pending, handleActionPending);
    builder.addCase(addConfigItem.fulfilled, handleActionFulfilled);
    builder.addCase(addConfigItem.rejected, handleActionRejected);

    builder.addCase(updateConfigItem.pending, handleActionPending);
    builder.addCase(updateConfigItem.fulfilled, handleActionFulfilled);
    builder.addCase(updateConfigItem.rejected, handleActionRejected);

    builder.addCase(deleteConfigItem.pending, handleActionPending);
    builder.addCase(deleteConfigItem.fulfilled, handleActionFulfilled);
    builder.addCase(deleteConfigItem.rejected, handleActionRejected);
  },
});

export const { resetActionStatus } = employmentConfigSlice.actions;
export default employmentConfigSlice.reducer;
