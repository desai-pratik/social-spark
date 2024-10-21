import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ViewPost from '../view-post/ViewPost';
import { addSearch, editSearchPosts } from '../../context/searchSlice';
import { toast } from 'react-toastify';
import { tostConfig } from '../../config/interface';
import axios from 'axios';

const SearchContent = ({ query }) => {
    const searchContent = useSelector(state => state.search.search);
    const dispatch = useDispatch();

    const handleDeletePost = (postId) => {
        dispatch(editSearchPosts(postId));
    };

    useEffect(() => {
        const fetchSearchResults = async () => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/search?q=${query}`);
            dispatch(addSearch(response.data));
          } catch (error) {
            toast.error(`${error}`, tostConfig);
          }
        };
        if (query) {
            fetchSearchResults();
          }
        }, [query, dispatch]);

    return (
        <>
            {searchContent && (
                <>
                    {searchContent.users.map(user => (
                        <div key={user._id} className='position-relative'>
                            <img src={user.coverPicture || "/assets/banner-3.PNG"} className="position-absolute w-100 object-fit-cover z-n1" style={{ height: "-webkit-fill-available" }} alt="Cover Profile" title="Cover Profile" />
                            <div className='d-flex align-items-center gap-3 p-3 text-white' style={{backgroundImage: "linear-gradient(to right, black , transparent)"}}>
                                <img src={user.profilePicture || "/assets/default-user.jpg"} className="rounded-circle" style={{ width: "130px", height: "130px" }} alt={user?.username} title={user?.username} />
                                <div>
                                    <h5 className="capitalize">{user.username}</h5>
                                    <p className="m-0">{user.email}</p>
                                    <small>Followers: {user.followers ? user.followers.length : "0"}</small>
                                </div>
                            </div>
                        </div>
                    ))}
                    {searchContent.posts.map((post) => <ViewPost key={post._id} post={post} onDeletePost={handleDeletePost} />)}
                </>
            )}
        </>
    )
}

export default SearchContent
