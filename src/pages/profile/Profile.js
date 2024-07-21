import React, { useEffect, useState } from 'react'
import Topbar from '../../components/topbar/Topbar'
import Feedback from '../../components/feedback/Feedback'
// import Rightbar from '../../components/rightbar/Rightbar'
import ProfileInfo from '../../components/profile-info/ProfileInfo'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { tostConfig } from '../../config/interface'
import { useSelector } from 'react-redux'
import HomeSidebar from '../../components/home-sidebar/HomeSidebar'
import ProfileRightbar from '../../components/profileRightbar/ProfileRightbar'

const Profile = () => {
    const [user, setUser] = useState({});
    const params = useParams();
    const isSidebar = useSelector(state => state.sidebar.isSidebarOpen);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user?username=${params.username}`);
                setUser(res.data);
            } catch (error) {
                toast.error(`${error}`, tostConfig);
            }
        };
        fetchUser();
    }, [params.username]);

    return (
        <div>
            <Topbar />
            <div className="container-fluid">
                <div className="row">
                    <div className='p-0' style={isSidebar ? { width: "270px" } : { display: "none" }}>
                        <HomeSidebar />
                    </div>
                    <div className="col p-0">
                        <ProfileInfo user={user} />

                        <div className="container-fluid">
                            <div className="row">
                                <div className="col p-0">
                                    <Feedback username={params.username} />
                                </div>
                                <div className="col-3 p-0">
                                    <ProfileRightbar user={user} />
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
