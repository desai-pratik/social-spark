import "./homeSidebar.css";
import { Button } from "@mui/material"
import { Link } from "react-router-dom"


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
        <Link to="/videos" className="menu d-flex align-items-center text-decoration-none my-2 p-2">
          <i className="bi bi-play-circle"></i>
          <h6 className="menu-text ms-3 m-0">Videos</h6>
        </Link>
        <Link to="/groupchat" className="menu d-flex align-items-center text-decoration-none my-2 p-2">
          <i className="bi bi-people"></i>
          <h6 className="menu-text ms-3 m-0">Groups</h6>
        </Link>
        <Link to="/setting" className="menu d-flex align-items-center text-decoration-none my-2 p-2">
        <i className="bi bi-gear"></i>
          <h6 className="menu-text ms-3 m-0">Setting</h6>
        </Link>
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
      </div>
    )
  }

export default HomeSidebar
