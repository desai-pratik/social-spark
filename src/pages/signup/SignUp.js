import React, { useState } from "react";
import "./sign-up.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../../firebase";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from "react-toastify";
import { tostConfig } from "../../config/interface";
import { LoadingButton } from "@mui/lab";


const SignUp = () => {
    const [passwordShown, setPasswordShown] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const validationSchema = yup.object({
        username: yup.string().min(3, 'Username must be at least 3 characters long').required('Username is required'),
        email: yup.string().email('Invalid email address').required('Email is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
        confirm_password: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required')
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirm_password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, values);
                navigate("/login");
                setLoading(false);
            } catch (error) {
                toast.error(`${error}`, tostConfig);
            }
        }
    });

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const newUser = {
                username: user.displayName,
                email: user.email,
                password: user.uid,
                confirm_password: user.uid,
            };
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, newUser);
            navigate("/login");
            setLoading(false);
        } catch (error) {
            toast.error(`${error}`, tostConfig);
        }
    };

    return (
        <div className="sign-up">
            <div className="container ">
                <div className="row vh-100">
                    <div className="col-md-6 flex-column d-flex justify-content-center align-items-center">
                        <img src="/assets/logo-light-bg-remove.PNG" className="w-50" alt="logo" title="SocialSpark" />
                        <h4 className="mt-3 w-75 ms-auto">Connect with friends and the world around you on SocialSpark.</h4>
                    </div>
                    <div className="col-md-6 flex-column d-flex justify-content-center ">
                        <form action="" className="bg-white p-5 rounded me-5" onSubmit={formik.handleSubmit}>
                            <input
                                type="text"
                                className={`w-100 p-2 fs-6 rounded border-1 my-2 ${formik.touched.username && formik.errors.username ? 'is-invalid' : ''}`}
                                placeholder="Username"
                                {...formik.getFieldProps('username')}
                            />
                            {formik.touched.username && formik.errors.username ? (
                                <div className="invalid-feedback">{formik.errors.username}</div>
                            ) : null}
                            <input
                                type="email"
                                className={`w-100 p-2 fs-6 rounded border-1 my-2 ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                placeholder="Email"
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="invalid-feedback">{formik.errors.email}</div>
                            ) : null}
                            <input
                                type="password"
                                className={`w-100 p-2 fs-6 rounded border-1 my-2 ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                                placeholder="Password"
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div className="invalid-feedback">{formik.errors.password}</div>
                            ) : null}
                            <div className="position-relative">
                                <input
                                    type={passwordShown ? "text" : "password"}
                                    className={`w-100 p-2 fs-6 rounded border-1 my-2 ${formik.touched.confirm_password && formik.errors.confirm_password ? 'is-invalid' : ''}`}
                                    placeholder="Confirm Password"
                                    {...formik.getFieldProps('confirm_password')}
                                />
                                <i
                                    className={`bi ${passwordShown ? "bi-eye-slash-fill" : "bi-eye-fill"} eye-icon`}
                                    onClick={() => setPasswordShown(!passwordShown)}
                                ></i>
                            </div>
                            {formik.touched.confirm_password && formik.errors.confirm_password ? (
                                <div className="invalid-feedback">{formik.errors.confirm_password}</div>
                            ) : null}
                            <LoadingButton type='submit' variant="contained" className='sign-up-btn mt-3' loading={loading}>
                                <span>SignUp</span>
                            </LoadingButton>
                            <button type="button" className="google-login mt-3" onClick={handleGoogleSignIn}>
                                <img src="/assets/google-logo.png" className='me-2' width={"30px"} alt="google" title="Google" />{loading ? 'Loading...' : 'SignUp with Google'}
                            </button>
                            <Link to="/login" type="button" className="create-ac-btn mt-3">
                                Login into Account
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
