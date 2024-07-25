import './App.css';
import Home from './pages/home/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Profile from './pages/profile/Profile';
import Login from './pages/login/Login';
import SignUp from './pages/signup/SignUp';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Chat from './pages/chat/Chat';
import Setting from './pages/setting/Setting';
import { useEffect } from 'react';
import { addNotification } from './context/chatSlice';
import { io } from 'socket.io-client';

const ENDPOINT = "https://socialspark-backend.onrender.com";  // this is backend server
let socket;
function App() {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.chat.notification);

  useEffect(() => {
    if (user) {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => console.log("Socket connected"));

      socket.on("message received", (newMessageReceived) => {
        // Dispatch notification if not already in store
        if (!notifications.some(n => n._id === newMessageReceived._id)) {
          dispatch(addNotification([newMessageReceived, ...notifications]));
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user, dispatch, notifications]);


  return (
    <Router>
      <Routes>
        <Route path="/" exact element={user !== null ? <Home /> : <SignUp />} />
        <Route path="/videos" exact element={user !== null ? <Home /> : <SignUp />} />
        <Route path="/profile/:username" exact element={<Profile />} />
        <Route path="/login" element={user !== null ? <Navigate to="/" /> : <Login />} />
        <Route path="/sign-up" element={user !== null ? <Navigate to="/" /> : <SignUp />} />
        <Route path="/chats" exact element={user !== null ? <Chat /> : <SignUp />} />
        <Route path="/groupchat" exact element={user !== null ? <Chat /> : <SignUp />} />
        <Route path="/setting" exact element={user !== null ? <Setting /> : <SignUp />} />
      </Routes>
    </Router>

  );
}

export default App;
