import { Image, Send, X } from "lucide-react";
import React, {useState } from "react";
import { useDispatch } from "react-redux";
import { sendMessage } from "../app/chatSlice";

function MessageInput() {
  const [formData, setFormData] = useState({
    content: "",
    media: null,
  });

  
  const [mediaPreview, setMediaPreview] = useState(null);
  const dispatch = useDispatch();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, media: file });
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageData = new FormData();

    messageData.append("content", formData.content);
    messageData.append("media", formData.media);
    dispatch(sendMessage(messageData));
    setFormData({ content: "", media: "" });
    setMediaPreview(null);
  };
  return (
    <form
      className="h-[8vh] w-full flex items-center gap-2 relative"
      onSubmit={handleSubmit}
    >
      {mediaPreview && (
        <div className="h-20 w-full bg-black/40 p-3  absolute -top-18">
          <div className="w-16 h-16 relative">
            <div className=" w-full h-full overflow-hidden rounded-lg flex items-center gap-4">
              <img
                src={mediaPreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              className="bg-blue-800/80 absolute -right-1 p-1 rounded-full -top-1 hover:cursor-pointer text-white"
              onClick={(e) => setMediaPreview(null)}
            >
              <X size={10} />
            </button>
          </div>
        </div>
      )}
      <div className="relative w-[95%]">
        <input
          type="text"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="Type Something to send..."
          className={`w-full bg-black p-3 rounded-2xl outline-none text-white/90 relative -z-0`}
        />

        <div className="absolute top-3 right-3 hover:cursor-pointer z-10 text-white/50 bg-blue-900 w-5 h-fit">
          <label>
            <Image />
            <input
              type="file"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="text-white bg-blue-800 p-2 flex items-center rounded-2xl cursor-pointer"
        disabled={formData.content.length === ""}
      >
        <Send />
      </button>
    </form>
  );
}

export default MessageInput;
