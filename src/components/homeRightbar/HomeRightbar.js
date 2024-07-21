import "./homeRightbar.css";

const HomeRightbar = () => {
    return (
        <div className='rigthbar pt-3 pe-3 position-sticky overflow-y-auto'>
            <h5 className='fw-normal'><b>polo Foster </b> and <b>3 other friends </b>have a birthday today.</h5>
            <div className="banner mb-4">
                <img src="/assets/banner.png" className='w-100 rounded-4' alt="Event" title="Event"/>
            </div>
            <div className="online-friends">
                <h6 className='mb-3'>Online Friends</h6>
                <div className="friend my-3 d-flex align-items-center gap-3">
                    <div className="position-relative d-inline-block">
                        <img className='rounded-circle' style={{ width: "40px" }} src="/assets/default-user.jpg" alt="online user" title="online user" />
                        <span className="position-absolute end-25 top-25 translate-middle p-2 bg-success border border-light rounded-circle">
                        </span>
                    </div>
                    <h6>john monsj</h6>
                </div>
                <div className="friend my-3 d-flex align-items-center gap-3">
                    <div className="position-relative d-inline-block">
                        <img className='rounded-circle' style={{ width: "40px" }} src="/assets/default-user.jpg" alt="online user" title="online user"/>
                        <span className="position-absolute start-25 top-25 translate-middle p-2 bg-success border border-light rounded-circle">
                        </span>
                    </div>
                    <h6>john monsj</h6>
                </div>
            </div>
        </div>
    )
}

export default HomeRightbar