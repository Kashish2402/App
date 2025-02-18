import React from "react";
import { useSelector } from "react-redux";
import ChatHeader from "./ChatHeader";
import MessagesContainer from "./MessagesContainer";
import MessageInput from "./MessageInput";

function ChatContainer() {
  const { selectedUser } = useSelector((state) => state.chat);
  return (
    <>
      {
        <div className="h-full w-full lg:w-[70%] px-2">
          <ChatHeader />
          <MessagesContainer />
          <MessageInput />
        </div>
      }
    </>
  );
}

export default ChatContainer;
