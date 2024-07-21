import axios from 'axios';
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { tostConfig } from '../../config/interface';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';

const GroupChatModal = ({ chats, setChats }) => {
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const user = useSelector(state => state.auth.user);

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
    }
    const handleSubmit = async () => {
        if (!selectedUsers || !groupChatName) {
            toast.error('Please fill all the felids.', tostConfig);
            return;
        }
        try {
            const config = {
                headers: {
                    authorization: `Bearer ${user.token}`
                }
            };
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/chats/group`, {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
            }, config);
            setChats([...chats, res.data]);
            toast.success(`${groupChatName} is Created.`, tostConfig);
        } catch (error) {
            toast.error(`Failed to create the chat!`, tostConfig);
        }
    }
    const handleGroup = (userToAdd) => {
        try {
            if (selectedUsers.some(user => user._id === userToAdd._id)) {
                toast.error(`${userToAdd.username} Already Added!`, tostConfig);
                return;
            }
            setSelectedUsers([...selectedUsers, userToAdd])
            setSearch('')
            setSearchResults([]);
        } catch (error) {
            toast.error(`${error}`, tostConfig);
        }

    }
    const removeUser = (removeToUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== removeToUser._id))
    }

    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Create Group Chat</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form action="">
                        <div className="modal-body">
                            <div className="form-floating mb-2">
                                <input type="text" className="form-control" id="floatingInput" placeholder="Group Name" value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
                                <label htmlFor="floatingInput">Group Name</label>
                            </div>
                            <div className="form-floating">
                                <input type="text" className="form-control" id="floatingInput" placeholder="Add Users" value={search} onChange={(e) => handleSearch(e.target.value)} />
                                <label htmlFor="floatingInput">Add Users</label>
                            </div>

                            {selectedUsers.map((user) => (
                                <span key={user._id} className="badge rounded-pill text-bg-info m-2">{user.username} <i className="bi bi-x-lg ms-1 cursor-pointer" onClick={() => removeUser(user)}></i></span>
                            ))}

                            {searchResults?.slice(0, 4).map(user => (
                                <div onClick={() => handleGroup(user)} className='d-flex align-items-center rounded p-2 bg-info-subtle cursor-pointer my-2'>
                                    <img src={user.profilePicture ? user.profilePicture : "/assets/default-user.jpg"} className='rounded-circle me-2' style={{ width: "40px" }} alt={user.username} title={user.username} />
                                    <div>
                                        <span className='m-0 d-block' style={{ lineHeight: "8px", paddingTop: "5px" }}>{user.username}</span>
                                        <small>{user.email}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="modal-footer">
                            {/* <button type="button" className="btn text-white" style={{ backgroundColor: "#21aeff" }} onClick={handleSubmit} data-bs-dismiss="modal">Create Group</button> */}
                            <Button variant="contained" color="primary" onClick={handleSubmit} data-bs-dismiss="modal" >Create Group</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default GroupChatModal
