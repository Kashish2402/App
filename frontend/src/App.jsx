import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import ChangePassword from "./pages/ChangePassword";
import { getUser } from "./app/authSlice";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [count, setCount] = useState(0);

  const { authUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return (
    <div className="w-full h-screen bg-[#121212] flex items-center justify-center">
      <div className="h-full w-full lg:h-[80vh] lg:w-[80vw] border border-gray-500 rounded-2xl shadow-lg shadow-gray-900  ">
        <Toaster/>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={authUser ? <HomePage /> : <Login />}
            ></Route>
            <Route
              path="/login"
              element={!authUser ? <Login /> : <HomePage />}
            ></Route>
            <Route
              path="/signUp"
              element={!authUser ? <Signup /> : <HomePage />}
            ></Route>
            <Route
            path="/profile"
            element={authUser?<ProfilePage/>:""}
            ></Route>
            <Route path="/change-password" element={<ChangePassword />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
