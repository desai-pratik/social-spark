import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSenderDetails, isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../chatLogic';
import { Link } from "react-router-dom";
import UpdateGroupChatModal from '../update-group-chat-modal/UpdateGroupChatModal';
import axios from 'axios';
import { io } from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from '../../animation/animationData.json';
import { toast } from 'react-toastify';
import { tostConfig } from '../../config/interface';
import EmojiPicker from 'emoji-picker-react';
import ReactMarkdown from 'react-markdown';
import { addNotification } from '../../context/chatSlice';

var socket, selectedChatCompare;

const ChatBox = ({ fetchAgain, setFetchAgain }) => {

  const selectedChat = useSelector(state => state.chat.selectedChat);
  const notification = useSelector(state => state.chat.notification);
  const user = useSelector(state => state.auth.user);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const senderDetails = selectedChat && getSenderDetails(user, selectedChat.users);
  const [selectedMessages, setSelectedMessages] = useState([]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const fetchMessage = async () => {
    if (!selectedChat) { return; }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/messages/${selectedChat?._id}`, config);
      setMessages(res.data);
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast.error(`${error}`, tostConfig);
    }
  };

  useEffect(() => {
    socket = io(process.env.REACT_APP_API_BASE_ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [user]);

  useEffect(() => {
    fetchMessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
      } else {
        setMessages([...messages, newMessageReceived])
      }
    })
  }, [notification, messages, selectedChatCompare]);

  useEffect(() => {
    socket.on('messages deleted', ({ messageIds }) => {
        setMessages(messages.filter(m => !messageIds.includes(m._id)));
    });
    return () => {
        socket.off('messages deleted');
    };
}, [messages]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessages) {
      clickSendMessage(event);
    }
  };

  const clickSendMessage = async (event) => {
    event.preventDefault();
    socket.emit("stop typing", selectedChat._id);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      };
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/messages`, {
        content: newMessages,
        chatId: selectedChat._id
      }, config);
      const responseData = res.data;
      socket.emit("new message", responseData);
      setMessages([...messages, responseData]);

      setNewMessages("");
      if (senderDetails._id === "66a5166a068fad5166a08218") {
        sendAiMessage();
      }
    } catch (error) {
      toast.error(`${error}`, tostConfig);
    }
  };

  const typingHandler = (e) => {
    setNewMessages(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const handleEmojiClick = (e) => {
    setNewMessages((prev) => prev + e.emoji);
    setOpenEmojiPicker(false);
  };

  const sendAiMessage = async () => {
    try {
      const google_response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${"AIzaSyC0WYGfxX5ebVXA2YefcnBsro5WbtTbzWg"}`,
        method: "post",
        data: { "contents": [{ "parts": [{ "text": newMessages }] }] }
      });
      // for ai google_response
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTUxNjZhMDY4ZmFkNTE2NmEwODIxOCIsImVtYWlsIjoic29jaWFsc3BhcmtAZ21haWwuY29tIiwiaWF0IjoxNzI5NTM0NTQxLCJleHAiOjE3MzIxMjY1NDF9.vvpEEPXVE4bAObxAnsOgD1bS3H3jaN_zIshOkud1a6Y`
        }
      };
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/messages`, {
        content: google_response?.data?.candidates[0]?.content?.parts[0]?.text,
        chatId: selectedChat._id
      }, config);
      setMessages([...messages, res.data]);
    } catch (error) {
      toast.error(`${error}`, tostConfig);
    }
  };

  const toggleMessageSelection = (messageId) => {
    if (selectedMessages.includes(messageId)) {
      setSelectedMessages(selectedMessages.filter(id => id !== messageId));
    } else {
      setSelectedMessages([...selectedMessages, messageId]);
    }
  };

  const deleteSelectedMessages = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      socket.emit('delete messages', { chatId: selectedChat._id, messageIds: selectedMessages });
      await Promise.all(selectedMessages.map(async (messageId) => {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/messages/${messageId}`, config);
      }));

      setMessages(messages.filter(m => !selectedMessages.includes(m._id)));


      setSelectedMessages([]);
      toast.success("Messages deleted successfully", tostConfig);
    } catch (error) {
      toast.error(`${error}`, tostConfig);
    }
  };

  return (
    <>
      {selectedChat ? (
        <div className='py-3 d-flex flex-column height-100'>
          <div>
            {!selectedChat.isGroupChat ? (
              <div className='d-flex align-items-center justify-content-between pb-2'>
                <Link to={"/profile/" + senderDetails.username} className='d-flex align-items-center text-decoration-none text-dark'>
                  <img className='rounded-circle' style={{ width: "40px", height: "40px" }} src={senderDetails.profilePicture || "/assets/default-user.jpg"} title={senderDetails.username} alt={senderDetails.username} />
                  <h5 className='m-0 ms-2 capitalize'>{senderDetails.username}</h5>
                </Link>
                <div>
                  {selectedMessages.length > 0 && (
                    <i class="bi bi-trash3-fill p-2 cursor-pointer" onClick={deleteSelectedMessages} ></i>
                  )}
                  <i className="bi bi-three-dots-vertical p-2 cursor-pointer"></i>
                </div>
              </div>
            ) : (
              <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex align-items-center'>
                  <img style={{ width: "40px", height: "40px" }} className='rounded-circle' src={"/assets/default-users.png"} title={selectedChat.chatName} alt={selectedChat.chatName} />
                  <h5 className='m-0 ms-2 capitalize'>{selectedChat.chatName}</h5>
                </div>
                {selectedMessages.length > 0 && (
                  <i class="bi bi-trash3-fill p-2 cursor-pointer" onClick={deleteSelectedMessages} ></i>
                )}
                <i className="bi bi-three-dots-vertical p-2 cursor-pointer" data-bs-toggle="modal" data-bs-target="#updateGroupChat"></i>
                <UpdateGroupChatModal fetchMessage={fetchMessage} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
              </div>
            )}
          </div>
          <div className='h-100 overflow-y-scroll'>
            {messages && messages.map((m, i) => (
              <div className={`d-flex align-items-end ${selectedMessages.includes(m._id) ? 'selected' : ''}`} key={m._id}>
                {(
                  isSameSender(messages, m, i, user._id)
                  || isLastMessage(messages, i, user._id)) && (
                    <img src={m.sender.profilePicture ? m.sender.profilePicture : "/assets/default-user.jpg"} className='rounded-circle me-1' style={{ width: "30px", height: "30px" }} title={m.sender.username} alt={m.sender.username} />
                  )}
                <pre
                  onClick={() => toggleMessageSelection(m._id)}
                  className={`py-1 px-2 mb-0 rounded d-inline-block`}
                  style={{ backgroundColor: `${m.sender._id === user._id ? "#B9F5D0" : "#BEE3F8"}`, maxWidth: "75%", marginLeft: isSameSenderMargin(messages, m, i, user._id), marginTop: isSameUser(messages, m, i, user._id) ? "3px" : "10px", textWrap: "wrap", cursor: "context-menu" }}>
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </pre>
              </div>
            ))}
          </div>
          <div className="pt-2">
            {isTyping && <Lottie options={defaultOptions} className='m-0' width={50} height={30} />}
            <EmojiPicker height={350} width={350} open={openEmojiPicker} onEmojiClick={handleEmojiClick} />
            <form action="" onKeyDown={sendMessage} className='d-flex align-items-center pt-2'>
              <i className="bi bi-emoji-smile fs-4 me-2 cursor-pointer" onClick={() => setOpenEmojiPicker(!openEmojiPicker)}></i>
              <input type="text" className='d-block py-1 px-3 w-100 rounded-pill border-1' onChange={(e) => typingHandler(e)} value={newMessages} placeholder='Write Messages' />
              <i className="bi bi-send cursor-pointer ms-1 border rounded-circle py-1 px-2" onClick={clickSendMessage}></i>
            </form>
          </div>
        </div>
      ) : (
        <div className='d-flex justify-content-center align-items-center height-100' >
          <h4 className='text-secondary'>Click on a user to start chatting.</h4>
        </div >
      )}
    </>
  )
}

export default ChatBox
