import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Password from "../components/Password";
import { MessageSquare } from "lucide-react";
import {useDispatch} from "react-redux"

function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

const dispatch=useDispatch()

  const handleSubmit = (e) => {
    e.prevenDefault();
    dispatch(updateProfilePic(formData))
  };
  return (
    <div className="w-full h-full">
      <Navbar />

      <div className="w-full h-[92vh] md:h-[72vh] flex items-center justify-center">
        <div className=" w-full md:w-[40%] flex flex-col items-center justify-center gap-9">
          <div className="bg-purple-500/10 rounded-xl p-3 cursor-pointer">
            <MessageSquare className="size-10 text-purple-900" />
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <h1 className="text-lg text-white font-normal italic">
              <span className="text-purple-700">Chatty </span>verse
            </h1>
            <p className="text-white">Reset your Password</p>
          </div>
          <form className="w-full flex flex-col items-center justify-center gap-10">
            <div className="w-full flex flex-col items-center justify-center gap-7">
              <Password
                placeholder="old password"
                value={formData.oldPassword}
                onChange={(e) =>
                  setFormData({ ...formData, oldPassword: e.target.value })
                }
              />
              <Password
                placeholder="new password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
              />
              <Password
                placeholder="confirm new password"
                value={formData.confirmNewPassword}
                onChange={e=>setFormData({
                  ...formData,
                  confirmNewPassword: e.target.value,
                })}
              />
            </div>

            <button
              className="bg-purple-700 w-3/4 py-2 rounded-2xl text-white font-bold border-2 border-transparent cursor-pointer hover:bg-transparent hover:text-purple-700 hover:border-purple-700 transition-all ease-in-out"
              onClick={handleSubmit}
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
