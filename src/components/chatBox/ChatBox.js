import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSender, isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../chatLogic';
import { Link } from "react-router-dom";
import UpdateGroupChatModal from '../update-group-chat-modal/UpdateGroupChatModal';
import axios from 'axios';
import { io } from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from '../../animation/animationData.json';
import { addNotification } from '../../context/chatSlice';
import { toast } from 'react-toastify';



const ENDPOINT = "http://localhost:4000";  // this is backend server
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
  const dispatch = useDispatch();

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
    toast.error(`${error}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: "light",
  });
      console.log(error);
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT);
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
        //give notification
        if (!notification.includes(newMessageReceived)) {
          dispatch(addNotification([newMessageReceived, ...notification]));
          // setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived])
      }
    })
  })

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessages) {
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
        setNewMessages("");
        socket.emit("new message", res.data);
        setMessages([...messages, res.data]);
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
    }
  }

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
  }

  return (
    <>
      {selectedChat ? (
        <div className='py-3 d-flex flex-column height-100 overflow-y-auto'>
          <div>
            {!selectedChat.isGroupChat ? (
              <div className='d-flex align-items-center justify-content-between pb-2'>
                <Link to={"/profile/" + selectedChat.users[1]?.username} className='d-flex align-items-center text-decoration-none text-dark'>
                  <img className='rounded-circle' style={{ width: "40px" }} src={selectedChat.users[1].profilePicture ? selectedChat.users[1].profilePicture : "/assets/default-user.jpg"} alt={selectedChat.chatName} />
                  <h5 className='m-0 ms-2'>{getSender(user, selectedChat.users)} </h5>
                </Link>
                <i className="bi bi-three-dots-vertical p-2 cursor-pointer"></i>
              </div>
            ) : (
              <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex align-items-center'>
                  <img style={{ width: "40px" }} className='rounded-circle' src={"/assets/default-users.png"} alt={selectedChat.chatName} />
                  <h5 className='m-0 ms-2'>{selectedChat.chatName}</h5>
                </div>
                <i className="bi bi-three-dots-vertical p-2 cursor-pointer" data-bs-toggle="modal" data-bs-target="#updateGroupChat"></i>
                <UpdateGroupChatModal fetchMessage={fetchMessage} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
              </div>
            )}
          </div>

          <div className='height-100 overflow-y-scroll d-flex flex-column justify-content-end'>
            {messages && messages.map((m, i) => (
              <div className='' key={m._id}>
                {(   
                  isSameSender(messages, m, i, user._id)
                  || isLastMessage(messages, i, user._id)) && (
                    <img src={m.sender.profilePicture ? m.sender.profilePicture : "/assets/default-user.jpg"} className='rounded-circle me-1' style={{ width: "30px" }} title={m.sender.username} alt={m.sender.username} />
                  )}
                <span className="py-1 px-3 rounded" style={{ backgroundColor: `${m.sender._id === user._id ? "#B9F5D0" : "#BEE3F8"}`, maxWidth: "75%", marginLeft: isSameSenderMargin(messages, m, i, user._id), marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10 }}> {m.content} </span>
              </div>
            ))}
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae consectetur animi iusto sed vero, quaerat quasi molestias fugit quas voluptate perspiciatis ducimus enim asperiores sapiente illo ipsa itaque ut nemo possimus? Sed reiciendis a enim quam corrupti nam maxime soluta expedita sapiente nobis quis laborum saepe fugiat tenetur, voluptate ea et consequuntur! Labore placeat quod error corrupti perspiciatis sit cumque impedit aut tempora aliquid aspernatur magni et maxime tempore corporis quia quaerat deleniti officiis praesentium, quis molestiae, explicabo laborum facere! Consequuntur necessitatibus doloremque illo neque quae quia doloribus! Tempora atque laudantium in accusamus labore debitis quas minus corporis deleniti est nam voluptas vitae laborum possimus tenetur, distinctio eaque provident animi dignissimos. Voluptas impedit doloremque tempora eligendi earum sint odio voluptatem ex consequuntur, nobis, similique corrupti voluptatum vitae nostrum facilis quia? Dolor quis ut alias harum possimus ipsa laboriosam vero temporibus, consequatur consectetur, id laudantium soluta, vel tempora praesentium ad laborum perferendis et tempore! Facilis, provident voluptate dolorum quos in sunt numquam aperiam nesciunt, soluta impedit odit corrupti officiis quia eos beatae accusantium molestiae earum quisquam quod. Harum excepturi repudiandae enim corporis quaerat quasi totam optio repellendus quam, distinctio eveniet delectus itaque magnam vero. Culpa suscipit velit asperiores facere qui repellat animi laboriosam est dolore tenetur possimus recusandae quod rem voluptatum ad autem a, at aperiam odio molestias similique! Dolorum porro fugit cum repellendus rerum libero totam consequatur nulla aliquid, quos unde repudiandae praesentium, beatae nisi provident adipisci nihil! Unde tenetur fugit, possimus ullam deleniti similique iure voluptatum aspernatur reprehenderit? Veniam, rerum dolorem! Itaque, dolorem in! Obcaecati nobis, minima ipsam nam debitis, qui iure veritatis illum delectus, repellat laboriosam magni. Veritatis, aspernatur! Perspiciatis sunt sint nemo consectetur reprehenderit harum, omnis autem asperiores soluta consequatur aliquam natus veniam nulla corrupti aspernatur id quasi et nobis necessitatibus provident quidem officia? Eos unde molestias corrupti mollitia rerum id, ullam alias, adipisci et culpa error ea cupiditate, ut nostrum praesentium reprehenderit quod tempore. Sed officiis laudantium recusandae iusto! Repellat quia eveniet et non, aliquid esse dolores soluta dignissimos reprehenderit ipsa quo tenetur facere molestiae temporibus quasi quod accusantium laborum at natus! Ipsam ut eum quis vero id ab velit doloremque mollitia blanditiis quos, expedita qui quam eveniet reprehenderit voluptate fugit nihil! Sit quibusdam perspiciatis vero similique enim optio at maiores error? Voluptatibus architecto praesentium perferendis placeat, saepe ipsum illum consectetur? Illo officiis velit hic dolorum aperiam quos, facere voluptas magnam consectetur numquam, odit aliquam iste ipsam quam, repellendus veritatis. Aperiam repudiandae non architecto a doloribus consequatur harum qui et fuga quos sapiente nisi in numquam perspiciatis, dolores maiores minus quod accusamus corrupti velit cumque eum eveniet voluptas. Impedit minus veniam eligendi doloribus, mollitia aliquam excepturi vel in accusamus dolor! Modi ab, quae cum excepturi omnis vel tempora maxime possimus animi eius voluptatem nostrum. Animi iste, similique mollitia dolorum natus tempore odit voluptas! Tempore eveniet quasi possimus! Maiores, optio, cupiditate asperiores voluptates architecto fugit minima necessitatibus, vel nesciunt error quisquam ipsa assumenda non. Voluptatem beatae laboriosam temporibus soluta quisquam quo magnam possimus nesciunt itaque commodi labore veniam repellendus enim quasi corrupti natus excepturi praesentium quam laudantium ipsam sit doloribus, molestiae cumque? Doloremque hic excepturi perspiciatis odio officiis? Velit quos eius mollitia corporis nostrum explicabo ab reiciendis autem non aut rem labore, accusantium et est recusandae dolorem, odio iure repudiandae consectetur. A voluptatum expedita nam nostrum? Est libero accusamus dicta. Nostrum molestiae minus magni debitis maxime, necessitatibus illo voluptas tempore, fugiat quidem aliquid, reprehenderit laudantium. Quia aliquid molestiae ratione ipsam natus magnam sapiente ut obcaecati rem ea saepe fuga, porro inventore cum nemo autem quidem temporibus in! Repellat eum quae quibusdam vitae consectetur eos, facilis illo nihil totam dolorem numquam mollitia, sit necessitatibus accusantium beatae ad nam eveniet sunt ducimus quo accusamus in amet saepe? Quasi, facilis. Reprehenderit, esse? Sunt quas dolorem reiciendis alias similique aliquid amet, debitis qui sit saepe distinctio aut praesentium obcaecati aspernatur illo, esse rem, at voluptatem tempora mollitia iusto non ipsum? Possimus blanditiis voluptates itaque? Ipsum at autem reiciendis molestias atque doloribus consequuntur assumenda maxime voluptatem magnam hic, aperiam quasi voluptatum praesentium eaque maiores iusto aliquid. Numquam saepe consequuntur nobis quo illo id at odit aliquam aspernatur, reprehenderit quae praesentium porro eos veniam temporibus sed nihil vel aperiam voluptatum! Expedita reiciendis facere nisi accusamus pariatur temporibus tempore. Voluptates accusantium fugit quisquam dolorem? Consequatur, eligendi nobis earum dolorum, consectetur rem, veritatis maxime maiores explicabo iure laudantium ut quibusdam dolores. Consequatur doloremque fugiat quasi repellat id, nemo minus vel nostrum repudiandae enim dolorum adipisci, mollitia autem ut iste nulla ab quisquam saepe, aut ipsa quos dolores dignissimos! Quam nulla enim iure repellendus ratione asperiores quae id reiciendis illo similique voluptates quibusdam ipsum, quia vel nobis temporibus doloremque laudantium quas quidem in earum natus recusandae delectus. Ipsum consequatur minima ex? Voluptate repellendus est exercitationem atque, esse voluptas quibusdam vitae distinctio fugit deleniti cumque provident, cupiditate unde assumenda dolorem, doloribus ducimus et. Suscipit nesciunt facilis qui ratione voluptatem obcaecati vitae. Unde nostrum rerum illo modi, velit quam necessitatibus obcaecati accusamus. Enim, error. Saepe delectus aliquam libero ipsam enim labore consectetur iste recusandae minus? Tempore molestias quaerat provident ipsa aspernatur quam incidunt. Quia eligendi atque eum cupiditate mollitia veniam aperiam. Quibusdam, enim totam! Perferendis debitis reiciendis quos dolor quae quaerat, nulla molestias velit minus, suscipit sed expedita asperiores ut similique molestiae alias accusamus, neque maxime deserunt! Atque doloribus earum reiciendis minus eveniet qui deleniti voluptatem aliquid vero quidem. Ea obcaecati minima consequatur reprehenderit. Officia, officiis minus? Ea quidem tenetur, molestiae sed similique ex dolore vitae quos harum assumenda consectetur. Unde commodi vel tempora consectetur blanditiis iure. Soluta, ullam consectetur ipsam unde commodi eius explicabo nobis officia vitae veniam optio maiores hic architecto aspernatur, dignissimos corrupti ratione. Ex maiores voluptate ipsum quasi quis corporis consequuntur recusandae eveniet aperiam accusantium? Delectus maxime fugit cumque dolor velit consectetur explicabo beatae quia, quibusdam quasi quo excepturi adipisci cum pariatur voluptatum sunt aut voluptates natus aliquid facilis vero totam esse? Accusamus quo vitae voluptas tempora rem fuga inventore dolores. Itaque vitae, reprehenderit facilis culpa laborum iste labore voluptatem libero blanditiis aliquam eos.
          </div>
          <form action="" onKeyDown={sendMessage} className='mt-auto pt-2'>
            {isTyping ? (
              <Lottie options={defaultOptions} className='m-0' width={50} height={30} />
            ) : ""}
            <input type="text" className='d-block py-1 px-2 w-100' onChange={(e) => typingHandler(e)} value={newMessages} placeholder='Write Messages' />
          </form>
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
