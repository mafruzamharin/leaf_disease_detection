import React, { useState } from 'react';
import './App.css';
import List from './components/list/List';
import Chat from './components/chat/Chat';
import { io } from "socket.io-client";

// Initialize socket outside the component to prevent reconnections on re-renders
export const socket = io("http://localhost:5000");

function App() {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="container">
      <List 
        onSelectChat={setActiveChat} 
        activeChatId={activeChat?.chatId} 
        socket={socket} 
      />
      {activeChat ? (
        <Chat activeChat={activeChat} socket={socket} />
      ) : (
        <div style={{ flex: 2, display: "flex", alignItems: "center", justifyItems: "center", color: "white", fontSize: "20px" }}>
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
}

export default App;