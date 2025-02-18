import React from "react";
import { useSelector } from "react-redux";

function ChatHeader() {
  const { selectedUser } = useSelector((state) => state.chat);
  return (
    <div className="h-[8vh] w-full bg-gray-900 text-white p-3 flex items-center justify-between">
      <div className="h-full w-full flex gap-3">
        <div className="h-[6vh] w-[6vh] rounded-full overflow-hidden items-center">
          <img
            src={selectedUser.profilepic || "avatar.png"}
            alt=""
            className="object-cover object-center rounded-full"
          />
        </div>

        <div>
          <h1 className="text-xl text-white/80 font-semibold">
            {selectedUser.fullName}
          </h1>
          <p className="text-sm pt-1 tracking-wide">last seen at 12:45 p.m.</p>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
