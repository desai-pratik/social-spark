import React, { useState } from 'react';
import "./login.css";
import { Link } from 'react-router-dom';
import { auth, provider, signInWithPopup } from '../../firebase';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../../context/authSlice';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { tostConfig } from '../../config/interface';
import { LoadingButton } from '@mui/lab';


const Login = () => {
    const [passwordShown, setPasswordShown] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const validationSchema = yup.object({
        email: yup.string().email('Invalid email address').required('Email is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required')
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, values);
                dispatch(addUser(res.data));
                setLoading(false);
            } catch (error) {
                toast.error(`${error}`, tostConfig);
                setLoading(false);
            }
        }
    });

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const newUser = {
                email: user.email,
                password: user.uid,
            };
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, newUser);
            dispatch(addUser(res.data));
            setLoading(false);
        } catch (error) {
            toast.error(`${error}`, tostConfig);
            setLoading(false);
        }
    };

    return (
        <div className='login'>
            <div className="container ">
                <div className="row vh-100">
                    <div className="col-md-6 flex-column d-flex justify-content-center align-items-center">
                        <img src="/assets/logo-light-bg-remove.PNG" className='w-50' alt="logo" title='SocialSpark' />
                        <h4 className='mt-3 w-75 ms-auto'>Connect with friends and the world around you on SocialSpark.</h4>
                    </div>
                    <div className="col-md-6 flex-column d-flex justify-content-center ">
                        <form action="" className='bg-white p-5 rounded me-5' onSubmit={formik.handleSubmit}>
                            {/* <input type="email" className='w-100 p-2 fs-6 rounded border-1 my-2 ' placeholder='Email' ref={email} required /> */}
                            <input
                                type="email"
                                className={`w-100 p-2 fs-6 my-2 rounded border-1 ${formik.touched.email && formik.errors.email ? 'is-invalid ' : ''}`}
                                placeholder='Email'
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="invalid-feedback">{formik.errors.email}</div>
                            ) : null}

                            <div className='position-relative'>
                                {/* <input type={passwordShown ? 'text' : 'password'} className='w-100 p-2 fs-6 rounded border-1 my-3 ' placeholder='Password' ref={password} required minLength={6} /> */}
                                <input
                                    type={passwordShown ? 'text' : 'password'}
                                    className={`w-100 p-2 fs-6 my-2 rounded border-1 ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                                    placeholder='Password'
                                    {...formik.getFieldProps('password')}
                                />
                                <i className={`bi ${passwordShown ? 'bi-eye-slash-fill' : 'bi-eye-fill'} eye-icon`}
                                    onClick={() => setPasswordShown(!passwordShown)}
                                ></i>
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                <div className="invalid-feedback">{formik.errors.password}</div>
                            ) : null}

                            {/* <button type='submit' className='login-btn mt-3'>{loading ? 'Loading...' : 'Log In'}</button> */}

                            <LoadingButton type='submit' variant="contained" className='login-btn mt-3' loading={loading}>
                                <span>Login</span>
                            </LoadingButton>

                            <button type='button' className='google-login mt-2' onClick={handleGoogleSignIn}>
                                <img src="/assets/google-logo.png" className='me-2' width={"30px"} alt="google" title="Google"/> {loading ? 'Loading...' : ' LogIn with Google'}
                            </button>
                            <span className='text-center d-block mx-auto my-3'>Forgot Password?</span>
                            <Link to="/sign-up" type='button' className='create-ac-btn'>Create a New Account</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
