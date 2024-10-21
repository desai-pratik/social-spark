import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./homeRightbar.css";
import { io } from "socket.io-client";


const HomeRightbar = () => {
    const user = useSelector(state => state.auth.user);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    useEffect(() => {
        const socket = io(process.env.REACT_APP_API_BASE_ENDPOINT);
        socket.emit('setup', user);
        socket.on('online users', (users) => setOnlineUsers(users));
        return () => socket.disconnect();
    }, [user]);

    return (
        <div className='rigthbar pt-3 pe-3 position-sticky overflow-y-auto'>
            <h5 className='fw-normal'><b>polo Foster </b> and <b>3 other friends </b>have a birthday today.</h5>
            <div className="banner mb-4">
                <img src="/assets/banner.png" className='w-100 rounded-4' alt="Event" title="Event" />
            </div>
            <div className="online-friends">
                <h6 className='mb-3'>Online Friends</h6>
                {onlineUsers ? onlineUsers.map(user => (
                    <div className="friend my-3 d-flex align-items-center gap-3" key={user.socketId}>
                        <div className="position-relative d-inline-block">
                            <img className='rounded-circle' style={{ width: "40px", height: "40px" }} src={user.profilePicture || '/assets/default-user.jpg'} alt={user.username} title={user.username} />
                            <span className="position-absolute end-25 top-25 translate-middle p-2 bg-success border border-light rounded-circle">
                            </span>
                        </div>
                        <h6>{user.username}</h6>
                    </div>
                )): (
                    <p>No online friends found!</p>
                )}
            </div>
        </div>
    )
}

export default HomeRightbar