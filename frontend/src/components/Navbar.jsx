import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Settings, User, LogOut } from "lucide-react";
import { logout } from "../app/authSlice";

function Navbar() {
  const { authUser, isAuthenticated } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const dispatch=useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // console.log('Signup clicked')
    navigate("/signUp");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div
      className={`w-full h-[7vh] border-b rounded-b-2xl border-b-gray-800 shadow-2xl p-2 py-4 flex md:px-10 justify-between items-center`}
    >
      <div className="cursor-pointer" onClick={() => navigate("/")}>
        <span className="font-black text-xl italic text-purple-600 opacity-65">
          chatty
        </span>
        <span className="text-white text-xl opacity-65 tracking-tight font-medium -ml-0.5">
          verse
        </span>
        <p className="text-[10px] ml-1 italic text-gray-700 leading-0.5 tracking-tighter">
          Connect with loved one's
        </p>
      </div>

      <div className="flex items-center gap-3 text-white">
        <Link
          to={"/settings"}
          className={`
              bg-black/40 hover:bg-black transition-colors duration-200 px-2 py-1.5 flex items-center justify-center gap-1.5 rounded-md
              `}
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Settings</span>
        </Link>

        {authUser ? (
          <>
            <Link
              to={"/profile"}
              className={`bg-black/40 hover:bg-black transition-colors duration-200 px-2 py-1.5 flex items-center justify-center gap-1.5 rounded-md`}
            >
              <User className="size-5" />
              <span className="hidden sm:inline">Profile</span>
            </Link>

            <button className="flex gap-2 items-center cursor-pointer" onClick={handleLogout}>
              <LogOut className="size-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-purple-200/70 px-3 py-1 rounded-md cursor-pointer border border-transparent hover:bg-transparent hover:border-purple-200/70 transition-all"
              onClick={handleSignup}
            >
              Register
            </button>

            <button
              className="text-purple-600 font-bold py-1 px-3 border border-transparent rounded-md hover:border-purple-600 transition-all cursor-pointer"
              onClick={handleLogin}
            >
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
