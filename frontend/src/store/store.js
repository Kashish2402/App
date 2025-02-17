import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./../app/authSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
  },
});
