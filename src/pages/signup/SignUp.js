import React, { useRef, useState } from 'react'
import "./sign-up.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [passwordShown, setPasswordShown] = useState(false);
    const navigate = useNavigate();
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const confirm_password = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.current.value !== confirm_password.current.value) {
            confirm_password.current.setCustomValidity("password don't match!")
        } else {
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value,
                confirm_password: confirm_password.current.value,
            }
            console.log(user);
            try {
                await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, user);
                navigate('/login');
            } catch (err) {
                console.log(err);
            }
        }
    }
    return (
        <div className='sign-up'>
            <div className="container ">
                <div className="row vh-100">
                    <div className="col-md-6 flex-column d-flex justify-content-center align-items-center">
                        <img src="/assets/logo-light-bg-remove.PNG" className='w-50' alt="" />
                        <h4 className='mt-3 w-75 ms-auto'>Connect with friends and the world around you on SocialSpark.</h4>
                    </div>
                    <div className="col-md-6 flex-column d-flex justify-content-center ">
                        <form action="" className='bg-white p-5 rounded me-5' onSubmit={handleSubmit}>
                            <input type="text" className='w-100 p-2 fs-6 rounded border-1 my-2 ' placeholder='username' ref={username} required />
                            <input type="email" className='w-100 p-2 fs-6 rounded border-1 my-2 ' placeholder='Email' ref={email} required />
                            <input type="password" className='w-100 p-2 fs-6 rounded border-1 my-2 ' placeholder='Password' ref={password} required minLength={6} />
                            <div className='position-relative'>
                                <input type={passwordShown ? 'text' : 'password'} className='w-100 p-2 fs-6 rounded border-1 my-2 ' placeholder='Confirm password' ref={confirm_password} required minLength={6} />
                                <i className={`bi ${passwordShown ? 'bi-eye-slash-fill' : 'bi-eye-fill'} eye-icon`}
                                    onClick={() => setPasswordShown(!passwordShown)}
                                ></i>
                            </div>
                            <button type='submit' className='sign-up-btn mt-2'>SignUp</button>
                            <button type='button' className='create-ac-btn mt-3'>Login into Account</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp
