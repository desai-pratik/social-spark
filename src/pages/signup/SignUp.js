import React from 'react'
import "./sign-up.css"

const SignUp = () => {
    return (
        <div className='sign-up'>
            <div className="container ">
                <div className="row vh-100">
                    <div className="col-md-6 flex-column d-flex justify-content-center align-items-center">
                        <img src="/assets/logo-light-bg-remove.PNG" className='w-50' alt="" />
                        <h4 className='mt-3 w-75 ms-auto'>Connect with friends and the world around you on SocialSpark.</h4>
                    </div>
                    <div className="col-md-6 flex-column d-flex justify-content-center ">
                        <form action="" className='bg-white p-5 rounded me-5'>
                            <input type="text" className='w-100 p-2 fs-6 rounded border-1 my-2 ' placeholder='username' />
                            <input type="email" className='w-100 p-2 fs-6 rounded border-1 my-2 ' placeholder='Email' />
                            <input type="password" className='w-100 p-2 fs-6 rounded border-1 my-2 ' placeholder='Password' />
                            <input type="password" className='w-100 p-2 fs-6 rounded border-1 my-2 ' placeholder='Confirm password' />
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
