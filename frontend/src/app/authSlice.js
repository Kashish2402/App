import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  autoConnect: false,
  transports: ["websocket"],
});

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/getCurrentUser");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to Fetch User"
      );
    }
  }
);
export const signUp = createAsyncThunk(
  "auth/signUp",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/signup", formData);
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      console.log("Error in SignUp: ", error.response.data.message);
      return rejectWithValue(error.response?.data?.message || "SignUp Failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/login", formData);
      toast.success(response.data.message);
      return response.data.data.user;
    } catch (error) {
      console.log("Error in SignUp: ", error.response);
      return rejectWithValue(error.response?.data?.message || "Login Failed");
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  "auth/updateUserDetails",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch("/users/update-details", data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "Unable to update user Details"
      );
    }
  }
);

export const updateProfilePic = createAsyncThunk(
  "auth/updateProfilePic",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data);
      const response = await axiosInstance.patch(
        "/users/update-profilepic",
        data
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "Unable to update user Details"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.update("/users/change-password");
      toast.success(response.data.message);
      socket.connect();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "Unable to update user Details"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/logout");
      toast.success(response.data.message);
      socket.disconnect();
      return response.data.data.message;
    } catch (error) {
      console.log("Error in Logout: ", error.response);
      toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || "Logout Failed");
    }
  }
);
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isAuthenticated: false,
    isSigningUp: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isUpdatingPassword: false,
    isUpdatingProfilePic: false,
    isUpdatingUserDetails: false,
    onlineUsers: [],
    error: null,
    isFetchingUser: false,
    onlineUsers: [],
    socketConnected: false,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isFetchingUser = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isAuthenticated = true;
        state.isFetchingUser = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.payload;
        state.authUser = null;
        state.isAuthenticated = false;
        state.isFetchingUser = false;
      })
      .addCase(signUp.pending, (state) => {
        state.isSigningUp = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isAuthenticated = true;
        state.isSigningUp = false;
        state.socketConnected = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.error = action.payload;
        state.isSigningUp = false;
      })
      .addCase(login.pending, (state) => {
        state.error = null;
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authUser = action.payload;
        console.log(state.authUser);
        socket.connect();
        state.isAuthenticated = true;
        state.isLoggingIn = false;
        state.socketConnected = true;
      })
      .addCase(login.rejected, (state) => {
        state.error = action.payload;
        state.isLoggingIn = false;
      })
      .addCase(logout.pending, (state) => {
        state.isLoggingOut = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.authUser = null;
        state.isLoggingOut = false;
        state.isAuthenticated = false;
        state.socketConnected = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoggingOut = false;
      })
      .addCase(updateUserDetails.pending, (state) => {
        state.isUpdatingUserDetails = true;
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.isUpdatingUserDetails = false;
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.isUpdatingUserDetails = false;
        state.error = action.payload;
      })
      .addCase(updateProfilePic.pending, (state) => {
        state.isUpdatingProfilePic = true;
        state.error = null;
      })
      .addCase(updateProfilePic.fulfilled, (state, action) => {
        state.isUpdatingProfilePic = false;
      })
      .addCase(updateProfilePic.rejected, (state, action) => {
        state.isUpdatingProfilePic = false;
        state.error = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.error = null;
        state.isUpdatingPassword = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isUpdatingPassword = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.payload;
        state.isUpdatingPassword = false;
      });
  },
});

export default authSlice.reducer;
