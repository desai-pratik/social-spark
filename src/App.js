import './App.css';
import Home from './pages/home/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './pages/profile/Profile';
import Login from './pages/login/Login';
import SignUp from './pages/signup/SignUp';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';

function App() {

  const { user } = useContext(AuthContext)

  return (
    <Router>
      <Routes>
      <Route path="/" element={user ? <Home /> : <SignUp />} />
        <Route path="/profile/:username" exact element={<Profile />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/sign-up" element={user ? <Navigate to="/" /> : <SignUp />} />
      </Routes>
    </Router>

  );
}

export default App;
