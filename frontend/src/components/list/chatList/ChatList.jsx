import { useState, useEffect } from "react";
import "./chatlist.css";

const ChatList = ({ onSelectChat, activeChatId, socket }) => {
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // Request chats when component mounts
    socket.emit("get_chats");

    // Listen for incoming chat updates
    socket.on("update_chats", (data) => {
      setChats(data);
    });

    return () => {
      socket.off("update_chats");
    };
  }, [socket]);

  // Filter based on search input
  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

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

      {filteredChats.map((chat) => (
        <div
          className={`item ${chat.chatId === activeChatId ? "active" : ""}`}
          key={chat.chatId}
          onClick={() => onSelectChat(chat)}
          style={{
            // UPDATED LOGIC: Active chat gets #5183fe, others get transparent
            backgroundColor: chat.chatId === activeChatId ? "#5183fe" : "transparent",
            cursor: "pointer"
          }}
        >
          <img src={chat.user.avatar || "./avatar.png"} alt="avatar" />
          <div className="texts">
            <span>{chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}

      {addMode && <div className="addUserPlaceholder">Add User UI</div>}
    </div>
  );
};

export default ChatList;