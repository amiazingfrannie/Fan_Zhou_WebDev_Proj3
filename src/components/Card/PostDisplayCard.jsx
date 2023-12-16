import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { timeSince } from '../../Helpers.jsx'
import TextField from '@mui/material/TextField';

function PostCard({ post, isPostOwner, onEditClick, onSave, onDelete, editingPostId, editablePostText, setEditablePostText, onUsernameClick }) {
    return (
        <Card sx={{ marginBottom: 2 }}>
            <CardContent>
                {editingPostId === post._id ? (
                    <>
                        <TextField
                            fullWidth
                            value={editablePostText || ''}
                            onChange={(e) => setEditablePostText(e.target.value)}
                        />
                        <Button onClick={() => onSave(post._id, editablePostText)}>Save</Button>
                        <Button onClick={() => onEditClick(null)}>Cancel</Button>
                    </>
                ) : (
                    <>
                        <Typography variant="h6" onClick={() => onUsernameClick(post.username)}>{post.username}: {post.context}</Typography>
                        <Typography variant="body2">Posted: {timeSince(post.createdTime)}</Typography>
                        {isPostOwner && (
                            <div>
                                <Button onClick={() => onEditClick(post._id)}>Edit</Button>
                                <Button onClick={() => onDelete(post._id)}>Delete</Button>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export default PostCard;