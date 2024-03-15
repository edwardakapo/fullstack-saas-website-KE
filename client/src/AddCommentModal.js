import * as React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddCommentIcon from '@mui/icons-material/AddComment';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { toast } from 'react-toastify';

export default function AddCommentModal(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button size="small" onClick={handleClickOpen} color="secondary">
        <AddCommentIcon /> {props.amount}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const text = formJson.comment;
            axios.patch(`http://localhost:3000/post/${props.postId}/comment`, { text }, {withCredentials : true})
              .then((response) => {
                console.log(response.data);
                toast.success("Comment Added!")
                handleClose();
              })
              .catch((error) => {
                toast.error("Comment Not Added!")
                console.error('Error adding comment:', error);
              });
          },
        }}
      >
        <DialogTitle>Add a Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please write your comment below.
          </DialogContentText>
          <TextareaAutosize
            autoFocus
            required
            minRows={3}
            name="comment"
            placeholder="Add a comment"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add Comment</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}