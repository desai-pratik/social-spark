import React, { useRef, useState } from "react";
import "./sharePost.css";
import axios from "axios";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";


const SharePost = () => {
  const user = useSelector(state => state.auth.user);
  const desc = useRef();
  const [file, setFile] = useState(null);

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      let downloadURL = "";
      if (file) {
        const storageRef = ref(storage, file.name);
        await uploadBytes(storageRef, file);
        downloadURL = await getDownloadURL(storageRef);
      }

      const newPost = {
        userId: user._id,
        desc: desc.current.value,
        img: downloadURL,
      };

      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/posts`, newPost);

      desc.current.value = "";
      setFile(null);
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

  return (
    <form className="p-3 shadow-sm rounded border border-light-subtle" onSubmit={handelSubmit}>
      <div className="d-flex">
        <div className="user-img me-2">
          <img src={user.profilePicture ? user.profilePicture : "/assets/default-user.jpg"} className="object-fit-cover" alt={user.username} />
        </div>
        <input type="text" placeholder={"what's in your mind " + user.username + "?"} ref={desc} className="border-0 post-text w-100" />
      </div>
      <hr />
      {file && (
        <div className="shareImgContainer position-relative my-3">
          <img src={URL.createObjectURL(file)} className="img-fluid post-img d-flex mx-auto" alt="posted image" />
          <i
            className="bi bi-x-circle position-absolute top-0 end-0 fs-3 cursor-pointer p-2 bg-secondary text-white"
            onClick={() => setFile(null)}
          ></i>
        </div>
      )}
      <div className="d-flex justify-content-between">
        <div className="d-flex gap-3">
          <label htmlFor="file" className="data-type d-flex">
            <i className="me-1 bi bi-image" style={{ color: "red" }}></i>
            {file?.name ? file?.name : " Photo or Video"}
            <input type="file" id="file" style={{ display: "none " }} accept=".png,.jpeg,.jpg," onChange={(e) => setFile(e.target.files[0])} />
          </label>
          <div className="data-type d-flex">
            <i className="me-1 bi bi-bookmark-fill" style={{ color: "blue" }}></i>
            tag
          </div>
          <div className="data-type d-flex">
            <i className="me-1 bi bi-geo-alt-fill" style={{ color: "green" }}></i>
            Location
          </div>
          <div className="data-type d-flex">
            <i className="me-1 bi bi-emoji-dizzy-fill" style={{ color: "#ffa600" }}></i>
            Feelings
          </div>
        </div>
        <button className="custome-btn" type="submit">
          Share
        </button>
      </div>
    </form>
  );
};

export default SharePost;
