import { useState, useEffect } from 'react'
import axios from 'axios';
import { Home, LeftPane, RightPane } from '../src/components'
import './App.css'
import { timeSince } from './Helpers.jsx'
import { useNavigate } from 'react-router';
import BasicNav from './components/BasicNav/BasicNav.jsx';
import PostCreateCard from './components/Card/PostCreateCard.jsx';

function App() {
  const navigate = useNavigate();

  const [userName, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [updatesList, setUpdatesListState] = useState([]);

  const addNewPost = (newPost) => {
    setUpdatesListState(prevUpdates => [newPost, ...prevUpdates]);
  };

//   const [insertUpdateText, setInsertUpdateText] = useState(null);

  // get all updates from all users
//   async function getAllUpdates() {
//     const response = await axios.get('/api/updates/all')
//     setUpdatesListState(response.data);
//   }

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
      <PostCreateCard userName={userName} addNewPost={addNewPost} />

      <div>
        {updatesList.map((update) => (
        <div key={update._id} onClick={() => handleCheckUpdatesClick(update.username)}>
          {update.username}: Post: {update.context} - {timeSince(update.createdTime)} ago
        </div>
      ))}
      </div>
      </div>
  )
}

export default App


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