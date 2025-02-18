import { UserIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserList, setSelectedUser } from "../app/chatSlice";

function Sidebar() {
  const { authUser } = useSelector((state) => state.auth);
  const { users,selectedUser } = useSelector((state) => state.chat);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserList());
  }, [dispatch]);

  const handleClick = (user) => {
    dispatch(setSelectedUser(user));
  };
  return (
    <div className="h-full w-full lg:w-[30%] bg-black border-r border-gray-500 rounded-b-2xl flex flex-col ">
      <div className="h-[10vh] bg-purple-700/20 p-3">
        <p className="text-white/80 text-xl font-medium border-b pb-2 border-gray-500/50">
          Welcome ,{" "}
          <span className="italic text-white">{authUser.fullName}</span>
        </p>
        <p className="pt-2.5 pb-3 flex gap-1 items-center">
          <span className="text-white">
            <UserIcon className="size-6 " />
          </span>
          <span className="text-white text-lg font-semibold">Contacts</span>
        </p>
      </div>

      <div className="flex flex-col divide-y divide-gray-500/30 p-3 overflow-y-scroll">
        {users.length > 0 &&
          users.map((user) => (
            <button
              key={user._id}
              className={`flex p-3 gap-3 items-center relative cursor-pointer ${
                selectedUser?._id===user?._id && " bg-gray-900"
              }`}
              onClick={()=>handleClick(user)}
            >
              <div className="h-[6vh] w-[6vh] relative">
                <div className="h-full w-full rounded-full overflow-hidden ">
                  <img
                    src={user.profilepic || "avatar.png"}
                    alt=""
                    className=" object-cover object-center rounded-full "
                  />
                </div>
                <div
                  className={`absolute bottom-0 right-0 bg-green-700 border-2 border-white/80 p-2 rounded-xl`}
                ></div>
              </div>
              <div>
                <h1 className="text-white text-xl">{user.fullName}</h1>
                <p className="text-white/60 w-fit">offline</p>
              </div>

              <div className="text-white/40 absolute top-2 right-4 text-sm">
                time
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}

export default Sidebar;
