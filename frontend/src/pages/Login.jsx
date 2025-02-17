import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import Password from "../components/Password";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../app/authSlice";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="w-full h-full">
      <Navbar />

      <div className="w-full  h-[88%] mt-2 flex items-center justify-center divide-x divide-gray-500/10">
        <div className="h-full w-full md:w-1/2 lg:w-[35%]  px-8 flex flex-col items-center justify-center gap-8 ">
          <div className="bg-purple-500/10 rounded-xl p-3 cursor-pointer">
            <MessageSquare className="size-10 text-purple-900" />
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <h1 className="text-lg text-white font-normal italic">
              Welcome to <span className="text-purple-700">Chatty </span>verse
            </h1>
            <p className="text-white">Login to your Account</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full items-center justify-center gap-10"
          >
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="bg-black rounded-xl px-3 py-1 text-white w-3/4 border-b border-transparent focus:border-white transition-all shadow-lg shadow-black outline-none"
              placeholder="email"
            />
            <div className="w-full flex flex-col items-center justify-center relative mb-5">
              <Password
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              {/* <Link className="absolute top-11 right-15 active:font-semibold hover:font-semibold hover:underline  text-blue-700" to='/change-password'>Forgot Password?</Link> */}
            </div>
            {error && error !== "UNAUTHORISED REQUEST" && (
              <p className="text-red-500">{error.error || error}</p>
            )}
            <button
              type="submit"
              className="bg-purple-700 w-3/4 py-2 rounded-2xl text-white font-bold border-2 border-transparent cursor-pointer hover:bg-transparent hover:text-purple-700 hover:border-purple-700 transition-all ease-in-out"
            >
              Login
            </button>

            <p className="text-white text-[15px] inline">
              Don&apos;t have an account ? {"   "}
              <Link to="/signUp" className="text-purple-700 hover:underline ">
                Signup
              </Link>
            </p>
          </form>
        </div>
        <div className="h-full hidden md:flex flex-col gap-8 md:w-1/2 lg:w-[65%]  items-center justify-center">
          <div className="bg-purple-500/10 rounded-xl p-3 cursor-pointer">
            <MessageSquare className="size-10 text-purple-900 animate-bounce " />
          </div>

          <div className="flex flex-col items-center justify-center gap-3.5">
            <p className="text-xl text-white/80 font-semibold">
              Login to access your Chat Community
            </p>
            <p className="text-white/30">
              ChattyVerse – Conversations Without Limits!
            </p>
            <p className="italic text-gray-500 font-bold">
              "Connect with your loved one's"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
