import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const getUserList = createAsyncThunk(
  "/chat/getUserList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/messages/users");
      toast.success(response.data.message);

      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch user...!!"
      );
    }
  }
);

export const getMessages = createAsyncThunk(
  "/chat/getMessages",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { selectedUser } = getState().chat;
      const response = await axiosInstance.get(
        `/messages/${selectedUser?._id}`
      );

      return response.data.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch Messages...!!"
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "/chat/sendMessage",
  async (messageData, { getState, rejectWithValue }) => {
    try {
      const { selectedUser } = getState().chat;

      const response = await axiosInstance.post(
        `/messages/send/${selectedUser?._id}`,
        messageData
      );

      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message);

      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch user...!!"
      );
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "/chat/deleteMessage",
  async (messageId, { getState, rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/messages/message/${messageId}`
      );
      if (response) {
        const { messages } = getState().chat;
        const remainingMessages = messages.filter(
          (msg) => msg?._id !== messageId
        );
        toast.success(response.data.message);
        return remainingMessages;
      }
    } catch (error) {
      toast.error(error.response?.data?.message);

      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch user...!!"
      );
    }
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    users: [],
    isMessageSending: false,
    isMessagesLoading: false,
    selectedUser: null,
    isUserLoading: false,
    error: null,
  },

  reducers: {
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getUserList.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isUserLoading = false;
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = action.payload;
      })
      .addCase(getMessages.pending, (state) => {
        state.isMessagesLoading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.isMessagesLoading = false;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.error = action.payload;
        state.isMessagesLoading = false;
      })
      .addCase(sendMessage.pending, (state) => {
        state.error = null;
        state.isMessageSending = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
        state.isMessageSending = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
        state.isMessageSending = false;
      })
      .addCase(deleteMessage.pending, (state, action) => {
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages=action.payload
      }).addCase(deleteMessage.rejected,(state,action)=>{
        state.error=action.payload
      });
  },
});

export const { setSelectedUser } = chatSlice.actions;

export default chatSlice.reducer;
