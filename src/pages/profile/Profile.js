import React from 'react'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feedback from '../../components/feedback/Feedback'
import Rightbar from '../../components/rightbar/Rightbar'
import "./profile.css"
import ProfileInfo from '../../components/profile-info/ProfileInfo'

const Profile = () => {
    return (
        <div>
            <Topbar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-2 p-0">
                        <Sidebar />
                    </div>
                    <div className="col p-0">
                        <ProfileInfo />
                        <div className="container-fluid">
                        <div className="row">
                            <div className="col p-0">
                                <Feedback />
                            </div>
                            <div className="col-3 p-0">
                                <Rightbar profile />
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
