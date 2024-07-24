import React, { useState } from 'react'
import Topbar from '../../components/topbar/Topbar'
import ChatBox from '../../components/chatBox/ChatBox'
import { useSelector } from 'react-redux'
import ChatSidebar from '../../components/chat-sidebar/ChatSidebar'
import ChatRightbar from '../../components/chatRightbar/ChatRightbar'


const Chat = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const selectedChat = useSelector(state => state.chat.selectedChat);

  return (
    <div>
      <Topbar />
      <div className="container-fluid">
        <div className="row">
          <div className='p-0' style={{ width: "270px" }}>
            <ChatSidebar/>
          </div>
          <div className="col">
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </div>
          {selectedChat &&
            <div className="col-3 p-0">
              <ChatRightbar />
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Chat
