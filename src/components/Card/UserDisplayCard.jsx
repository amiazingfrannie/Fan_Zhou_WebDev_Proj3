import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'; 
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import PostCreateCard from './PostCreateCard.jsx';

function UserProfileCard({ user, isCurrentUser, updateUserInfo, postNewUpdate }) {

  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(user.bio);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    updateUserInfo({ ...user, bio: editedBio });
    setIsEditing(false);
  };

  return (
    <Card sx={{ minWidth: 275, maxWidth: 500, margin: 'auto', mt: 2 }}>
      <CardContent>
        {/* <Avatar src={user.profilePic} sx={{ width: 56, height: 56 }}/> */}
        <Typography variant="h5" component="div">
          {user.username}
        </Typography>
        <Typography color="text.secondary">
          Joined: {user.joinedTime}
        </Typography>
        {isCurrentUser && isEditing ? (
          <>
            <TextField 
              fullWidth
              label="Bio"
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
            />
            <Button onClick={handleSaveClick}>Save</Button>
          </>
        ) : (
          <Typography variant="body2">
            {user.bio}
          </Typography>
        )}
        {isCurrentUser && !isEditing && (
          <Button onClick={handleEditClick}>Edit Profile</Button>
        )}
      </CardContent>
      {isCurrentUser && (
        <PostCreateCard userName={user.username} addNewPost={postNewUpdate}/>
      )}
    </Card>
  );
}

export default UserProfileCard;
