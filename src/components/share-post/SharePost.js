import React from 'react'
import "./sharePost.css"

const SharePost = () => {
    return (
        <div className='p-3 shadow-sm rounded border-1'>
            <div className="d-flex">
                <div className="user-img me-2">
                    <img className='' src="data:image/jpeg;base64,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" alt="user image" />
                </div>
                <input type="text" placeholder="what's in your mind ??" className='border-0 post-text w-100' />
            </div>
            <hr />
            <div className="d-flex justify-content-between">
                <div className='d-flex gap-3'>
                    <div className="data-type d-flex">
                        <i className="me-1 bi bi-image" style={{color:'red'}}></i>
                        Photo or Video
                    </div>
                    <div className="data-type d-flex">
                        <i className="me-1 bi bi-bookmark-fill" style={{color:'blue'}}></i>
                        tag
                    </div>
                    <div className="data-type d-flex">
                        <i className="me-1 bi bi-geo-alt-fill" style={{color:'green'}}></i>
                        Location
                    </div>
                    <div className="data-type d-flex">
                        <i className="me-1 bi bi-emoji-dizzy-fill" style={{color:'#ffa600'}}></i>
                        Feelings
                    </div>
                </div>
                <button className="custome-btn">Share</button>
            </div>
        </div>
    )
}

export default SharePost
