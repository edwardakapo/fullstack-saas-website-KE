import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function CommentsModal(props) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);

  const handleClickOpen = () => {

    axios.get(`http://localhost:3000/post/${props.postId}/comments`, {withCredentials : true})
      .then((response) => {
        setComments(response.data);
        setOpen(true);
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <CardActionArea  onClick={handleClickOpen} >
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Posted by {props.userName}
            </Typography>
            <Typography gutterBottom variant="h3" component="div"sx={{mb: 5 }}>
              {props.title}
            </Typography>
            <Typography variant="h6" color="text.primary">
              {props.text}
            </Typography>
          </CardContent>
      </CardActionArea>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        maxWidth='lg'
        
      >
        <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', fontSize: '1.5rem' }} id="customized-dialog-title">
          {props.title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers >
          <Typography gutterBottom>
            {props.text}
          </Typography>
        </DialogContent>
        <Typography variant="h6" gutterBottom component="div" sx={{ m: 0, p: 2 , fontWeight: 'bold'}}>
          Comments
        </Typography>
        {comments.map((comment, index) => (
          <DialogContent dividers key={index}>
            <Typography gutterBottom variant="body2">
              {comment.username}
            </Typography>
            <Typography gutterBottom variant="body1">
              {comment.text}
            </Typography>
          </DialogContent>
        ))}
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Exit
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}