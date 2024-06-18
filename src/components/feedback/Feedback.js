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
            const res = username ? await axios.get(`${process.env.REACT_APP_API_BASE_URL}/posts/profile/${username}`) : await axios.get(`${process.env.REACT_APP_API_BASE_URL}/posts/timeline/${user._id}`);
            setPosts(res.data.sort((p1, p2) => {
                return new Date(p2.createdAt) - new Date(p1.createdAt)
            }));
        }
        fetchPosts();
    }, []);

    return (
        <div className='feedback p-3'>
            {(!username || username === user.username) && <SharePost />}
            {posts.length === 0 && (<p className="text-center" style={{marginTop:"150px"}}>no post found! </p>)}
            {posts.map((post) => <ViewPost key={post._id} post={post} />)}
        </div>
    )
}

export default Feedback