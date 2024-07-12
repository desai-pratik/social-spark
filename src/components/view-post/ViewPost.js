import React, { useEffect, useRef, useState } from "react";
import "./viewPost.css";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { tostConfig } from "../../config/interface";
import { Button } from "@mui/material";
import Picker from 'emoji-picker-react';


const ViewPost = ({ post }) => {
  const [postUser, setPostUser] = useState({});
  const [like, setLike] = useState(post.likes.length);
  const [islike, setIslike] = useState(false);
  const user = useSelector(state => state.auth.user);
  const toastRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);
  const [postReaction, setPostReaction] = useState();

  useEffect(() => {
    setIslike(post.likes.includes(user._id))
  }, [post.likes, user._id]);

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user?userId=${post.userId}`);
        setPostUser(res.data);
      };
      fetchPosts();
    } catch (error) {
      toast.error(`${error}`, tostConfig);
    }
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
        setPostReaction("❤️");
      } else if (res.data === "The post has been disliked.") {
        console.log("post is dislike");
        setLike(like - 1);
        setIslike(false);
        setPostReaction("❤️");
      }
      setTimeout(() => {
        setPostReaction('');
      }, 2000);
    } catch (error) {
      toast.error(`${error}`, tostConfig);
    }
  };

  const showToast = () => {
    if (toastRef.current) {
      const toast = new window.bootstrap.Toast(toastRef.current, {
        autohide: false
      });
      toast.show();
    }
  };

  const deletePost = async (postId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      };
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/posts/${postId}`, config);
      const toast = new window.bootstrap.Toast(toastRef.current, {
        autohide: false
      });
      toast.hide();

    } catch (error) {
      toast.error(`${error.response.data}`, tostConfig);
    }
  }

  const handleReaction = async (emojiObject, postId) => {
    console.log(emojiObject);
    setPostReaction(emojiObject.emoji)
    setShowPicker(false);

    setTimeout(() => {
      setPostReaction('');
    }, 2000);

    if (emojiObject.unified === "2764-fe0f" || emojiObject.unified === "1f44d") {
      hendallike(postId);
    }
  };


  return (
    <>
      <div className="p-3 my-3 shadow-sm border border-light-subtle">
        <div className="post-header d-flex justify-content-between">
          <div className="user-img d-flex align-items-center gap-2 me-2">
            <Link className="navbar-brand" to={"/profile/" + postUser.username}>
              <img src={postUser.profilePicture ? postUser.profilePicture : "/assets/default-user.jpg"} alt={postUser.username} className="object-fit-cover" />
            </Link>
            <Link className="navbar-brand" to={"/profile/" + postUser.username}>
              <h5 className="m-0 capitalize">{postUser.username}</h5>
            </Link>
            <span className="p-0 text-secondary badge">{format(post.createdAt)}</span>
          </div>
          <div>
            <i className="bi bi-three-dots-vertical cursor-pointer" onClick={showToast}></i>
            <div className="toast-container bg-white" style={{ width: "200px" }}>
              <div id={`liveToast-${post._id}`} className="toast" role="alert" aria-live="assertive" aria-atomic="true" ref={toastRef}>
                <div className="toast-header">
                  <strong className="me-auto capitalize">{postUser.username}</strong>
                  <small>{format(post.createdAt)}</small>
                  <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div className="toast-body">
                  {user._id === postUser._id && <Button variant="outlined" className="w-100 my-1" onClick={() => deletePost(post._id)} >Delete Post</Button>}
                  <Button variant="outlined" className="w-100 my-1">Post Info</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="post-sms my-3">
          <p>{post.desc}</p>
        </div>
        {post.img && (
          <div className="post-img position-relative" onDoubleClick={() => hendallike(post._id)}>
          <img className="img-fluid post-img d-flex mx-auto" src={post.img} alt="post images" />
          <span className="fs-1 position-absolute bottom-50 end-50">{postReaction}</span>
        </div>
        )}
        <div className="post-review d-flex justify-content-between align-items-center mt-2">
          <div className="d-flex align-items-center gap-2">
            {/* {islike ? (
              <i className="bi bi-heart-fill text-danger m-1" onClick={() => hendallike(post._id)}></i>
            ) : (
              <i className="bi bi-heart-fill hart" onClick={() => hendallike(post._id)}></i>
            )} */}

            <span className="cursor-pointer d-flex" onClick={() => setShowPicker(!showPicker)}>
              <i className="bi bi-heart-fill text-danger fs-5" style={{ width: "8px" }}></i>
              <i className="bi bi-hand-thumbs-up-fill text-warning fs-5" style={{ width: "15px" }}></i>
            </span>

            {showPicker && (
              <div>
                <Picker reactionsDefaultOpen={true} onEmojiClick={(e) => handleReaction(e, post._id)} />
              </div>
            )}

            {postReaction && (<span>{postReaction}</span>)}
            <span className="p-0 text-secondary badge">{like} people like it</span>
          </div>
          <span className="p-0 text-secondary badge">9 Comments</span>
        </div>
      </div>
    </>
  );
};

export default ViewPost;
