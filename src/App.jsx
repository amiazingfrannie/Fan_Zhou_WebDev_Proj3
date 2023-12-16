import { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router';
import './App.css'
import BasicNav from './components/BasicNav/BasicNav.jsx';
import PostCard from './components/Card/PostDisplayCard.jsx';
import PostCreateCard from './components/Card/PostCreateCard.jsx';

function App() {
    const navigate = useNavigate();
    const [userName, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [updatesList, setUpdatesListState] = useState([]);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editablePostText, setEditablePostText] = useState('');

    const addNewPost = (newPost) => {
        setUpdatesListState(prevUpdates => [newPost, ...prevUpdates]);
    };

    const handleEditClick = (postId) => {
        setEditingPostId(postId);
        setEditablePostText(postId ? updatesList.find(post => post._id === postId).context : '');
    };

    async function handleSavePostUpdate(postId, updatedContent) {
        console.log("Editing post with ID:", postId); 
        const updatedText = updatedContent;
        try {
            await axios.put(`/api/updates/${postId}`, { context: updatedText });
            setEditingPostId(null); 
            getUserUpdates(userName);
        } catch (err) {
            setErrorMessage("Error updating post");
        }
    }

    async function handlePostDelete(postId) {
        try {
            await axios.delete(`/api/updates/${postId}`);
            getUserUpdates(userName);
        } catch (err) {
        setErrorMessage("Error deleting post");
    } }

    async function getUserUpdates(username) {
        try {
            const response = await axios.get(`/api/updates/${username}`);
            setUpdatesListState(response.data);
            // console.log(response.data);
        } catch (error) {
            setErrorMessage(error.response.data);
        }
    }

    async function handleCheckUpdatesClick(usernameClicked){
        if (userName) {
        navigate(`/user/${usernameClicked}`);
        } else {
        navigate('/login');
        }
    };

    useEffect(() => {
        async function fetchData() {
        try {
            const userResponse = await axios.get('/api/user/isLoggedIn');
            if (userResponse.data.username) {
            setUsername(userResponse.data.username);
            }
            const updatesResponse = await axios.get('/api/updates/all');
            setUpdatesListState(updatesResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMessage('Failed to load data.');
        }
        }
        fetchData();
    }, []);

    return (
        <div >
        <BasicNav/>
        <PostCreateCard userName={userName} addNewPost={addNewPost} className="card-custom" />
        {updatesList.map((update) => (
                <PostCard
                    key={update._id}
                    post={update}
                    isPostOwner={userName === update.username}
                    onEditClick={handleEditClick}
                    onSave={handleSavePostUpdate}
                    onDelete={handlePostDelete}
                    editingPostId={editingPostId}
                    editablePostText={editablePostText}
                    setEditablePostText={setEditablePostText}
                    onUsernameClick={handleCheckUpdatesClick}
                />
            ))}
        </div>
    )
}

export default App
