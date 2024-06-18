import React, { useContext, useRef, useState } from 'react'
import "./login.css"
// import { loginCall } from '../../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import { loginCall } from '../../apiCalls';

const Login = () => {
    const [passwordShown, setPasswordShown] = useState(false);
    const email = useRef();
    const password = useRef();
    const { user, isFetching, error, dispatch } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        loginCall({ email: email.current.value, password: password.current.value }, dispatch);
        console.log();
    }
    console.log(user);
    return (
        <div className='login'>
            <div className="container ">
                <div className="row vh-100">
                    <div className="col-md-6 flex-column d-flex justify-content-center align-items-center">
                        <img src="/assets/logo-light-bg-remove.PNG" className='w-50' alt="logo" />
                        <h4 className='mt-3 w-75 ms-auto'>Connect with friends and the world around you on SocialSpark.</h4>
                    </div>
                    <div className="col-md-6 flex-column d-flex justify-content-center ">
                        <form action="" className='bg-white p-5 rounded me-5' onSubmit={handleSubmit}>
                            <input type="email" className='w-100 p-2 fs-6 rounded border-1 my-2 ' placeholder='Email' ref={email} required />
                            <div className='position-relative'>
                                <input type={passwordShown ? 'text' : 'password'} className='w-100 p-2 fs-6 rounded border-1 my-3 ' placeholder='Password' ref={password} required minLength={6} />
                                <i className={`bi ${passwordShown ? 'bi-eye-slash-fill' : 'bi-eye-fill'} eye-icon`}
                                    onClick={() => setPasswordShown(!passwordShown)}
                                ></i>
                            </div>
                            <button type='submit' className='login-btn mt-2'>{isFetching ? "Loading...":"Login"}</button>
                            <span className='text-center d-block mx-auto my-3'>Forgot Password?</span>
                            <button type='button' className='create-ac-btn'>Create a New Account</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
