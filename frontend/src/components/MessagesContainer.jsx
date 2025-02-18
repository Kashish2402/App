import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../app/chatSlice";

function MessagesContainer() {
  const { authUser } = useSelector((state) => state.auth);
  const { messages, selectedUser } = useSelector((state) => state.chat);

  const messageEndRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (selectedUser) dispatch(getMessages(selectedUser?._id));
  }, [dispatch, selectedUser?._id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  let lastDate = null;
  //   console.log(messages);

  return (
    <div className="w-full lg:h-[56vh] h-[76vh] flex flex-col gap-4 overflow-y-auto p-4">
      {messages.length > 0 &&
        messages.map((message, index) => {
          const messageDate = formatDate(message.createdAt);
          const showDateDivider = messageDate !== lastDate;
          lastDate = messageDate;
          return (
            <>
              {showDateDivider && (
                <div className="flex items-center justify-center my-2">
                  <span className="text-gray-400 text-xs bg-gray-900 px-4 py-1 rounded-xl">
                    {messageDate}
                  </span>
                </div>
              )}
              <div
                key={message?._id}
                className={`flex gap-3 items-center ${
                  message?.senderId === authUser._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.senderId !== authUser?._id && (
                  <div className="h-[6vh] w-[6vh] rounded-full overflow-hidden items-center">
                    <img
                      src={selectedUser.profilepic || "avatar.png"}
                      alt=""
                      className="object-cover object-center rounded-full"
                    />
                  </div>
                )}

                <div
                  className={`p-3 min-w-24 min-h-14  rounded-xl relative ${
                    message.senderId === authUser._id
                      ? "bg-black text-white"
                      : "bg-black/50 text-white/70"
                  }`}
                >
                  {" "}
                  <div>
                    {message.media && (
                      <div className="w-[20vw] h-[20vh] overflow-hidden mb-3 rounded">
                        <img
                          src={message.media}
                          className="h-full w-full object-center object-cover "
                          alt=""
                        />
                      </div>
                    )}
                    {message?.content}
                  </div>
                  <p className="absolute bottom-1 right-2 text-xs text-white/40">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                {message.senderId === authUser._id && (
                  <div className="h-[6vh] w-[6vh] rounded-full overflow-hidden">
                    <img
                      src={authUser?.profilepic || "avatar.png"}
                      alt="User Avatar"
                      className="object-cover object-center rounded-full"
                    />
                  </div>
                )}
              </div>
            </>
          );
        })}

      <div ref={messageEndRef}></div>
    </div>
  );
}

export default MessagesContainer;
