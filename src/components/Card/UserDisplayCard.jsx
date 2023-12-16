import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import axios from 'axios';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'; 
import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
import PostCreateCard from './PostCreateCard.jsx';
import { formatDateToYMD} from '../../Helpers.jsx'


function UserProfileCard({ isCurrentUser, postNewUpdate }) {

    const { username } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [UserPageFile, setUserPageFile] = useState({});
    const [editableBio, setEditableBio] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
  
    const handleEditClick = () => {
        setIsEditing(true);
        setEditableBio(UserPageFile.bio); 
    };
  
    async function handleBioUpdate() {
        try {
            await axios.put(`/api/user/${username}`, { bio: editableBio });
            setUserPageFile(prevState => ({
                ...prevState,
                bio: editableBio
            }));
            setIsEditing(false); 
        } catch (err) {
            setErrorMessage("Error updating bio: " + err.message);
        }
    }

    async function getUserPageFile() {
        try {
            const response = await axios.get(`/api/user/${username}`);
            if (response.data.username) {
                setUserPageFile({
                    username: response.data.username,
                    joinedTime: formatDateToYMD(response.data.joinedTime),
                    bio: response.data.bio
                });
            }
        } catch (err) {
            setErrorMessage("Error fetching user data: " + err.message);
        }
    }

    useEffect(() => {
        getUserPageFile();
        setEditableBio('');
    }, [username]); 

    const errorMessageDisplay = errorMessage ? <Typography color="error">{errorMessage}</Typography> : null;

  return (
    <Card sx={{ minWidth: 300, maxWidth: 800, maxHeight: 360, margin: '30px auto', mt: 8 }}>
      <CardContent>
       {errorMessageDisplay}
        {/* <Avatar src={user.profilePic} sx={{ width: 56, height: 56 }}/> */}
        <Typography variant="h5" component="div">
          {username}
        </Typography>
        <Typography color="text.secondary">
          Joined: {UserPageFile.joinedTime}
        </Typography>
            {isCurrentUser ? (
                <>
                    {isEditing ? (
                        <>
                            <TextField 
                                fullWidth
                                label="Bio"
                                value={editableBio}
                                onChange={(e) => setEditableBio(e.target.value)}
                            />
                            <Button onClick={handleBioUpdate}>Save</Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="body2">
                                {UserPageFile.bio}
                            </Typography>
                            <Button onClick={handleEditClick}>Edit Profile</Button>
                        </>
                    )}
                </>
            ) : (
                <Typography variant="body2">
                    {UserPageFile.bio}
                </Typography>
            )}
      </CardContent>
      {isCurrentUser && (
        <PostCreateCard userName={UserPageFile.username} addNewPost={postNewUpdate}/>
      )}
    </Card>
  );
}

export default UserProfileCard;
