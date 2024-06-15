import React from 'react'
import "./profile-info.css"

const ProfileInfo = ({ user }) => {
    return (
        <div className='profile-info'>
            <img src={user.coverPicture ? user.coverPicture : "/assets/banner-3.PNG"} className='w-100 profile-banner' alt="profile banner" />
            <img className='user-images' src={user.profilePicture ? user.profilePicture : "/assets/default-user.jpg"} alt="user image" />
            <h3 className="text-center m-0">{user.username}</h3>
            <h6 className="text-center text-secondary">{user.desc}</h6>
        </div>
    )
}

export default ProfileInfo
