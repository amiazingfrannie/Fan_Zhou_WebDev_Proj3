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


        {/* <div>
            {updatesList.map((update) => (
            <div key={update._id} onClick={() => handleCheckUpdatesClick(update.username)}>
            {update.username}: Post: {update.context} - {timeSince(update.createdTime)} ago
            </div>
        ))}
        </div> */}
//   const [insertUpdateText, setInsertUpdateText] = useState(null);
  // get all updates from all users
//   async function getAllUpdates() {
//     const response = await axios.get('/api/updates/all')
//     setUpdatesListState(response.data);
//   }

    // async function handlePostUpdate(postId) {
    //     console.log("Editing post with ID:", postId); // Debugging line
    //     const updatedText = editablePostTexts[postId];
    //     try {
    //         await axios.put(`/api/updates/${postId}`, { context: updatedText });
    //         setEditingPostId(null); 
    //         getUserUpdates(userName);
    //     } catch (err) {
    //         setErrorMessage("Error updating post");
    //     }
    // }

    // function updateEditablePostText(postId, newText) {
    //     setEditablePostTexts(prevTexts => ({
    //         ...prevTexts,
    //         [postId]: newText
    //     }));
    // }

  // create new post
//   async function insertNewUpdate() {
//     let newUpdate;
//     if (!insertUpdateText || insertUpdateText.trim() === '') {
//         setErrorMessage('Please enter some text before posting');
//         return;
//     } else {
//         setErrorMessage('');
//         newUpdate = {
//             context: insertUpdateText,
//         };
//     }
//     await axios.post('/api/updates/add', newUpdate);
//     await getAllUpdates();
//     setInsertUpdateText('')
//   }

//   function updateContext(event) {
//     setInsertUpdateText(event.target.value);
//   }

//   async function handlePostClick(){
//     if (userName) {
//         insertNewUpdate();
//     } else {
//       navigate('/login');
//     }
//   };

//   async function getUsername() {
//     const response = await axios.get('/api/user/isLoggedIn')
//     if(response.data.username) {
//         setUsername(response.data.username)
//     }
//   }

//   useEffect( function() {
//      getUsername();
//     //  getAllUpdates()
//   }, []);

        {/* <input 
            onInput={updateContext}
            value={insertUpdateText}   
            placeholder="Anything to share?" 
            style={{ color: 'gray' }}
        />
        {errorMessage && <div style={{ color: 'blue' }}>{errorMessage}</div>}
        <div><button onClick={handlePostClick}>post</button></div>
   */}