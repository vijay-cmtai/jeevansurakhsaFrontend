// File: lib/redux/features/config/configSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

// --- HIGHLIGHT: Volunteer interface update ho gayi hai ---
export interface Volunteer {
  _id: string;
  name: string;
  code: string;
  phone: string;
  state: string;
  district: string;
}

export interface District {
  _id: string;
  name: string;
}
export interface State {
  _id: string;
  name: string;
  districts: District[];
}

interface ConfigState {
  states: State[];
  volunteers: Volunteer[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ConfigState = {
  states: [],
  volunteers: [],
  status: "idle",
  error: null,
};

// Async Thunks
export const fetchConfigData = createAsyncThunk(
  "config/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const [statesRes, volunteersRes] = await Promise.all([
        axiosInstance.get("/api/members/config/states"),
        axiosInstance.get("/api/members/config/volunteers"),
      ]);
      return { states: statesRes.data, volunteers: volunteersRes.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch configuration"
      );
    }
  }
);

export const addStateWithDistricts = createAsyncThunk(
  "config/addState",
  async (
    { name, districts }: { name: string; districts: string[] },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post("/api/members/config/states", {
        name,
        districts,
      });
      return data as State[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add state"
      );
    }
  }
);

// --- HIGHLIGHT: addVolunteer async thunk ab poora data bhejega ---
export const addVolunteer = createAsyncThunk(
  "config/addVolunteer",
  async (
    volunteerData: {
      name: string;
      code: string;
      phone: string;
      state: string;
      district: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/members/config/volunteers",
        volunteerData // Poora object bhej rahe hain
      );
      return data as Volunteer[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add volunteer"
      );
    }
  }
);

// Delete Thunks
export const deleteState = createAsyncThunk(
  "config/deleteState",
  async (stateId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/members/config/states/${stateId}`);
      return stateId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete state"
      );
    }
  }
);

export const deleteDistrict = createAsyncThunk(
  "config/deleteDistrict",
  async (
    { stateId, districtId }: { stateId: string; districtId: string },
    { rejectWithValue }
  ) => {
    try {
      await axiosInstance.delete(
        `/api/members/config/states/${stateId}/districts/${districtId}`
      );
      return { stateId, districtId };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete district"
      );
    }
  }
);

export const deleteVolunteer = createAsyncThunk(
  "config/deleteVolunteer",
  async (volunteerId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `/api/members/config/volunteers/${volunteerId}`
      );
      return volunteerId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete volunteer"
      );
    }
  }
);

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    clearConfigError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchConfigData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.states = action.payload.states;
        state.volunteers = action.payload.volunteers;
      })
      .addCase(fetchConfigData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(
        addStateWithDistricts.fulfilled,
        (state, action: PayloadAction<State[]>) => {
          state.status = "succeeded";
          state.states = action.payload;
        }
      )
      .addCase(
        addVolunteer.fulfilled,
        (state, action: PayloadAction<Volunteer[]>) => {
          state.status = "succeeded";
          state.volunteers = action.payload;
        }
      )
      .addCase(
        deleteState.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.states = state.states.filter((s) => s._id !== action.payload);
        }
      )
      .addCase(
        deleteDistrict.fulfilled,
        (
          state,
          action: PayloadAction<{ stateId: string; districtId: string }>
        ) => {
          state.status = "succeeded";
          const { stateId, districtId } = action.payload;
          const stateIndex = state.states.findIndex((s) => s._id === stateId);
          if (stateIndex !== -1) {
            state.states[stateIndex].districts = state.states[
              stateIndex
            ].districts.filter((d) => d._id !== districtId);
          }
        }
      )
      .addCase(
        deleteVolunteer.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.volunteers = state.volunteers.filter(
            (v) => v._id !== action.payload
          );
        }
      )
      .addMatcher(
        (action) =>
          (action.type.startsWith("config/add") ||
            action.type.startsWith("config/delete")) &&
          action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          (action.type.startsWith("config/add") ||
            action.type.startsWith("config/delete")) &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload as string;
        }
      );
  },
});

export const { clearConfigError } = configSlice.actions;
export default configSlice.reducer;
