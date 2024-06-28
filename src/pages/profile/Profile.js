import React, { useEffect, useState } from 'react'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feedback from '../../components/feedback/Feedback'
import Rightbar from '../../components/rightbar/Rightbar'
import "./profile.css"
import ProfileInfo from '../../components/profile-info/ProfileInfo'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const Profile = () => {
    const [user, setUser] = useState({});
    const params = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user?username=${params.username}`);
                setUser(res.data);
            } catch (error) {
                toast.error(`${error}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
            }
        };
        fetchUser();
    }, [params.username]);

    return (
        <div>
            <Topbar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-2 p-0">
                        <Sidebar />
                    </div>
                    <div className="col p-0">
                        <ProfileInfo user={user} />

                        <div className="container-fluid">
                            <div className="row">
                                <div className="col p-0">
                                    <Feedback username={params.username} />
                                </div>
                                <div className="col-3 p-0">
                                    <Rightbar user={user} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Profile
