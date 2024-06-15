import React, { useContext } from 'react';
import "./topbar.css";
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';


const Topbar = () => {

    const { user } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg topbar p-0 position-sticky z-3">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/"><img src="/assets/logo-dark-bg-remove.png" className='logo' alt="logo" /> </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <div className="topbar-center d-flex mx-auto">
                        <form className="px-3 bg-white rounded-pill" role="search">
                            <i className="bi bi-search"></i>
                            <input type="search" placeholder='Search for friend, post or video' />
                        </form>
                    </div>
                    <div className="ms-auto d-flex align-items-center">
                        <ul className="navbar-nav  mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link text-white" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="#">Timeline</a>
                            </li>
                        </ul>
                        <div className="icons d-flex gap-4 text-white mx-4">
                            <div className=" position-relative notification">
                                <i className="bi bi-person-fill fs-5"></i>
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    1
                                    <span className="visually-hidden">unread messages</span>
                                </span>
                            </div>
                            <div className=" position-relative notification">
                                <i className="bi bi-chat-left-dots-fill fs-5"></i>
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger ">
                                    1
                                    <span className="visually-hidden">unread messages</span>
                                </span>
                            </div>
                            <div className="notification">
                                <i className="bi bi-gear-fill fs-5"></i>
                                {/* <span className="notification-pill">1</span> */}
                            </div>
                        </div>
                        <div className="user-image">
                            <Link to={"/profile/" + user.username}>
                                <img src={user.profilePicture ? user.profilePicture : "/assets/default-user.jpg"} alt="user image" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Topbar
