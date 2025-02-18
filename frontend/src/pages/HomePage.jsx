import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import { useSelector } from "react-redux";
import NoChatSelected from "../components/NoChatSelected";

function HomePage() {
  const {selectedUser}=useSelector(state=>state.chat)

  return (
    <div className="w-full h-full  rounded-2xl">
      <Navbar />
      <div className="w-full h-[92vh] lg:h-[72vh] mt-2 flex">
        <Sidebar />

        {selectedUser ? <ChatContainer />:<NoChatSelected/>}
      </div>
    </div>
  );
}

export default HomePage;
