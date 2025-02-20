import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteMessage, getMessages } from "../app/chatSlice";

function MessagesContainer() {
  const { authUser } = useSelector((state) => state.auth);
  const { messages, selectedUser, isMessagesLoading } = useSelector(
    (state) => state.chat
  );
  const [selectedMessage, setSelectedMessage] = useState("");

  const selectedUserRef = useRef(selectedUser);

  const messageEndRef = useRef(null);
  const dispatch = useDispatch();

  const handleLongPress = (messageId) => {
    setSelectedMessage(messageId);
  };

  const deleteSelectedMessage = (messageId) => {
    dispatch(deleteMessage(messageId))
    setSelectedMessage(null)
  };

  useEffect(() => {
    if (selectedUser) {
      dispatch(getMessages(selectedUser?._id));
    }
  }, [dispatch, selectedUser?._id]);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
    if (selectedUser) {
      dispatch(getMessages(selectedUser._id));
    }
  }, [dispatch, selectedUser]);

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
    <div className="w-full lg:h-[56vh] h-[76vh] relative">
      <div className="w-full h-full  flex flex-col gap-4 overflow-y-auto p-4 ">
        {messages.length > 0 &&
          messages.map((message, index) => {
            const messageDate = formatDate(message.createdAt);
            const showDateDivider = messageDate !== lastDate;
            lastDate = messageDate;
            return (
              <div
                key={message._id}
                onTouchStart={() => handleLongPress(message?._id)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setTimeout(() => handleLongPress(message?._id), 500);
                }}
              >
                {showDateDivider && (
                  <div className={`flex items-center justify-center my-2`}>
                    <span className="text-gray-400 text-xs bg-gray-900 px-4 py-1 rounded-xl">
                      {messageDate}
                    </span>
                  </div>
                )}
                <div
                  className={`flex gap-3 items-center ${
                    message?.senderId === authUser._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.senderId !== authUser?._id && (
                    <div className={`h-[6vh] w-[6vh] rounded-full overflow-hidden items-center `}>
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
              </div>
            );
          })}

        { selectedMessage && <div
          className={`absolute top-0 text-white bg-gray-500 w-[95%] p-3 flex flex-col gap-3`}
        >
          <h1>Are you sure You want to delete the selected Message</h1>

          <div className="flex items-center gap-4">
            <button
              className="bg-red-600 p-2 rounded-xl cursor-pointer"
              onClick={()=>deleteSelectedMessage(selectedMessage)}
            >
              Delete
            </button>

            <button
              className="bg-gray-800 p-2 rounded-xl cursor-pointer"
              onClick={() => setSelectedMessage(null)}
            >
              Cancel
            </button>
          </div>
        </div>}

        <div ref={messageEndRef}></div>
      </div>
    </div>
  );
}

export default MessagesContainer;
