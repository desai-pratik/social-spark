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
import { useSelector } from 'react-redux';
import Chat from './pages/chat/Chat';
import Setting from './pages/setting/Setting';
function App() {
  const user = useSelector(state => state.auth.user);

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
