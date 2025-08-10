import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
// ✅ This import will now work correctly without circular dependency issues
import { setCredentials } from "@/lib/redux/features/auth/authSlice";

// --- Type Definitions ---
export interface Nominee {
  name: string;
  relation: string;
  age: number | string;
  gender: string;
  percentage: number | string;
}

export interface StateConfig {
  _id: string;
  name: string;
  districts: DistrictConfig[];
}

export interface DistrictConfig {
  _id: string;
  name: string;
}

export interface VolunteerConfig {
  _id: string;
  name: string;
  code: string;
}

export interface FormData {
  state: string;
  district: string;
  volunteerCode?: string;
  dateOfBirth: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  panNumber?: string;
  address: {
    houseNumber: string;
    street: string;
    cityVillage: string;
    pincode: string;
  };
  employment: {
    type: string;
    department: string;
    companyName: string;
    contributionPlan: string;
  };
  nominees: Nominee[];
}

export interface ContributionGroup {
  _id: string;
  employmentType: string;
  companies: {
    _id: string;
    companyName: string;
    departments: {
      _id: string;
      departmentName: string;
      plans: {
        _id: string;
        planDetails: string;
      }[];
    }[];
  }[];
}

interface RegistrationState {
  step: number;
  formData: FormData;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  configStatus: "idle" | "loading" | "succeeded" | "failed";
  states: StateConfig[];
  volunteers: VolunteerConfig[];
  contributionGroups: ContributionGroup[];
  contributionGroupsStatus: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: RegistrationState = {
  step: 1,
  formData: {
    state: "",
    district: "",
    volunteerCode: "",
    dateOfBirth: "",
    fullName: "",
    phone: "",
    email: "",
    password: "",
    panNumber: "",
    address: { houseNumber: "", street: "", cityVillage: "", pincode: "" },
    employment: {
      type: "",
      department: "",
      companyName: "",
      contributionPlan: "",
    },
    nominees: [
      { name: "", relation: "", age: "", gender: "", percentage: 100 },
    ],
  },
  status: "idle",
  error: null,
  configStatus: "idle",
  states: [],
  volunteers: [],
  contributionGroups: [],
  contributionGroupsStatus: "idle",
};

// --- Async Thunks ---
export const fetchRegistrationConfig = createAsyncThunk(
  "registration/fetchConfig",
  async (_, { rejectWithValue }) => {
    try {
      const [statesRes, volunteersRes] = await Promise.all([
        axiosInstance.get("/api/members/config/states"),
        axiosInstance.get("/api/members/config/volunteers"),
      ]);
      return { states: statesRes.data, volunteers: volunteersRes.data };
    } catch (error: any) {
      return rejectWithValue("Failed to load registration data.");
    }
  }
);

export const fetchContributionGroupsForRegistration = createAsyncThunk(
  "registration/fetchContributionGroups",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/contribution-plans/");
      return data as ContributionGroup[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch contribution groups"
      );
    }
  }
);

export const submitRegistration = createAsyncThunk(
  "registration/submit",
  async (
    {
      formData,
      files,
      isPayingNow,
    }: {
      formData: FormData;
      files: { profileImage?: File | null; panImage?: File | null };
      isPayingNow: boolean;
    },
    { dispatch, rejectWithValue }
  ) => {
    const dataToSubmit = new FormData();
    dataToSubmit.append("formData", JSON.stringify(formData));
    dataToSubmit.append("isPayingNow", JSON.stringify(isPayingNow));
    if (files.profileImage)
      dataToSubmit.append("profileImage", files.profileImage);
    if (files.panImage) dataToSubmit.append("panImage", files.panImage);

    try {
      const { data } = await axiosInstance.post(
        "/api/members/register",
        dataToSubmit
      );
      // After successful registration, if a token is received,
      // dispatch the setCredentials action to log the user in.
      if (data.token) {
        dispatch(setCredentials(data));
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

// --- The Slice Definition ---
const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    updateField: (
      state,
      action: PayloadAction<{ field: keyof FormData; value: any }>
    ) => {
      (state.formData as any)[action.payload.field] = action.payload.value;
    },
    updateNestedField: (
      state,
      action: PayloadAction<{
        parent: "address" | "employment";
        field: string;
        value: string;
      }>
    ) => {
      (state.formData[action.payload.parent] as any)[action.payload.field] =
        action.payload.value;
    },
    updateNominee: (
      state,
      action: PayloadAction<{ index: number; field: keyof Nominee; value: any }>
    ) => {
      state.formData.nominees[action.payload.index][action.payload.field] =
        action.payload.value;
    },
    addNominee: (state) => {
      state.formData.nominees.push({
        name: "",
        relation: "",
        age: "",
        gender: "",
        percentage: "",
      });
    },
    removeNominee: (state, action: PayloadAction<number>) => {
      state.formData.nominees.splice(action.payload, 1);
    },
    resetForm: () => initialState,
    setEmploymentType: (state, action: PayloadAction<string>) => {
      state.formData.employment.type = action.payload;
      state.formData.employment.companyName = "";
      state.formData.employment.department = "";
      state.formData.employment.contributionPlan = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegistrationConfig.pending, (state) => {
        state.configStatus = "loading";
      })
      .addCase(fetchRegistrationConfig.fulfilled, (state, action) => {
        state.configStatus = "succeeded";
        state.states = action.payload.states;
        state.volunteers = action.payload.volunteers;
      })
      .addCase(fetchRegistrationConfig.rejected, (state, action) => {
        state.configStatus = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(submitRegistration.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitRegistration.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(submitRegistration.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchContributionGroupsForRegistration.pending, (state) => {
        state.contributionGroupsStatus = "loading";
      })
      .addCase(
        fetchContributionGroupsForRegistration.fulfilled,
        (state, action) => {
          state.contributionGroupsStatus = "succeeded";
          state.contributionGroups = action.payload;
        }
      )
      .addCase(fetchContributionGroupsForRegistration.rejected, (state) => {
        state.contributionGroupsStatus = "failed";
      });
  },
});

export const {
  setStep,
  updateField,
  updateNestedField,
  updateNominee,
  addNominee,
  removeNominee,
  resetForm,
  setEmploymentType,
} = registrationSlice.actions;

export default registrationSlice.reducer;
