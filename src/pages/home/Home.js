import React from 'react'
import Topbar from '../../components/topbar/Topbar'
import Feedback from '../../components/feedback/Feedback'
// import Rightbar from '../../components/rightbar/Rightbar'
import { useSelector } from 'react-redux'
import HomeSidebar from '../../components/home-sidebar/HomeSidebar'
import HomeRightbar from '../../components/homeRightbar/HomeRightbar'

const Home = () => {
    const isSidebar = useSelector(state => state.sidebar.isSidebarOpen);
    return (
        <div>
            <Topbar />
            <div className="container-fluid">
                <div className="row">
                    <div className='p-0' style={isSidebar ? { width: "270px" } : {display:"none"}}>
                        <HomeSidebar />
                    </div>
                    <div className="col p-0">
                        <Feedback />
                    </div>
                    <div className="col-3 p-0">
                        <HomeRightbar />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
