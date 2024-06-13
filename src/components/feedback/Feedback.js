import React, { useEffect, useState } from 'react'
import SharePost from '../share-post/SharePost'
import ViewPost from '../view-post/ViewPost'
import axios from 'axios';

const Feedback = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await axios.get('https://socialspark-backend.onrender.com/api/posts/timeline/66672589f60af1fd3c48a32b');
            // console.log(res);
            setPosts(res.data);
        }
        fetchPosts();
    }, []);

    return (
        <div className='feedback p-3'>
            <SharePost />
            {posts.map((post) => <ViewPost key={post._id} post={post} /> )}
        </div>
    )
}

export default Feedback