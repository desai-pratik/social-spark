import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSenderDetails } from "../../chatLogic";
import axios from "axios";
import { editUser } from "../../context/authSlice";
import { tostConfig } from "../../config/interface";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";


const ChatRightbar = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.auth.user);
    const selectedChat = useSelector(state => state.chat.selectedChat);
    const [loading, setLoading] = useState(false);
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
        <div className='rigthbar p-3 position-sticky overflow-y-auto'>
            {selectedChat ?
                selectedChat.isGroupChat ? (
                    <div className='text-center'>
                        <img src="/assets/default-users.png" className='rounded-circle' style={{ width: "150px", height: "150px" }} title={selectedChat.chatName} alt={selectedChat.chatName} />
                        <h3 className='capitalize'>{selectedChat.chatName}</h3>
                        <p className=''> {selectedChat.users.length} Members</p>
                        {selectedChat.users.map((member) => (
                            <div key={member._id} className="p-2 my-1 mx-3 bg-body-secondary rounded-3">
                                <Link to={'/profile/' + member.username} key={member._id} className='d-flex align-items-center text-decoration-none'>
                                    <img src={member.profilePicture || "/assets/default-user.jpg"} className='rounded-circle me-3' style={{ width: "30px", height: "30px" }} alt={member.username} title={member.username} />
                                    <p className='d-block m-0 capitalize'>{member.username}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='text-center'>
                        <img src={senderDetails.profilePicture || "/assets/default-user.jpg"} className='rounded-circle' style={{ width: "150px", height: "150px" }} alt={senderDetails.username} title={senderDetails.username} />
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


export default ChatRightbar