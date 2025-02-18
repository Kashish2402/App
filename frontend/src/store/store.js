import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./../app/authSlice";
import chatReducer from "./../app/chatSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    chat:chatReducer
  },
});
