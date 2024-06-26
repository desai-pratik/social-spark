import React from "react";
import "./topbar.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from "../../context/sidebarSlice";

const Topbar = () => {

  const user = useSelector(state => state.auth.user);
  const chatNotification = useSelector(state => state.chat.notification);
  const dispatch = useDispatch();


  return (
    <nav className="navbar navbar-expand-lg topbar py-1 position-sticky z-3">
      <div className="container-fluid">
        <div>
          <span className="navbar-toggler-icon me-3 text-white cursor-pointer" onClick={() => dispatch(toggleSidebar())}></span>
          <Link className="navbar-brand" to="/">
            <img src="/assets/logo-dark-bg-remove.png" className="logo object-fit-cover" alt="logo" />
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
            {/* <ul className="navbar-nav  mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link text-white" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="#">Timeline</a>
                            </li>
                        </ul> */}
            <div className="icons d-flex gap-4 text-white mx-4">
              <div className=" position-relative notification">
                <i className="bi bi-person-fill fs-5"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  1<span className="visually-hidden">unread messages</span>
                </span>
              </div>
              <Link to="/chats" className="position-relative notification text-white">
                <i className="bi bi-chat-left-dots-fill fs-5"></i>
                {chatNotification.length > 0 &&(
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {chatNotification.length}
                  </span>
                )}
              </Link>
              <div className="notification">
                <i className="bi bi-gear-fill fs-5"></i>
                {/* <span className="notification-pill">1</span> */}
              </div>
            </div>
            <div className="user-image">
              <Link to={"/profile/" + user?.username}>
                <img src={user?.profilePicture ? user?.profilePicture : "/assets/default-user.jpg"} className="object-fit-cover" alt={user?.username} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
