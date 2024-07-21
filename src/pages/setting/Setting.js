import React, { useState } from 'react'
import Topbar from '../../components/topbar/Topbar'
// import Sidebar from '../../components/sidebar/Sidebar'
import { useDispatch, useSelector } from 'react-redux';
// import Rightbar from '../../components/rightbar/Rightbar'
import { LoadingButton } from '@mui/lab';
import { removeUser } from '../../context/authSlice';
import { toast } from 'react-toastify';
import { tostConfig } from '../../config/interface';
import { Logout } from '@mui/icons-material';
import HomeSidebar from '../../components/home-sidebar/HomeSidebar';
import HomeRightbar from '../../components/homeRightbar/HomeRightbar';


const Setting = () => {
    const isSidebar = useSelector(state => state.sidebar.isSidebarOpen);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();


    const handelLogout = () => {
        try {
            localStorage.removeItem("user");
            dispatch(removeUser());
        } catch (error) {
            toast.error(`${error}`, tostConfig);
        }
    }

    return (
        <div>
            <Topbar />
            <div className="container-fluid">
                <div className="row">
                    <div className='p-0' style={isSidebar ? { width: "270px" } : { display: "none" }}>
                        <HomeSidebar />
                    </div>
                    <div className="col p-2">
                        <h5>Setting</h5>

                        <LoadingButton variant="contained" endIcon={<Logout />} onClick={handelLogout} className='' loading={loading}>
                            <span>Logout</span>
                        </LoadingButton>

                    </div>
                    <div className="col-3 p-0">
                        <HomeRightbar />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Setting
