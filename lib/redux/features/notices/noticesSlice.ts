import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

// --- TypeScript Type Definitions ---

// For the Admin view (includes populated recipient/sender data)
export interface Notice {
  _id: string;
  title: string;
  subject: string;
  content: string;
  recipientType: "Single" | "All";
  recipients: { _id: string; fullName: string; registrationNo?: string }[];
  sentBy: { _id: string; name: string };
  createdAt: string;
}

// For the Member's dashboard view (simpler)
export interface MyNotice {
  _id: string;
  title: string;
  subject: string;
  content: string;
  recipientType: "Single" | "All";
  createdAt: string;
}

interface PaginationState {
  page: number;
  pages: number;
  total: number;
  limit: number;
}

// The complete state for this slice, handling both admin and user data
interface NoticesState {
  notices: Notice[]; // For admin list
  myNotices: MyNotice[]; // For logged-in user dashboard
  pagination: PaginationState;
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

const initialState: NoticesState = {
  notices: [],
  myNotices: [],
  pagination: initialPagination,
  listStatus: "idle",
  actionStatus: "idle",
  listError: null,
  actionError: null,
};

// --- Async Thunks for API Calls ---

// --- ADMIN-FACING THUNKS ---

interface FetchParams {
  page?: number;
  limit?: number;
}

export const fetchPreviousNotices = createAsyncThunk(
  "notices/fetchPrevious",
  async (params: FetchParams = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/admin/notices/previous", {
        params,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notices"
      );
    }
  }
);

interface NoticeBody {
  title: string;
  subject: string;
  content: string;
}

export const sendSingleNotice = createAsyncThunk(
  "notices/sendSingle",
  async (
    { memberId, ...noticeBody }: NoticeBody & { memberId: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/admin/notices/send/single/${memberId}`,
        noticeBody
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send notice"
      );
    }
  }
);

export const sendNoticeToAll = createAsyncThunk(
  "notices/sendToAll",
  async (noticeBody: NoticeBody, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/admin/notices/send/all",
        noticeBody
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send notice"
      );
    }
  }
);

export const deleteNotice = createAsyncThunk(
  "notices/delete",
  async (noticeId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/admin/notices/${noticeId}`);
      return noticeId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete notice"
      );
    }
  }
);

// --- USER-FACING THUNK ---

export const fetchMyNotices = createAsyncThunk(
  "notices/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/api/notices");
      return data as MyNotice[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your notices"
      );
    }
  }
);

const noticesSlice = createSlice({
  name: "notices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Admin: Fetch previous notices
      .addCase(fetchPreviousNotices.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchPreviousNotices.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.notices = action.payload.notices;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
          limit: state.pagination.limit,
        };
      })
      .addCase(fetchPreviousNotices.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      })

      // Admin: Send notices
      .addCase(sendSingleNotice.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(sendSingleNotice.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(sendSingleNotice.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })
      .addCase(sendNoticeToAll.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(sendNoticeToAll.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(sendNoticeToAll.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })

      // Admin: Delete notice
      .addCase(deleteNotice.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(
        deleteNotice.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionStatus = "succeeded";
          state.notices = state.notices.filter((n) => n._id !== action.payload);
        }
      )
      .addCase(deleteNotice.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })

      // User: Fetch their own notices
      .addCase(fetchMyNotices.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(
        fetchMyNotices.fulfilled,
        (state, action: PayloadAction<MyNotice[]>) => {
          state.listStatus = "succeeded";
          state.myNotices = action.payload;
        }
      )
      .addCase(fetchMyNotices.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      });
  },
});

export default noticesSlice.reducer;
