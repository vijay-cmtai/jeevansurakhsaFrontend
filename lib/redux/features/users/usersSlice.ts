// 📁 File: lib/redux/features/users/usersSlice.js

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

// Interface aur State mein koi badlav nahi
export interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: "Admin" | "Manager";
  status: "Active" | "Blocked";
  profilePicUrl?: string;
  createdAt?: string;
  blockedAt?: string;
  blockedBy?: { name: string; email: string };
}

interface UsersState {
  activeUsers: User[];
  blockedUsers: User[];
  selectedUser: User | null;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  listError: string | null;
  actionError: string | null;
}

const initialState: UsersState = {
  activeUsers: [],
  blockedUsers: [],
  selectedUser: null,
  listStatus: "idle",
  actionStatus: "idle",
  listError: null,
  actionError: null,
};

// =================================================================
// ✅✅ ASYNC THUNKS WITH CORRECTED API PATHS ✅✅
// =================================================================

export const fetchActiveUsers = createAsyncThunk(
  "users/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      // ✅ UPDATED PATH
      const { data } = await axiosInstance.get("/api/admin/managers/active");
      return data as User[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchBlockedUsers = createAsyncThunk(
  "users/fetchBlocked",
  async (_, { rejectWithValue }) => {
    try {
      // ✅ UPDATED PATH
      const { data } = await axiosInstance.get("/api/admin/managers/blocked");
      return data as User[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createUser = createAsyncThunk(
  "users/create",
  async (userFormData: FormData, { rejectWithValue }) => {
    try {
      // ✅ UPDATED PATH
      const { data } = await axiosInstance.post(
        "/api/admin/managers",
        userFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // ✅ Backend se aa rahe response se 'user' object nikalein
      return data.user as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async (
    { id, formData }: { id: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      // ✅ UPDATED PATH
      const { data } = await axiosInstance.put(
        `/api/admin/managers/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // ✅ Backend se aa rahe response se 'manager' object nikalein
      return data.manager as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const changeUserStatus = createAsyncThunk(
  "users/changeStatus",
  async (
    { id, status }: { id: string; status: "Active" | "Blocked" },
    { rejectWithValue }
  ) => {
    try {
      // ✅ UPDATED PATH
      await axiosInstance.put(`/api/admin/managers/${id}/status`, { status });
      return { id, status };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      // ✅ UPDATED PATH
      await axiosInstance.delete(`/api/admin/managers/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// --- Slice Definition (Ismein koi badlav nahi) ---
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    selectUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    clearActionError: (state) => {
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    // Builder logic mein koi badlav nahi, yeh bilkul sahi hai
    builder
      .addCase(fetchActiveUsers.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchActiveUsers.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.activeUsers = action.payload;
      })
      .addCase(fetchActiveUsers.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      })
      .addCase(fetchBlockedUsers.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchBlockedUsers.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.blockedUsers = action.payload;
      })
      .addCase(fetchBlockedUsers.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      })
      .addCase(createUser.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.activeUsers.unshift(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const updatedUser = action.payload;
        const activeIndex = state.activeUsers.findIndex(
          (u) => u._id === updatedUser._id
        );
        if (activeIndex !== -1) {
          state.activeUsers[activeIndex] = updatedUser;
        }
        const blockedIndex = state.blockedUsers.findIndex(
          (u) => u._id === updatedUser._id
        );
        if (blockedIndex !== -1) {
          state.blockedUsers[blockedIndex] = updatedUser;
        }
        state.selectedUser = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })
      .addCase(changeUserStatus.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(changeUserStatus.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const { id, status } = action.payload;
        if (status === "Blocked") {
          const userToBlock = state.activeUsers.find((u) => u._id === id);
          if (userToBlock) {
            state.blockedUsers.unshift({ ...userToBlock, status: "Blocked" });
            state.activeUsers = state.activeUsers.filter((u) => u._id !== id);
          }
        } else {
          const userToActivate = state.blockedUsers.find((u) => u._id === id);
          if (userToActivate) {
            state.activeUsers.unshift({ ...userToActivate, status: "Active" });
            state.blockedUsers = state.blockedUsers.filter((u) => u._id !== id);
          }
        }
      })
      .addCase(changeUserStatus.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const id = action.payload;
        state.activeUsers = state.activeUsers.filter((u) => u._id !== id);
        state.blockedUsers = state.blockedUsers.filter((u) => u._id !== id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      });
  },
});

export const { selectUser, clearActionError } = usersSlice.actions;
export default usersSlice.reducer;
