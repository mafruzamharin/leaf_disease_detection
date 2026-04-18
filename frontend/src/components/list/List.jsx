import React from 'react'
import './list.css';
import UserInfo from './userInfo/UserInfo';
import ChatList from './chatList/ChatList';

export default function List({ onSelectChat, activeChatId, socket }) {
  return (
    <div className='list'>
      <UserInfo/>
      <ChatList 
        onSelectChat={onSelectChat} 
        activeChatId={activeChatId} 
        socket={socket} 
      />
    </div>
  )
}