import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { Camera, Pencil } from "lucide-react";
import { updateProfilePic, updateUserDetails } from "../app/authSlice";

function ProfilePage() {
  const [selectedImg, setSelectedImg] = useState(null);
  const { authUser, isUpdatingProfilePic } = useSelector((state) => state.auth);
  const [isEditable, setIsEditable] = useState(false);
  const [name, setName] = useState(authUser.fullName);
  const dispatch = useDispatch();

  const editImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (file) {
      setSelectedImg(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("profilepic", file);
      dispatch(updateProfilePic(formData));
    }
  };

  const updateName = (e) => {
    setIsEditable(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateUserDetails({ fullName: name }));
    setIsEditable(false);
  };
  //   console.log(authUser);
  return (
    <div className="h-full w-full">
      <Navbar />

      <div className="w-full h-[88%] flex justify-center items-center">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-5">
          <div className="flex flex-col items-center text-white">
            <h1 className="font-bold text-2xl">Profile</h1>
            <p className="text-white/50 italic">Your profile information</p>
          </div>
          <div className="bg-blue-800 text-white h-[15vh] rounded-full relative">
            <img
              src={selectedImg || authUser.profilepic || "/avatar.png"}
              alt=""
              className="w-full h-full rounded-full object-cover"
            />

            <label
              htmlFor="avatar"
              className={`absolute bottom-0 -right-3 bg-green-700 text-white p-4 rounded-full cursor-pointer transition-all duration-200 ${
                isUpdatingProfilePic ? "animate-pulse pointer-events-none" : ""
              }`}
            >
              <Camera />
              <input
                type="file"
                id="avatar"
                className="w-full h-full hidden"
                accept="image/*"
                onChange={editImage}
                disabled={isUpdatingProfilePic}
              />
            </label>
          </div>
          <p className="text-sm text-zinc-400">
            {isUpdatingProfilePic
              ? "Uploading..."
              : "Click the camera icon to update your photo"}
          </p>
          <div className="w-3/4 flex flex-col gap-3 items-center justify-center">
            <div className="text-white w-full flex flex-col gap-1">
              <label htmlFor="name" className="ml-2">
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-black py-1 px-4 rounded-2xl border border-white/20 ${
                    !isEditable && "opacity-35"
                  }`}
                  disable={!isEditable}
                />

                <div className="absolute top-1.5 right-2.5">
                  {!isEditable ? (
                    <Pencil
                      className="size-5 cursor-pointer"
                      onClick={updateName}
                    />
                  ) : (
                    <button
                      className="text-white px-2 bg-green-800 font-bold rounded-2xl cursor-pointer"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="text-white w-full flex flex-col gap-1">
              <label htmlFor="name" className="ml-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={authUser.email}
                  className={`w-full bg-black py-1 px-4 rounded-2xl border border-white/20 opacity-40`}
                  disabled
                />
              </div>
            </div>

            <div className="mt-6 bg-base-300 rounded-xl p-6 text-white w-full">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
