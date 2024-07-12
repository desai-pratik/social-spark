import React, { useEffect, useState } from 'react'
import "./sidebar.css"
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { getSenderDetails } from '../../chatLogic';
import GroupChatModal from '../group-chat-modal/GroupChatModal';
import { addSelectedChat } from '../../context/chatSlice';
import { toast } from 'react-toastify';
import { tostConfig } from '../../config/interface';
import { Button } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';


const Sidebar = ({ Chat, fetchAgain }) => {
  const HomeSidebar = () => {
    return (
      <div className='sidebar-container p-3'>
        <Link to="/" className="menu d-flex align-items-center text-decoration-none my-2 p-2">
          <i className="bi bi-rss"></i>
          <h6 className="menu-text ms-3 m-0">Home</h6>
        </Link>
        <Link to="/chats" className="menu d-flex align-items-center text-decoration-none my-2 p-2">
          <i className="bi bi-chat-left-dots"></i>
          <h6 className="menu-text ms-3 m-0">Chats</h6>
        </Link>
        <div className="menu d-flex align-items-center my-2 p-2">
          <i className="bi bi-play-circle"></i>
          <h6 className="menu-text ms-3 m-0">Videos</h6>
        </div>
        <div className="menu d-flex align-items-center my-2 p-2">
          <i className="bi bi-people"></i>
          <h6 className="menu-text ms-3 m-0">Groups</h6>
        </div>
        <div className="menu d-flex align-items-center my-2 p-2">
          <i className="bi bi-bookmark-check"></i>
          <h6 className="menu-text ms-3 m-0">Bookmarks</h6>
        </div>
        <div className="menu d-flex align-items-center my-2 p-2">
          <i className="bi bi-briefcase"></i>
          <h6 className="menu-text ms-3 m-0">Jobs</h6>
        </div>
        <div className="menu d-flex align-items-center my-2 p-2">
          <i className="bi bi-calendar-event"></i>
          <h6 className="menu-text ms-3 m-0">Events</h6>
        </div>
        <div className="menu d-flex align-items-center my-2 p-2">
          <i className="bi bi-mortarboard"></i>
          <h6 className="menu-text ms-3 m-0">Courses</h6>
        </div>
        <Button variant="contained" color="primary">Show More</Button>
        <hr />

        <div className="menu-user d-flex align-items-center">
          <img src="/assets/default-user.jpg" className='w-25 p-1 rounded-circle' alt="friends images" />
          <h6 className="menu-text ms-2 m-0">Pratik Desai</h6>
        </div>
        <div className="menu-user d-flex align-items-center">
          <img src="/assets/default-user.jpg" className='w-25 p-1 rounded-circle' alt="friends images" />
          <h6 className="menu-text ms-2 m-0">Pratik Desai</h6>
        </div>
        <div className="menu-user d-flex align-items-center">
          <img src="/assets/default-user.jpg" className='w-25 p-1 rounded-circle' alt="friends images" />
          <h6 className="menu-text ms-2 m-0">Pratik Desai</h6>
        </div>
        <div className="menu-user d-flex align-items-center">
          <img src="/assets/default-user.jpg" className='w-25 p-1 rounded-circle' alt="friends images" />
          <h6 className="menu-text ms-2 m-0">Pratik Desai</h6>
        </div>
        <div className="menu-user d-flex align-items-center">
          <img src="/assets/default-user.jpg" className='w-25 p-1 rounded-circle' alt="friends images" />
          <h6 className="menu-text ms-2 m-0">Pratik Desai</h6>
        </div>
      </div>
    )
  }

  const ChatSidebar = () => {
    const user = useSelector(state => state.auth.user);
    const selectedChat = useSelector(state => state.chat.selectedChat);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [chats, setChats] = useState([]);
    const dispatch = useDispatch();
    // const senderDetails = selectedChat && getSenderDetails(user, selectedChat.users);

    useEffect(() => {
      fetchChats();
    }, []);

    const fetchChats = async () => {
      try {
        // dispatch(toggleLoading(true))
        const config = {
          headers: {
            authorization: `Bearer ${user.token}`
          }
        };
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/chats`, config);
        setChats(res.data);
        // dispatch(toggleLoading(false))
      } catch (error) {
        toast.error(`${error}`, tostConfig);
      }
    }

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
    }

    return (
      <div className='p-3 pt-0 chat-sidebar'>
        <div className='sidebar-first pt-3'>
          <div className="d-flex align-items-center border">
            <input type="text" className="p-1 rounded outline-none border-0" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search User' />
            <i className="bi bi-search p-2 cursor-pointer" onClick={handelSearch}></i>
          </div>
          <div className='search-results'>
            {searchResults.map(result => (
              <div className='d-flex align-items-center rounded p-2 bg-body-tertiary my-2 cursor-pointer' key={result._id} onClick={() => accessChat(result._id)}>
                <img src={result.profilePicture ? result.profilePicture : "/assets/default-user.jpg"} className='rounded-circle me-2' style={{ width: "40px" }} alt="" />
                <div>
                  <span className='m-0 d-block' style={{ lineHeight: "8px", paddingTop: "5px" }}>{result.username}</span>
                  <small>{result.email}</small>
                </div>
              </div>
            ))}
          </div>
          <hr className='mb-1'/>
          <div className="d-flex justify-content-between align-items-center position-sticky top-0 pb-1">
            <h5 className='m-0'>Chats</h5>
            {/* <button type="button" className="p-2 border-0 bg-light" data-bs-toggle="modal" data-bs-target="#exampleModal">
              <i className="bi bi-plus-circle"></i> Create Group
            </button> */}
            <Button variant="contained" startIcon={<AddCircleOutline />} color="primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Create Group</Button>
          </div>
        </div>
        <GroupChatModal chats={chats} setChats={setChats} />

        {chats && chats.map((chat) => (
          <div onClick={() => dispatch(addSelectedChat(chat))} className={`d-flex align-items-center justify-content-between rounded p-2  mb-2 cursor-pointer ${chat?._id === selectedChat?._id ? "bg-dark-subtle" : "bg-body-secondary"}`} key={chat._id}>
            <div className='d-flex align-items-center'>
                 <img src={!chat.isGroupChat ? getSenderDetails(user, chat.users).profilePicture ? getSenderDetails(user, chat.users).profilePicture : '/assets/default-user.jpg' : "/assets/default-users.png"} className='rounded-circle me-2' style={{ width: "40px" }} alt="" />
              <div>
                <span className='m-0 d-block capitalize' style={{ lineHeight: "8px", paddingTop: "5px" }}>
                  {!chat.isGroupChat ? getSenderDetails(user, chat.users).username : chat.chatName}
                </span>
                {!chat.isGroupChat && (
                  <small>{getSenderDetails(user, chat.users).email}</small>
                )}
              </div>
            </div>
            <i className="bi bi-three-dots-vertical p-1 cursor-pointer"></i>
          </div>)
        )}
      </div>
    )
  }

  return (
    <>
      {Chat ? <ChatSidebar /> : <HomeSidebar />}
    </>
  )
}

export default Sidebar
