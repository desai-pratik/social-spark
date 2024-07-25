import axios from "axios";
import { useEffect, useState } from "react";
import "./chatSidebar.css";
import { useDispatch, useSelector } from "react-redux";
import { tostConfig } from "../../config/interface";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { addNotification, addSelectedChat } from "../../context/chatSlice";
import { Button } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import GroupChatModal from "../group-chat-modal/GroupChatModal";
import { getSenderDetails } from "../../chatLogic";

const ChatSidebar = () => {
  const user = useSelector(state => state.auth.user);
  const selectedChat = useSelector(state => state.chat.selectedChat);
  const chatNotification = useSelector(state => state.chat.notification);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [chats, setChats] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    fetchChats();
  }, [location.pathname]);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`
        }
      };
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/chats`, config);
      if (location.pathname === '/chats') {
        setChats(res.data);
      } else if (location.pathname === '/groupchat') {
        setChats(res.data.filter(chat => chat.isGroupChat));
      }
    } catch (error) {
      toast.error(`${error}`, tostConfig);
    }
  };

  const handelSearch = async () => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`
        }
      };
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/?search=${search}`, config);
      setSearchResults(res.data);
    } catch (error) {
      toast.error(`${error}`, tostConfig);
    }
  };

  const getInputValue = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handelSearch();
    }
  };

  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      };
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/chats`, { userId }, config);
      if (!chats.find((c) => c._id === res.data._id)) { setChats([res.data, ...chats]); }
      dispatch(addSelectedChat(res.data));
      setSearchResults([]);
      setSearch("");
    } catch (error) {
      toast.error(`${error}`, tostConfig);
    }
  };

  const showToast = (toastId) => {
    const toastElement = document.getElementById(`liveToast-${toastId}`);
    if (toastElement) {
      const bsToast = new window.bootstrap.Toast(toastElement, {
        autohide: false,
      });
      bsToast.show();
    }
  };

  const deleteChat = async (chatId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      };
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/chats/${chatId}`, config);
      setChats(chats.filter((chat) => chat._id !== chatId));
      dispatch(addSelectedChat(null));

      const toastElement = document.getElementById(`liveToast-${chatId}`);
      if (toastElement) {
        const bsToast = new window.bootstrap.Toast(toastElement, {
          autohide: false,
        });
        bsToast.hide();
      }

      // Implement your delete chat logic here
    } catch (error) {
      toast.error(`${error}`, tostConfig);
    }
  };

  const SelectedChat = async (chat)=> {
    dispatch(addSelectedChat(chat));
    dispatch(addNotification(chatNotification.filter((chatNotify) => chatNotify.chat._id !== chat._id)));
    // this is not working when i select the chat then notification was not gone for particular user
  }

  const getUnreadNotificationCount = (chat) => {
    return chatNotification.filter((n) => n.chat._id === chat._id && !n.read).length;
  };

  return (
    <div className='p-3 pt-0 chat-sidebar'>
      <div className='sidebar-first pt-3'>
        <form action="" onKeyDown={getInputValue} className="d-flex align-items-center border">
          <input type="text" className="p-1 rounded outline-none border-0 w-100" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search User' />
          <i className="bi bi-search p-2 cursor-pointer" onClick={handelSearch}></i>
        </form>
        <div className='search-results'>
          {searchResults.map(result => (
            <div className='d-flex align-items-center rounded p-2 gap-2 bg-body-tertiary my-2 cursor-pointer' key={result._id} onClick={() => accessChat(result._id)}>
              <img src={result.profilePicture ? result.profilePicture : "/assets/default-user.jpg"} className='rounded-circle' style={{ width: "40px", height: "40px" }} alt={result.username} title={result.username} />
              <div>
                <span className='m-0 d-block' style={{ lineHeight: "8px", paddingTop: "5px" }}>{result.username}</span>
                <small>{result.email.length > 20 ? `${result.email.slice(0, 20)}...` : result.email}</small>
              </div>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-between align-items-center position-sticky top-0 pb-2 pt-2">
          <h5 className='m-0'>Chats</h5>
          <Button variant="contained" startIcon={<AddCircleOutline />} color="primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Create Group</Button>
        </div>
      </div>
      <GroupChatModal chats={chats} setChats={setChats} />

      {chats && chats.map((chat) => (
        // <div onClick={() => dispatch(addSelectedChat(chat))} className={`d-flex align-items-center justify-content-between rounded p-2  mb-2 cursor-pointer ${chat?._id === selectedChat?._id ? "bg-dark-subtle" : "bg-body-secondary"}`} key={chat._id}>
        <div onClick={() => SelectedChat(chat)} className={`d-flex align-items-center justify-content-between rounded p-2  mb-2 cursor-pointer ${chat?._id === selectedChat?._id ? "bg-dark-subtle" : "bg-body-secondary"}`} key={chat._id}>
          <div className='d-flex align-items-center'>
            <img
              src={!chat.isGroupChat ? getSenderDetails(user, chat.users).profilePicture ? getSenderDetails(user, chat.users).profilePicture : '/assets/default-user.jpg' : "/assets/default-users.png"}
              className='rounded-circle me-2'
              style={{ width: "40px", height: "40px" }}
              alt={chat.isGroupChat ? chat.chatName : getSenderDetails(user, chat.users).username}
              title={chat.isGroupChat ? chat.chatName : getSenderDetails(user, chat.users).username} />
            <div>
              <span className='m-0 d-block capitalize' style={{ lineHeight: "8px", paddingTop: "5px" }}>
                {!chat.isGroupChat ? getSenderDetails(user, chat.users).username : chat.chatName}
              </span>
              {!chat.isGroupChat && (
                <small>{getSenderDetails(user, chat.users).email.length > 17
                  ? `${getSenderDetails(user, chat.users).email.slice(0, 17)}...`
                  : getSenderDetails(user, chat.users).email}</small>
              )}
            </div>
          </div>

          {/* i need notification length here for particular chat*/}
          {getUnreadNotificationCount(chat) > 0 ? (
            <span className="badge bg-danger rounded-pill">
              {getUnreadNotificationCount(chat)}
            </span>
          ) : (
            <div>
              <i className="bi bi-three-dots-vertical p-1 cursor-pointer" onClick={() => showToast(chat._id)}></i>

              <div className="toast-container bg-white" style={{ width: "200px" }}>
                <div id={`liveToast-${chat._id}`} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                  <div className="toast-header">
                    <strong className="me-auto capitalize">{!chat.isGroupChat ? getSenderDetails(user, chat.users).username : chat.chatName}</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                  </div>
                  <div className="toast-body">
                    <Button variant="outlined" className="w-100 my-1" onClick={() => deleteChat(chat._id)} >Delete Chat</Button>
                  </div>
                </div>
              </div>
            </div>
          )
          }

        </div>)
      )}
    </div>
  )
}


export default ChatSidebar