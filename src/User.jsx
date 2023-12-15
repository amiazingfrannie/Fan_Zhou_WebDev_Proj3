import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { formatDateToYMD, timeSince } from './Helpers.jsx'
import { useNavigate } from 'react-router';
import BasicNav from './components/BasicNav/BasicNav.jsx';
import PostCreateCard from './components/Card/PostCreateCard.jsx';
import UserProfileCard from './components/Card/UserDisplayCard.jsx';

function User() {
    const navigate = useNavigate();
    const { username } = useParams();
    const [updatesByUserList, setUpdatesByUserListState] = useState([]);
    const [insertUpdateText, setInsertUpdateText] = useState('');
    const [LoggedInUserFile, setLoggedInUserFile] = useState({});
    const [editingPostId, setEditingPostId] = useState(null);
    const [editablePostTexts, setEditablePostTexts] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [updatesList, setUpdatesListState] = useState([]);

    const addNewPost = (newPost) => {
      setUpdatesListState(prevUpdates => [newPost, ...prevUpdates]);
    };

    function updateEditablePostText(postId, newText) {
        setEditablePostTexts(prevTexts => ({
            ...prevTexts,
            [postId]: newText
        }));
    }

    async function handlePostUpdate(postId) {
        const updatedText = editablePostTexts[postId];
        try {
            await axios.put(`/api/updates/${postId}`, { context: updatedText });
            setEditingPostId(null); 
            getUserUpdates(username);
        } catch (err) {
            setErrorMessage("Error updating post");
        }
    }
    
    async function handlePostDelete(postId) {
        try {
            await axios.delete(`/api/updates/${postId}`);
            getUserUpdates(username);
        } catch (err) {
        setErrorMessage("Error deleting post");
    } }

    // create new post
    async function insertNewUpdate() {
        let newUpdate;
        if (!LoggedInUserFile.username) {
            navigate('/login');
        }
        if (!insertUpdateText || insertUpdateText.trim() === '') {
            setErrorMessage('Please enter some text before posting');
            return;
        } else {
            setErrorMessage('');
            newUpdate = {
                context: insertUpdateText,
            };
        }
        try {
            await axios.post('/api/updates/add', newUpdate);
            setInsertUpdateText('');
            getUserUpdates(username);
        } catch(error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data);
                } else {
                // console.error("Error posting update", error);
                setErrorMessage('Error posting update');
            }
        }

    }

    function updateContext(event) {
        setInsertUpdateText(event.target.value);
    }

    async function handlePostClick(){
        insertNewUpdate();
    };

    // get all updates from all users
    async function getUserUpdates(username) {
        try {
            console.log(username);
            const response = await axios.get(`/api/updates/${username}`);
            setUpdatesByUserListState(response.data);
        } catch (error) {
            setErrorMessage(error.response.data);
        }
    }

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
        // getUserPageFile();
        getUserUpdates(username);
        setErrorMessage('');
    }, [username, updatesList]);

    if (!updatesByUserList) {
        return <div>Loading...</div>;
    }

    const UpdatesComponent = ({ updates }) => {
        return (
            <div>
                {updates.map((update) => (
                    <div key={update._id}>
                        {editingPostId === update._id ? (
                            <div>
                                <input 
                                    value={editablePostTexts[update._id] || ''}
                                    onChange={(e) => updateEditablePostText(update._id, e.target.value)}
                                    autoFocus
                                />
                                <button onClick={() => handlePostUpdate(update._id)}>Save</button>
                                <button onClick={() => setEditingPostId(null)}>Cancel</button>
                            </div>
                        ) : (
                            <p>{update.username}: Post: {update.context} - {timeSince(update.createdTime)} ago</p>
                        )}
                        {LoggedInUserFile.username === update.username && (
                            <div>
                                <button onClick={() => { 
                                    setEditingPostId(update._id); 
                                    setEditablePostTexts(prevTexts => ({
                                        ...prevTexts,
                                        [update._id]: update.context
                                    }));
                                }}>Edit</button>
                                <button onClick={() => handlePostDelete(update._id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
    <div>
        <BasicNav/>
        <UserProfileCard user={username} isCurrentUser={LoggedInUserFile.username === username} postNewUpdate={addNewPost}/>
        <UpdatesComponent updates={updatesByUserList} />
    </div>
    );
}

export default User;


    // async function handleBioUpdate() {
    //     try {
    //         await axios.put(`/api/user/${username}`, { bio: editableBio });
    //         setUserPageFile(prevState => ({
    //             ...prevState,
    //             bio: editableBio
    //         }));
    //         setEditableBio('');
    //     } catch (err) {
    //         setErrorMessage("Error updating bio");
    //     }
    // }
    // async function getUserPageFile() {
    //     try{
    //         const response = await axios.get(`/api/user/${username}`)
    //         if(response.data.username) {
    //             setUserPageFile({
    //                 username:response.data.username,
    //                 joinedTime:formatDateToYMD(response.data.joinedTime),
    //                 bio: response.data.bio
    //             })
    //             console.log(UserPageFile);
    //         }
    //     } catch(err) {
    //         setErrorMessage(err.response.data);
    //     }
    // }
    // const [UserPageFile, setUserPageFile] = useState({});
    // const [editableBio, setEditableBio] = useState('');
            {/* <h1>Home of {UserPageFile.username}</h1> */}
        {/* <p>bio: {UserPageFile.bio}</p>
        {LoggedInUserFile.username === username && (
        <div>
            <input 
                value={editableBio}
                onChange={(e) => setEditableBio(e.target.value)}
                placeholder="Update your bio" 
            />
            <button onClick={handleBioUpdate}>Update Bio</button>
        </div>
        )}
        <p>joined at {UserPageFile.joinedTime}</p> */}

                {/* {LoggedInUserFile.username === username && (
        <div>
        <input 
            onInput={updateContext}
            value={insertUpdateText}   
            placeholder="Anything to share?" 
            style={{ color: 'gray' }}
        />
        {errorMessage && <div style={{ color: 'blue' }}>{errorMessage}</div>}
        <div><button onClick={handlePostClick}>post</button></div>
        </div>
        )} */}