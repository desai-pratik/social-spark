import React from "react";
import "./profile-info.css";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { editUser } from "../../context/authSlice";
import { toast } from "react-toastify";
import { tostConfig } from "../../config/interface";


const ProfileInfo = ({ user }) => {

  // const [profilePicUrl, setProfilePicUrl] = useState(user.profilePicture);
  // const [coverPicUrl, setCoverPicUrl] = useState(user.coverPicture);

  const currentUser = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const handelUserChange = async (e) => {
    const user_img = e.target.files[0];
    try {
      let userImgURL = "";
      if (user_img) {
        const storageRef = ref(storage, user_img.name);
        await uploadBytes(storageRef, user_img);
        userImgURL = await getDownloadURL(storageRef);
      }
      const updateUserImage = {
        userId: user._id,
        profilePicture: userImgURL,
      };

      const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/user/${user._id}`, updateUserImage);
      dispatch(editUser(res.data));
      // setProfilePicUrl(userImgURL);

    } catch (error) {
      toast.error(`${error}`, tostConfig);
    }
  };

  const handelBGChange = async (e) => {
    const cover_img = e.target.files[0];
    try {
      let coverImgURL = "";
      if (cover_img) {
        const storageRef = ref(storage, cover_img.name);
        await uploadBytes(storageRef, cover_img);
        coverImgURL = await getDownloadURL(storageRef);
      };
      const updateCoverImg = {
        userId: user._id,
        coverPicture: coverImgURL,
      };
      const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/user/${user._id}`, updateCoverImg);
      dispatch(editUser(res.data));
      // setCoverPicUrl(coverImgURL);
    } catch (error) {
      toast.error(`${error}`, tostConfig);
      
    }
  };

  return (
    <div className="profile-info">
      <div className="position-relative">
        <img src={user.coverPicture ? user.coverPicture : "/assets/banner-3.PNG"} className="w-100 profile-banner" alt="profile banner" title="profile banner" />

        {currentUser._id === user._id && <label htmlFor="cover-file" className="position-absolute edit-background end-0 top-0 d-flex">
          <i className="bi bi-pencil-square me-2"></i> Edit Image
          <input type="file" id="cover-file" style={{ display: "none " }} accept=".png,.jpeg,.jpg," onChange={(e) => handelBGChange(e)} />
        </label>}
      </div>

      <div className="position-relative profile-user-info">
        <img className="user" src={user.profilePicture ? user.profilePicture : "/assets/default-user.jpg"} alt="user" title={user.username}/>

        {currentUser._id === user._id && <label htmlFor="user-file" className="data-type d-flex">
          <i className="bi bi-pencil-square edit-icon"></i>
          <input type="file" id="user-file" style={{ display: "none " }} accept=".png,.jpeg,.jpg," onChange={(e) => handelUserChange(e)} />
        </label>}
      </div>

      <h3 className="text-center m-0 capitalize">{user.username}</h3>
      <h6 className="text-center text-secondary">{user.desc}</h6>
    </div>
  );
};

export default ProfileInfo;
