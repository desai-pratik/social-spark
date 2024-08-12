import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ViewPost from '../view-post/ViewPost';
import { editSearchPosts } from '../../context/searchSlice';

const SearchContent = () => {
    const searchContent = useSelector(state => state.search.search);
    const dispatch = useDispatch();

    const handleDeletePost = (postId) => {
        dispatch(editSearchPosts(postId));
    };

    return (
        <div>
            {searchContent && (
                <div>
                    {searchContent.users.map(user => (
                        <div key={user._id} className='d-flex align-items-center gap-3'>
                            <img src={user.profilePicture || "/assets/default-user.jpg"} className="rounded-circle" style={{ width: "150px", height: "150px" }} alt={user?.username} title={user?.username} />
                            <div>
                                <h5>{user.username}</h5>
                                <p className="m-0">{user.email}</p>
                                <small>Followers: {user.followers ? user.followers.length : "0"}</small>
                            </div>
                        </div>
                    ))}
                    {searchContent.posts.map((post) => <ViewPost key={post._id} post={post} onDeletePost={handleDeletePost} />)}
                </div>
            )}
        </div>
    )
}

export default SearchContent
