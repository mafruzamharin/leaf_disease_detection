import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";

const Chat = ({ activeChat, socket }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const [isTyping, setIsTyping] = useState(false);

  const endRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, img.url, isTyping]);

  // Handle Socket events when the active room changes
  useEffect(() => {
    if (!activeChat) return;

    // Join the newly selected room
    socket.emit("join_chat", { chatId: activeChat.chatId });

    // Listen for room history
    socket.on("chat_history", (history) => {
      setMessages(history);
    });

    // Listen for new messages arriving in this room
    socket.on("receive_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("typing", (data) => {
      setIsTyping(data.isTyping);
    });

    // Cleanup listeners when switching rooms
    return () => {
      socket.off("chat_history");
      socket.off("receive_message");
      socket.off("typing");
    };
  }, [activeChat, socket]);

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
    if (!text && !img.file) return;

    const sendMessageData = (base64Img = null) => {
      socket.emit("send_message", {
        chatId: activeChat.chatId,
        senderId: "current_user_id",
        text: text,
        img: base64Img,
      });

      // Clear UI inputs
      setText("");
      setImg({ file: null, url: "" });
    };

    if (img.file) {
      // Convert image file to Base64 to send via socket
      const reader = new FileReader();
      reader.readAsDataURL(img.file);
      reader.onloadend = () => {
        sendMessageData(reader.result);
      };
    } else {
      sendMessageData();
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={activeChat.user.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{activeChat.user.username}</span>
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
        {messages.map((message, index) => (
          <div
            className={
              message.senderId === "current_user_id" ? "message own" : "message"
            }
            key={index}
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="attachment" style={{maxWidth: "100%", borderRadius: "10px"}} />}
              {message.text && <p>{message.text}</p>}
              <span>{new Date(message.createdAt).toLocaleTimeString('en-US', {hour: 'numeric', minute:'2-digit', hour12: true}) || "Just now"}</span>
            </div>
          </div>
        ))}

        {/* Local Preview of image before hitting Send */}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="preview" style={{maxWidth: "100%", opacity: 0.7, borderRadius: "10px"}} />
            </div>
          </div>
        )}


        {isTyping && (
          <div className="message">
            <div className="texts">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        
        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" style={{cursor: "pointer"}} />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
            accept="image/*"
          />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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