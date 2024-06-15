import React, { useContext, useRef, useState } from "react";
import "./sharePost.css";
import { AuthContext } from "../../context/AuthContext";

const SharePost = () => {

  const { user } = useContext(AuthContext);
  const desc = useRef();
  const [file, setFile] = useState(null);



  return (
    <form className="p-3 shadow-sm rounded border-1">
      <div className="d-flex">
        <div className="user-img me-2">
          <img src={user.profilePicture ? user.profilePicture : "/assets/default-user.jpg"} alt="user image" />
        </div>
        <input type="text" placeholder={"what's in your mind ??" + user.username} ref={desc} className="border-0 post-text w-100" />
      </div>
      <hr />
      <div className="d-flex justify-content-between">
        <div className="d-flex gap-3">
          <lable htmlFor="file" className="data-type d-flex">
            <i className="me-1 bi bi-image" style={{ color: "red" }}></i>
            Photo or Video
            <input type="file" id="file" style={{ display: "none " }} accept=".png,.jpeg,.jpg," onChange={(e) => setFile(e.target.files[0])} />
          </lable>
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
        <button className="custome-btn" type="submit">Share</button>
      </div>
    </form>
  );
};

export default SharePost;
