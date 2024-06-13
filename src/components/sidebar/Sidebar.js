import React from 'react'
import "./sidebar.css"
const Sidebar = () => {
  return (
    <div className='sidebar-container p-3'>
      <div className="menu d-flex align-items-center my-2 p-2">
        <i className="bi bi-rss"></i>
        <h6 className="menu-text ms-3 m-0">Feed</h6>
      </div>
      <div className="menu d-flex align-items-center my-2 p-2">
        <i className="bi bi-chat-left-dots"></i>
        <h6 className="menu-text ms-3 m-0">Chats</h6>
      </div>
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
      <button className="custom-btn">Show More</button>
      <hr />

      <div className="menu-user d-flex align-items-center">
        <img src="/assets/default-user.jpg" className='w-25 p-1 rounded-circle' alt="" />
         <h6 className="menu-text ms-2 m-0">Pratik Desai</h6>
      </div>
      <div className="menu-user d-flex align-items-center">
        <img src="/assets/default-user.jpg" className='w-25 p-1 rounded-circle' alt="" />
         <h6 className="menu-text ms-2 m-0">Pratik Desai</h6>
      </div>
      <div className="menu-user d-flex align-items-center">
        <img src="/assets/default-user.jpg" className='w-25 p-1 rounded-circle' alt="" />
         <h6 className="menu-text ms-2 m-0">Pratik Desai</h6>
      </div>
      <div className="menu-user d-flex align-items-center">
        <img src="/assets/default-user.jpg" className='w-25 p-1 rounded-circle' alt="" />
         <h6 className="menu-text ms-2 m-0">Pratik Desai</h6>
      </div>
      <div className="menu-user d-flex align-items-center">
        <img src="/assets/default-user.jpg" className='w-25 p-1 rounded-circle' alt="" />
         <h6 className="menu-text ms-2 m-0">Pratik Desai</h6>
      </div>
    </div>
  )
}

export default Sidebar
