import React, { useContext, useEffect, useState } from "react";
import "./viewPost.css";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ViewPost = ({ post }) => {
  const [postUser, setPostUser] = useState({});
  const [like, setLike] = useState(post.likes.length);
  const [islike, setIslike] = useState(false);
  const { user } = useContext(AuthContext);


  useEffect(() => {
    setIslike(post.likes.includes(user._id))
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user?userId=${post.userId}`);
      setPostUser(res.data);
    };
    fetchPosts();
  }, []);

  const hendallike = async (id) => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}/like`, {
        userId: user._id,
      });
      if (res.data === "The post has been liked.") {
        console.log("post is like");
        setLike(like + 1);
        setIslike(true);
      } else if(res.data === "The post has been disliked.") {
        console.log("post is dislike");
        setLike(like - 1);
        setIslike(false);
      }
    } catch (err) {
      console.error("Error liking the post:", err);
    }
  };

  return (
    <>
      <div className="p-3 my-3 shadow-sm border-1">
        <div className="post-header d-flex justify-content-between">
          <div className="user-img d-flex align-items-center gap-2 me-2">
            <Link className="navbar-brand" to={"profile/" + postUser.username}>
              <img src={postUser.profilePicture ? postUser.profilePicture : "/assets/default-user.jpg"} alt="user image" />
            </Link>
            <Link className="navbar-brand" to={"profile/" + postUser.username}>
              <h5 className="m-0">{postUser.username}</h5>
            </Link>
            <span className="p-0 text-secondary badge">{format(post.createdAt)}</span>
          </div>
          <span>
            <i className="bi bi-three-dots-vertical"></i>
          </span>
        </div>
        <div className="post-sms my-3">
          <p>{post.desc}</p>
        </div>
        <div className="post-img">
          <img className="img-fluid post-img d-flex mx-auto" src={post.img} alt="post images" />
        </div>
        <div className="post-review d-flex justify-content-between align-items-center mt-2">
          <div>
            {/* <i className="bi bi-hand-thumbs-up-fill" ></i> */}
            {/* <i className="bi bi-hand-thumbs-down-fill"></i> */}
            {islike ? (
              <i className="bi bi-heart-fill text-danger m-1" onClick={() => hendallike(post._id)}></i>
            ) : (
              <i className="bi bi-heart-fill hart" onClick={() => hendallike(post._id)}></i>
            )}
            <span className="p-0 text-secondary badge">{like} people like it</span>
          </div>
          <span className="p-0 text-secondary badge">9 Comments</span>
        </div>
      </div>
    </>
  );
};

export default ViewPost;
