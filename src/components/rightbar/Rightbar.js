import React, { useContext, useEffect, useState } from 'react'
import "./rightbar.css"
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Rightbar = ({ user }) => {

  const { user: currentUser, dispatch } = useContext(AuthContext)

  const HomeRightbar = () => {
    return (
      <div className='rigthbar pt-3 pe-3 position-sticky overflow-y-auto'>
        <h5 className='fw-normal'><b>polo Foster </b> and <b>3 other friends </b>have a birthday today.</h5>
        <div className="banner mb-4">
          <img src="/assets/banner.png" className='w-100 rounded-4' alt="banner" />
        </div>
        <div className="online-friends">
          <h6 className='mb-3'>Online Friends</h6>
          <div className="friend my-3 d-flex align-items-center gap-3">
            <div className="position-relative d-inline-block">
              <img className='rounded-circle' style={{ width: "40px" }} src="/assets/default-user.jpg" alt="online user" />
              <span className="position-absolute end-25 top-25 translate-middle p-2 bg-success border border-light rounded-circle">
              </span>
            </div>
            <h6>john monsj</h6>
          </div>
          <div className="friend my-3 d-flex align-items-center gap-3">
            <div className="position-relative d-inline-block">
              <img className='rounded-circle' style={{ width: "40px" }} src="/assets/default-user.jpg" alt="online user" />
              <span className="position-absolute start-25 top-25 translate-middle p-2 bg-success border border-light rounded-circle">
              </span>
            </div>
            <h6>john monsj</h6>
          </div>
        </div>
      </div>
    )
  }

  const ProfileRightbar = () => {
    const [friends, setFriends] = useState([]);
    const [followed, setFollowed] = useState(false);
   
    useEffect(() => {
      const getFriends = async () => {
        try {
          const friendsist = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/friends/${user._id}`);
          setFriends(friendsist.data)
        } catch (err) {
          console.log(err);
        }
      }
      if (user._id) {
        getFriends();
      }
    }, [user._id])

    useEffect(() => {
      setFollowed(currentUser.followings.includes(user?._id))
    }, [currentUser, user.id]);

    const handleClick = async () => {
      try {
        if (followed) {
          await axios.put(`${process.env.REACT_APP_API_BASE_URL}/user/${user._id}/unfollow`, {
            userId: currentUser._id,
          });
          dispatch({type:"UNFOLLOW", payload: user._id})
        } else {
          await axios.put(`${process.env.REACT_APP_API_BASE_URL}/user/${user._id}/follow`, {
            userId: currentUser._id,
          });
          dispatch({type:"FOLLOW", payload: user._id})
        }
      } catch (error) {
        console.log(error);
      }
      setFollowed(!followed);
    }
    return (
      <div className='rigthbar pt-3 pe-3 position-sticky overflow-y-auto'>
        {user.username !== currentUser.username && (
          <button className="btn-follow" onClick={handleClick}>{followed ? "Unfollow" : "Follow"} <i className="bi bi-plus-circle"></i></button>
        )}
        <h5>User Information</h5>
        <b>City:</b> <span>{user.city}</span> <br />
        <b>From:</b> <span>{user.from}</span> <br />
        <b>Relationship:</b> <span>{user.relationship}</span> <br />

        <div className="container-fluid p-1">
          <h5 className='mt-3'>User Friends</h5>
          <div className="row">
            {friends.map((friend) => (
              <Link to={'/profile/' + friend.username} key={friend._id} className='text-decoration-none'>
                <div className="col-md-4 p-2" >
                  <img src={friend.profilePicture ? friend.profilePicture : "/assets/default-user.jpg"} className='w-100 ' alt="friend images" />
                  <small className='text-center d-block'>{friend.username}</small>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    );
  }

  return (
    <>
      {user ? <ProfileRightbar /> : <HomeRightbar />}
    </>
  )
}

export default Rightbar
