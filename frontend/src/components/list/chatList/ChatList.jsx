import { useState } from "react";
import "./chatlist.css";

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  // Mock data to preserve the UI look
  const mockChats = [
    {
      chatId: "1",
      lastMessage: "Hello! How can I help with your crops?",
      isSeen: false,
      user: {
        username: "AgroAI Assistant",
        avatar: "./avatar.png",
      },
    },
    {
      chatId: "2",
      lastMessage: "The leaf looks like it has Late Blight.",
      isSeen: true,
      user: {
        username: "Plant Doctor",
        avatar: "./avatar.png",
      },
    },
  ];

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="search" />
          <input
            type="text"
            placeholder="Search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt="toggle add mode"
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>

      {mockChats.map((chat) => (
        <div
          className="item"
          key={chat.chatId}
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
          }}
        >
          <img src={chat.user.avatar || "./avatar.png"} alt="avatar" />
          <div className="texts">
            <span>{chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}

      {/* AddUser component placeholder */}
      {addMode && <div className="addUserPlaceholder">Add User UI</div>}
    </div>
  );
};

export default ChatList;