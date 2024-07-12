import React, { useState } from 'react'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import ChatBox from '../../components/chatBox/ChatBox'
import Rightbar from '../../components/rightbar/Rightbar'
import { useSelector } from 'react-redux'
import Loading from '../../components/loading/Loading'

const Chat = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const loading = useSelector(state => state.loading.loading);

  return loading ? <Loading /> : (
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
          <Rightbar chat/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
