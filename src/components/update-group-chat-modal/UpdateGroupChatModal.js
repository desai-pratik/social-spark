import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addSelectedChat } from '../../context/chatSlice';
import { tostConfig } from '../../config/interface';
import { Button } from '@mui/material';

const UpdateGroupChatModal = ({ fetchMessage, fetchAgain, setFetchAgain }) => {
    const user = useSelector(state => state.auth.user);
    const selectedChat = useSelector(state => state.chat.selectedChat);
    const [renameGroupChat, setRenameGroupChat] = useState();
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const dispatch = useDispatch();

    const removeUser = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast.error(`Only admins can remove someone!`, tostConfig);
        }

        try {
            const config = {
                headers: {
                    authorization: `Bearer ${user.token}`
                }
            };
            const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/chats/groupremove`, {
                chatId: selectedChat._id,
                userId: user1._id,
            }, config);

            user1._id === user._id ? dispatch(addSelectedChat(null)) : dispatch(addSelectedChat(res.data));
            setFetchAgain(!fetchAgain);
            fetchMessage();
        } catch (error) {
            toast.error(`${error}`, tostConfig);
        }

    };

    const handleRename = async (e) => {
        e.preventDefault();
        if (!renameGroupChat) { return; }
        try {
            const config = {
                headers: {
                    authorization: `Bearer ${user.token}`
                }
            };
            const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/chats/rename`, {
                chatId: selectedChat._id,
                chatName: renameGroupChat,
            }, config);

            dispatch(addSelectedChat(res.data));
            setFetchAgain(!fetchAgain);

        } catch (error) {
            toast.error(`${error}`, tostConfig);
        }
        setRenameGroupChat('');
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return;
        try {
            const config = {
                headers: {
                    authorization: `Bearer ${user.token}`
                }
            };
            const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/?search=${search}`, config);
            setSearchResults(res.data);
        } catch (error) {
            toast.error(`${error}`, tostConfig);
        }
    };

    const handleGroup = async (userToAdd) => {
        if (selectedChat.users.some(user => user._id === userToAdd._id)) {
            toast.error(`${userToAdd.username} Already Added!`, tostConfig);
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast.error(`Only admins can add someone!`, tostConfig);
            return;
        }
        try {
            const config = {
                headers: {
                    authorization: `Bearer ${user.token}`
                }
            };
            const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/chats/groupadd`, {
                chatId: selectedChat._id,
                userId: userToAdd._id,
            }, config);

            dispatch(addSelectedChat(res.data));
            setFetchAgain(!fetchAgain);
        } catch (error) {
            toast.error(`${error}`, tostConfig);
        }
        setSearch('')
        setSearchResults([]);
    };

    return (
        <div className="modal fade" id="updateGroupChat" tabIndex="-1" aria-labelledby="updateGroupChatLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="updateGroupChat">{selectedChat.chatName}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form action="">
                        <div className="modal-body">
                            <div className="d-flex gap-2 my-3">
                                <input type="text" className="form-control" placeholder="Rename Group" value={renameGroupChat} onChange={(e) => setRenameGroupChat(e.target.value)} />
                                <Button variant="contained" onClick={(e) => handleRename(e)} color="primary" data-bs-dismiss="modal" >Update</Button>
                            </div>
                            <input type="text" className="form-control" placeholder="Add Users" value={search} onChange={(e) => handleSearch(e.target.value)} />
                            {searchResults?.slice(0, 4).map(user => (
                                <div onClick={() => handleGroup(user)} className='d-flex align-items-center rounded p-2 bg-info-subtle cursor-pointer my-2'>
                                    <img src={user.profilePicture ? user.profilePicture : "/assets/default-user.jpg"} className='rounded-circle me-2' style={{ width: "40px", height: "40px" }} alt={user.username} title={user.username} />
                                    <div>
                                        <span className='m-0 d-block' style={{ lineHeight: "8px", paddingTop: "5px" }}>{user.username}</span>
                                        <small>{user.email}</small>
                                    </div>
                                </div>
                            ))}
                            {selectedChat.users.map((user) => (
                                <span key={user._id} className="badge rounded-pill text-bg-info m-2">{user.username} <i className="bi bi-x-lg ms-1 cursor-pointer fw-bolder" data-bs-dismiss="modal" onClick={() => removeUser(user)}></i></span>
                            ))}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdateGroupChatModal
