import React, { useRef, useState } from "react";
import "./topbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from "../../context/sidebarSlice";
import { getSenderDetails } from "../../chatLogic";
import { addNotification, addSelectedChat } from "../../context/chatSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { tostConfig } from "../../config/interface";
import { addSearch } from "../../context/searchSlice";

const Topbar = () => {
  const user = useSelector(state => state.auth.user);
  const chatNotification = useSelector(state => state.chat.notification);
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const toastRef = useRef(null);
  const navigate = useNavigate();

  const showToast = () => {
    const toast = new window.bootstrap.Toast(toastRef.current, {
      autohide: false
    });
    if (toastRef.current) {
      toast.show();
    } else {
      toast.hide();
    }
  };

  const aggregateNotifications = () => {
    const notificationMap = new Map();
    chatNotification.forEach(notify => {
      const chatId = notify.chat._id;
      if (!notificationMap.has(chatId)) {
        notificationMap.set(chatId, { ...notify, messageCount: 0 });
      }
      notificationMap.get(chatId).messageCount += 1;
    });
    return Array.from(notificationMap.values());
  };

  const handleNotification = (chatObj) => {
    navigate("/chats");
    dispatch(addSelectedChat(chatObj.chat))
    dispatch(addNotification(chatNotification.filter((chatNotify) => chatNotify.chat._id !== chatObj.chat._id)));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/search?q=${query}`);
      dispatch(addSearch(response.data));
    } catch (error) {
      toast.error(`${error}`, tostConfig);
    }
  };

  const aggregatedNotifications = aggregateNotifications();

  return (
    <nav className="navbar navbar-expand-lg topbar py-1 position-sticky z-3">
      <div className="container-fluid">
        <div>
          <span className="me-3 cursor-pointer fs-4" style={{ color: "white" }} onClick={() => dispatch(toggleSidebar())}>&#9776;</span>
          <Link className="navbar-brand" to="/">
            <img src="/assets/logo-dark-bg-remove.png" className="logo object-fit-cover" alt="logo" title="SocialSpark" />
          </Link>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="topbar-center d-flex mx-auto">


            <form className="px-3 bg-white rounded-pill" onSubmit={(e) => handleSearch(e)} role="search">
              <i className="bi bi-search cursor-pointer" onClick={handleSearch}></i>
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for friend, post or video" />
            </form>


          </div>
          <div className="ms-auto d-flex align-items-center">
            <div className="icons d-flex gap-4 text-white mx-2">
              <div className="position-relative notification text-white" onClick={showToast}>
                <i className="bi bi-chat-left-dots-fill fs-5"></i>
                {chatNotification.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {chatNotification.length}
                  </span>
                )}
              </div>
              <div className="toast-container bg-white" style={{ width: "250px", marginLeft: "-150px", marginTop: "45px" }}>
                <div id={`liveToast`} className="toast" role="alert" aria-live="assertive" aria-atomic="true" ref={toastRef}>
                  <div className="toast-header">
                    <strong className="me-auto capitalize">Chat Notification</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                  </div>
                  <div className="toast-body text-black">
                    {aggregatedNotifications.length === 0 && (
                      <p className="m-0">No notifications in chat</p>
                    )}
                    {aggregatedNotifications.map((chatNotify) => (
                      <div className='d-flex align-items-center rounded p-2 bg-body-tertiary my-2 cursor-pointer' data-bs-dismiss="toast" aria-label="Close" key={chatNotify.chat._id} onClick={() => handleNotification(chatNotify)}>
                        <img src={!chatNotify.chat.isGroupChat ? getSenderDetails(user, chatNotify.chat.users).profilePicture ? getSenderDetails(user, chatNotify.chat.users).profilePicture : '/assets/default-user.jpg' : "/assets/default-users.png"}
                          className='rounded-circle me-2'
                          style={{ width: "40px", height: "40px" }}
                          alt={chatNotify.chat.isGroupChat ? chatNotify.chat.chatName : getSenderDetails(user, chatNotify.chat.users).username}
                          title={chatNotify.chat.isGroupChat ? chatNotify.chat.chatName : getSenderDetails(user, chatNotify.chat.users).username} />
                        <div>
                          <span className='m-0 d-block'>{chatNotify.chat.isGroupChat ? chatNotify.chat.chatName : getSenderDetails(user, chatNotify.chat.users).username}</span>
                          <span className="badge rounded-pill bg-danger">{chatNotify.messageCount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Link to="/setting" className="notification text-white">
                <i className="bi bi-gear-fill fs-5"></i>
              </Link>
            </div>
            <Link to={"/profile/" + user?.username} className="user-image">
              <img src={user?.profilePicture || "/assets/default-user.jpg"} className="object-fit-cover" alt={user?.username} title={user?.username} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
