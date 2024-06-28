import React, { useState } from 'react'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import ChatBox from '../../components/chatBox/ChatBox'

const Chat = () => {
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div>
      <Topbar />
      <div className="container-fluid">
        <div className="row">
          <div className='p-0' style={{ width: "270px" }}>
            <Sidebar Chat fetchAgain={fetchAgain} />
          </div>
          <div className="col">
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </div>
          <div className="col-3 p-0">
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
