import React, { useEffect, useState } from 'react'
import SharePost from '../share-post/SharePost'
import ViewPost from '../view-post/ViewPost'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { tostConfig } from '../../config/interface';
import { useLocation } from 'react-router-dom';
import SearchContent from '../searchContent/SearchContent';


const Feedback = ({ username }) => {
    const [posts, setPosts] = useState([]);
    const user = useSelector(state => state.auth.user);
    const location = useLocation();
    const searchContent = useSelector(state => state.search.search);

    const fetchPosts = async () => {
        try {
            const res = username
                ? await axios.get(`${process.env.REACT_APP_API_BASE_URL}/posts/profile/${username}`)
                : await axios.get(`${process.env.REACT_APP_API_BASE_URL}/posts/timeline/${user._id}`);

            const sortedPosts = res.data.sort((p1, p2) => {
                return new Date(p2.createdAt) - new Date(p1.createdAt)
            });

            let filteredPosts;
            if (location.pathname === "/videos") {
                filteredPosts = sortedPosts.filter(post => post.img && post.img.includes('.mp4'));
            } else {
                filteredPosts = sortedPosts;
            }
            setPosts(filteredPosts);
        }
        catch (error) {
            toast.error(`${error}`, tostConfig);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [username, user._id, location.pathname]);

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(post => post._id !== postId));
    };

    return (
        <div className='feedback p-3'>
            {searchContent ? (
                <SearchContent />
            ) : (
                <>
                    {(!username || username === user.username) && <SharePost posts={posts} setPosts={setPosts} />}
                    {posts.length === 0 ?
                        (<p className="text-center" style={{ marginTop: "150px" }}>No post found! </p>) :
                        (posts.map((post) => <ViewPost key={post._id} post={post} onDeletePost={handleDeletePost} />))
                    }
                </>
            )}
        </div>
    )
}

export default Feedback