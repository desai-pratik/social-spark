import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { tostConfig } from "../../config/interface";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Typography } from "@mui/material";
import { editUser } from "../../context/authSlice";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

const ProfileRightbar = ({user}) => {
    const [friends, setFriends] = useState([]);
    const [followed, setFollowed] = useState(false);
    const currentUser = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
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
        setLoading(false);
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
                  <img src={friend.profilePicture || "/assets/default-user.jpg"} className='w-100' alt={friend.username} title={friend.username} />
                  <small className='text-center d-block capitalize'>{friend.username}</small>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  export default ProfileRightbar