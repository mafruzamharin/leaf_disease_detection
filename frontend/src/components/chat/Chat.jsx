import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "./img.jpeg",
  });

  const endRef = useRef(null);

  // Mock Data for UI consistency
  const user = {
    username: "AgroAI Assistant",
    avatar: "./avatar.png",
  };

  const chat = {
    messages: [
      {
        senderId: "1",
        text: "Please upload a clear photo of the infected leaf.",
        createdAt: new Date(),
      },
      {
        senderId: "current_user_id", // Mocking the own message class
        text: "Sure, here is the image of my tomato plant.",
        createdAt: new Date(),
      },
      {
        senderId: "current_user_id", // Mocking the own message class
        text: "Sure, here is the image of my tomato plant.",
        createdAt: new Date(),
      },
      {
        senderId: "current_user_id", // Mocking the own message class
        text: "Sure, here is the image of my tomato plant.",
        createdAt: new Date(),
      },
      {
        senderId: "current_user_id", // Mocking the own message class
        text: "Sure, here is the image of my tomato plant.",
        createdAt: new Date(),
      },
      {
        senderId: "current_user_id", // Mocking the own message class
        text: "Sure, here is the image of my tomato plant.",
        createdAt: new Date(),
      },
    ],
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = () => {
    // UI logic only: clear inputs
    setText("");
    setImg({ file: null, url: "" });
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user.username}</span>
            <p>Ready to help with your crop diagnosis.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>

      <div className="center">
        {chat.messages.map((message, index) => (
          <div
            className={
              message.senderId === "current_user_id" ? "message own" : "message"
            }
            key={index}
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p>{message.text}</p>
              <span>1 min ago</span>
            </div>
          </div>
        ))}

        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="sendButton" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;