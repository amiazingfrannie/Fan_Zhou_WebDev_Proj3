import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { formatDateToYMD, timeSince } from './Helpers.jsx'
import BasicNav from './components/BasicNav/BasicNav.jsx';
import UserProfileCard from './components/Card/UserDisplayCard.jsx';
import PostCard from './components/Card/PostDisplayCard.jsx';

function User() {
    const { username } = useParams();
    const [LoggedInUserFile, setLoggedInUserFile] = useState({});
    const [editingPostId, setEditingPostId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [updatesList, setUpdatesListState] = useState([]);
    const [editablePostText, setEditablePostText] = useState('');

    // pass to createCard, share setUpdatesListState with updateCard
    const addNewPost = (newPost) => {
      setUpdatesListState(prevUpdates => [newPost, ...prevUpdates]);
    };

    // call when click edit
    const handleEditClick = (postId) => {
        setEditingPostId(postId);
        setEditablePostText(postId ? updatesList.find(post => post._id === postId).context : '');
    };

    // save updated post 
    async function handleSavePostUpdate(postId, updatedContent) {
        console.log("Editing post with ID:", postId); 
        const updatedText = updatedContent;
        try {
            await axios.put(`/api/updates/${postId}`, { context: updatedText });
            setEditingPostId(null); 
            getUserUpdates(username);
        } catch (err) {
            setErrorMessage("Error updating post");
        }
    }

    // call delete post 
    async function handlePostDelete(postId) {
        try {
            await axios.delete(`/api/updates/${postId}`);
            getUserUpdates(username);
        } catch (err) {
        setErrorMessage("Error deleting post");
    } }

    // get all updates from all users
    async function getUserUpdates(username) {
        try {
            // console.log(username);
            const response = await axios.get(`/api/updates/${username}`);
            setUpdatesListState(response.data);
        } catch (error) {
            setErrorMessage(error.response.data);
        }
    }

    // get cookies!
    async function getLoggedInUserFile() {
        const response = await axios.get(`/api/user/isLoggedIn`);
        // console.log(LoggedInUserFile.username === username)
        if(response.data.username) {
            setLoggedInUserFile({
                username:response.data.username,
                joinedTime:formatDateToYMD(response.data.joinedTime),
                bio: response.data.bio
            })
        }
    }

    useEffect(() => {
        getLoggedInUserFile();
    }, [username]);  
    
    useEffect(() => {
        if (username) {
            getUserUpdates(username);
        }
    }, [username]); 

    return (
    <div>
        <BasicNav/>
        <div style={{ paddingTop: '50px' }}>
        <UserProfileCard user={username} isCurrentUser={LoggedInUserFile.username === username} postNewUpdate={addNewPost}/>
        </div>
        {updatesList.map((update) => (
                <PostCard
                    key={update._id}
                    post={update}
                    isPostOwner={LoggedInUserFile.username === update.username}
                    onEditClick={handleEditClick}
                    onSave={handleSavePostUpdate}
                    onDelete={handlePostDelete}
                    editingPostId={editingPostId}
                    editablePostText={editablePostText}
                    setEditablePostText={setEditablePostText}
                />
            ))}
    </div>
    );
}

export default User;

