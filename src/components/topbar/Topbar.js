import React, { useRef } from "react";
import "./topbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from "../../context/sidebarSlice";
import { getSenderDetails } from "../../chatLogic";
import { addNotification, addSelectedChat } from "../../context/chatSlice";

const Topbar = () => {
  const user = useSelector(state => state.auth.user);
  const chatNotifications = useSelector(state => state.chat.notification);
  const dispatch = useDispatch();
  const toastRef = useRef(null);
  const navigate = useNavigate();
  const notifiedChats = new Set();


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

  const handleNotification = (chatObj) => {
    navigate("/chats");
    dispatch(addSelectedChat(chatObj.chat))
    dispatch(addNotification(chatNotifications.filter((chatNotify) => chatNotify !== chatObj)))
  };

  const uniqueNotifications = chatNotifications.filter(chatNotify => {
    if (!notifiedChats.has(chatNotify.chat._id)) {
      notifiedChats.add(chatNotify.chat._id);
      return true;
    }
    return false;
  });

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
            <form className="px-3 bg-white rounded-pill" role="search">
              <i className="bi bi-search"></i>
              <input type="search" placeholder="Search for friend, post or video" />
            </form>
          </div>
          <div className="ms-auto d-flex align-items-center">
            <div className="icons d-flex gap-4 text-white mx-2">
              <div className="position-relative notification text-white" onClick={showToast}>
                <i className="bi bi-chat-left-dots-fill fs-5"></i>
                {chatNotifications.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {chatNotifications.length}
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
                    {uniqueNotifications.length === 0 && (
                      <p className="m-0">No notification in chat</p>
                    )}
                    {uniqueNotifications.map((chatNotify) => (
                      <div className='d-flex align-items-center rounded p-2 bg-body-tertiary my-2 cursor-pointer' data-bs-dismiss="toast" aria-label="Close" key={chatNotify.chat._id} onClick={() => handleNotification(chatNotify)}>
                        <img src={!chatNotify.chat.isGroupChat ? getSenderDetails(user, chatNotify.chat.users).profilePicture ? getSenderDetails(user, chatNotify.chat.users).profilePicture : '/assets/default-user.jpg' : "/assets/default-users.png"}
                          className='rounded-circle me-2'
                          style={{ width: "40px", height: "40px" }}
                          alt={chatNotify.chat.isGroupChat ? chatNotify.chat.chatName : getSenderDetails(user, chatNotify.chat.users).username}
                          title={chatNotify.chat.isGroupChat ? chatNotify.chat.chatName : getSenderDetails(user, chatNotify.chat.users).username} />
                        <div>
                          <span className='m-0 d-block'>{chatNotify.chat.isGroupChat ? chatNotify.chat.chatName : getSenderDetails(user, chatNotify.chat.users).username}</span>
                        </div>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {chatNotify.messages.length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* <div className="toast-container bg-white" style={{ width: "250px", marginLeft: "-150px", marginTop: "45px" }}>
                <div id={`liveToast`} className="toast" role="alert" aria-live="assertive" aria-atomic="true" ref={toastRef}>
                  <div className="toast-header">
                    <strong className="me-auto capitalize">Chat Notification</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                  </div>
                  <div className="toast-body text-black">
                    {!chatNotification.length > 0 && (
                      <p className="m-0">No notification in chat</p>
                    )}
                    {chatNotification.map((chatNotify) => (
                      <div className='d-flex align-items-center rounded p-2 bg-body-tertiary my-2 cursor-pointer' data-bs-dismiss="toast" aria-label="Close" key={chatNotify._id} onClick={() => handelNotification(chatNotify)}>
                        <img src={!chatNotify.chat.isGroupChat ? getSenderDetails(user, chatNotify.chat.users).profilePicture ? getSenderDetails(user, chatNotify.chat.users).profilePicture : '/assets/default-user.jpg' : "/assets/default-users.png"}
                          className='rounded-circle me-2'
                          style={{ width: "40px", height: "40px" }}
                          alt={chatNotify.chat.isGroupChat ? chatNotify.chat.chatName : getSenderDetails(user, chatNotify.chat.users).username}
                          title={chatNotify.chat.isGroupChat ? chatNotify.chat.chatName : getSenderDetails(user, chatNotify.chat.users).username} />
                        <div>
                          <span className='m-0 d-block'>{chatNotify.chat.isGroupChat ? chatNotify.chat.chatName : getSenderDetails(user, chatNotify.chat.users).username}</span>
                          <small></small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div> */}
              <Link to="/setting" className="notification text-white">
                <i className="bi bi-gear-fill fs-5"></i>
              </Link>
            </div>
            <Link to={"/profile/" + user?.username} className="user-image">
              <img src={user?.profilePicture ? user?.profilePicture : "/assets/default-user.jpg"} className="object-fit-cover" alt={user?.username} title={user?.username} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
