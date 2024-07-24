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


const ViewPost = ({ post , onDeletePost }) => {
  const [postUser, setPostUser] = useState({});
  const [like, setLike] = useState(post.likes.length);
  const user = useSelector(state => state.auth.user);
  const toastRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);
  const [postReaction, setPostReaction] = useState();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => {
                  setIsPlaying(true);
                })
                .catch((error) => {
                  toast.error(`${error}`, tostConfig);
                });
            }
          } else {
            if (videoRef.current && isPlaying) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      {
        threshold: 0.5
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [isPlaying]);

  const hendallike = async (id) => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}/like`, {
        userId: user._id,
      });
      if (res.data === "The post has been liked.") {
        setLike(like + 1);
        setPostReaction("❤️");
      } else if (res.data === "The post has been disliked.") {
        setLike(like - 1);
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
      onDeletePost(postId);
      const toast = new window.bootstrap.Toast(toastRef.current, {
        autohide: false
      });
      toast.hide();

    } catch (error) {
      toast.error(`${error.response.data}`, tostConfig);
    }
  };

  const handleReaction = async (emojiObject, postId) => {
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
              <img src={postUser.profilePicture ? postUser.profilePicture : "/assets/default-user.jpg"} className="object-fit-cover" alt={postUser.username} title={postUser.username} />
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
          <div className="post-img position-relative">
            {post.img.includes('.mp4') ? (
              <video ref={videoRef} controls muted className="img-fluid post-img d-flex mx-auto">
                <source src={post.img} type="video/mp4" />
              </video>
            ) : (
              <img src={post.img} className="img-fluid post-img d-flex mx-auto" onDoubleClick={() => hendallike(post._id)} alt="post" title="post"/>
            )}
            <span className="fs-1 position-absolute top-50 start-50 translate-middle">{postReaction}</span>
          </div>
        )}
        <div className="post-review d-flex justify-content-between align-items-center mt-2">
          <div className="d-flex align-items-center gap-2">
            <span className="cursor-pointer d-flex" onClick={() => setShowPicker(!showPicker)}>
              <i className="bi bi-heart-fill text-danger fs-5"></i>
            </span>
            {showPicker && (
              <div>
                <Picker reactionsDefaultOpen={true} onEmojiClick={(e) => handleReaction(e, post._id)} />
              </div>
            )}
            {postReaction && (<span>{postReaction}</span>)}
            <span className="p-0 text-secondary badge">{like} likes</span>
          </div>
          <span className="p-0 text-secondary badge">9 Comments</span>
        </div>
      </div>
    </>
  );
};

export default ViewPost;
