import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'; 
import axios from 'axios';
import { useNavigate } from 'react-router';

export default function PostCreateCard({ userName, addNewPost }) {

    const navigate = useNavigate();
  const [postContent, setPostContent] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');

  const handlePostChange = (event) => {
    setPostContent(event.target.value);
  };

  async function insertNewUpdate() {
    let newUpdate;
    if (!postContent || postContent.trim() === '') {
        setErrorMessage('Please enter some text before posting');
        return;
    } else {
        setErrorMessage('');
        newUpdate = {
            context: postContent,
        };
        const resp = await axios.post('/api/updates/add', newUpdate);
        addNewPost(resp.data);
        setPostContent('');
    }
  }

  const handleSubmit = () => {
    if (userName) {
        insertNewUpdate();
    } else {
      navigate('/login');
    }
    console.log(postContent);
    setPostContent(''); 
  };

  return (
    <Card sx={{ minWidth: 300, width: '80vw', maxWidth: '800px', margin: 'auto', mt: 5,}}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ fontFamily: 'Normal',  color: '#CF5704', mb: 2 }}>
        </Typography>
        <TextField
          fullWidth
          id="post-content"
          label="What's on your mind?"
          variant="outlined"
          multiline
          rows={4}
          value={postContent}
          onChange={handlePostChange}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Post
        </Button>
        {errorMessage && <div style={{ color: 'blue' }}>{errorMessage}</div>}
      </CardContent>
    </Card>
  );
}
