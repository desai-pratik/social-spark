import React, { useEffect, useState } from 'react';
import "./rightbar.css";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { editUser } from '../../context/authSlice';
import { tostConfig } from '../../config/interface';
import { getSenderDetails } from '../../chatLogic';
import { Button, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

const Rightbar = ({ user, chat }) => {

  const currentUser = useSelector(state => state.auth.user);
  const selectedChat = useSelector(state => state.chat.selectedChat);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

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
          const friendsList = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/friends/${user._id}`);
          setFriends(friendsList.data);
        } catch (error) {
          toast.error(`${error.response.data}`, tostConfig);
        }
      }
      if (user._id) {
        getFriends();
      }
    }, [user._id]);

    useEffect(() => {
      setFollowed(currentUser.followings.includes(user._id));
    }, [currentUser, user, followed]);

    const handleFollow = async () => {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${currentUser.token}`
          }
        }
        if (followed) {
          await axios.put(`${process.env.REACT_APP_API_BASE_URL}/user/${user._id}/unfollow`, {}, config);
          setFollowed(true);
          dispatch(editUser({ followings: currentUser.followings.filter(id => id !== user._id) }));
        } else {
          await axios.put(`${process.env.REACT_APP_API_BASE_URL}/user/${user._id}/follow`, {}, config);
          setFollowed(false);
          dispatch(editUser({ followings: [...currentUser.followings, user._id] }));
        }
      } catch (error) {
        toast.error(error.response.data.message, tostConfig);
      }
    };

    return (
      <div className='rigthbar pt-3 pe-3 position-sticky overflow-y-auto'>
        {user.username !== currentUser.username && (
          <LoadingButton variant="contained" color="primary" loading={loading} endIcon={!followed ? <AddCircleOutline /> : <RemoveCircleOutline />} onClick={handleFollow}>
            <span>{followed ? "Unfollow" : "Follow"}</span>
          </LoadingButton>
        )}
        <Typography variant='h5'>User Information</Typography>
        <b>City:</b> <span>{user.city}</span> <br />
        <b>From:</b> <span>{user.from}</span> <br />
        <b>Relationship:</b> <span>{user.relationship}</span> <br />

        <div className="container-fluid p-1">
          <h5 className='mt-3'>User Friends</h5>
          {friends.length === 0 && <p className="mt-3">No friends found!</p>}
          <div className="row">
            {friends.map((friend) => (
              <div className="col-md-4 p-2" >
                <Link to={'/profile/' + friend.username} key={friend._id} className='text-decoration-none'>
                  <img src={friend.profilePicture || "/assets/default-user.jpg"} className='w-100 ' alt="friend images" />
                  <small className='text-center d-block capitalize'>{friend.username}</small>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const ChatRightbar = () => {
    const [followed, setFollowed] = useState(false);
    const senderDetails = selectedChat && getSenderDetails(currentUser, selectedChat.users);

    useEffect(() => {
      setFollowed(currentUser.followings.includes(senderDetails?._id));
    }, [senderDetails, followed]);

    const handleFollow = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${currentUser.token}`
          }
        }
        if (followed) {
          await axios.put(`${process.env.REACT_APP_API_BASE_URL}/user/${senderDetails._id}/unfollow`, {}, config);
          setFollowed(true);
          dispatch(editUser({ followings: currentUser.followings.filter(id => id !== senderDetails._id) }));
        } else {
          await axios.put(`${process.env.REACT_APP_API_BASE_URL}/user/${senderDetails._id}/follow`, {}, config);
          setFollowed(false);
          dispatch(editUser({ followings: [...currentUser.followings, senderDetails._id] }));
        }
        setLoading(false);
      } catch (error) {
        toast.error(error.response.data.message, tostConfig);
      }
    };
    return (
      <div className='rigthbar pt-3 pe-3 position-sticky overflow-y-auto'>
        {selectedChat ?
          selectedChat.isGroupChat ? (
            <div className='text-center'>
              <img src="/assets/default-users.png" alt={selectedChat.chatName} className='rounded-circle' style={{ width: "150px" }} title={selectedChat.chatName} />
              <h3 className='capitalize'>{selectedChat.chatName}</h3>
              <p className=''> {selectedChat.users.length} Members</p>
              <div className="container-fluid">
                <div className="row">
                  {selectedChat.users.map((member) => (
                    <div className="col-md-4 p-2">
                      <Link to={'/profile/' + member.username} key={member._id} className='text-decoration-none'>
                        <img src={member.profilePicture || "/assets/default-user.jpg"} className='w-100 rounded-circle' alt={member.username} />
                        <small className='text-center d-block capitalize'>{member.username}</small>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* <div className="container-fluid p-1">
                <div className="row">
                  {selectedChat.users.map((friend) => (
                    <div className="col-md-4 p-2" >
                      <Link to={'/profile/' + friend.username} key={friend._id} className='text-decoration-none'>
                        <img src={friend.profilePicture || "/assets/default-user.jpg"} className='rounded-circle' alt="friend images" />
                        <small className='text-center d-block'>{friend.username}</small>
                      </Link>
                    </div>
                  ))}
                </div>
              </div> */}

            </div>
          ) : (
            <div className='text-center'>
              <img src={senderDetails.profilePicture || "/assets/default-user.jpg"} className='rounded-circle' style={{ width: "150px" }} />
              <h3 className='capitalize'>{senderDetails.username}</h3>
              <h6 className=''>{senderDetails.email}</h6>
              <LoadingButton variant="contained" color="primary" loading={loading} endIcon={!followed ? <AddCircleOutline /> : <RemoveCircleOutline />} onClick={handleFollow}>
                <span>{followed ? "Unfollow" : "Follow"}</span>
              </LoadingButton>
              <p>Followers : {senderDetails.followers ? senderDetails.followers.length : "0"}</p>
            </div>
          )
          : (
            <p className="text-center">no chat is selected!!</p>
          )}
      </div>
    );
  }

  return (
    <>
      {user && <ProfileRightbar />}
      {chat && <ChatRightbar />}
      {(!user && !chat) && (<HomeRightbar />)}
    </>
  )
}

export default Rightbar
