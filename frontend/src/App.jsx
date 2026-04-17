import React from 'react'
import './App.css';
import List from './components/list/List';
import Chat from './components/chat/Chat';


function App() {
  return (
    <div className="container">
      <List/>
      <Chat/>
    </div>
  )
}

export default App