import React, { useContext, useEffect, useState } from 'react'
import SharePost from '../share-post/SharePost'
import ViewPost from '../view-post/ViewPost'
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Feedback = ({ username }) => {
    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = username ? await axios.get(`https://socialspark-backend.onrender.com/api/posts/profile/${username}`) : await axios.get(`https://socialspark-backend.onrender.com/api/posts/timeline/${user._id}`);
            setPosts(res.data);
            }
            fetchPosts();
        }, []);

    return (
        <div className='feedback p-3'>
            <SharePost />
            {posts.map((post) => <ViewPost key={post._id} post={post} />)}
        </div>
    )
}

export default Feedback