import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { toast } from 'react-toastify';


export default function PostFormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({ title: '', text: '' });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  const handleSubmit = () => {
    axios.post('http://localhost:3000/post', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials : true,
    })
      .then(() => {
        console.log('Form submitted successfully');
        handleClose();
        window.location.reload();
      })
      .catch((error) => {
        toast.error('Error Creating Post Failed')
        console.error('Error submitting form:', error);
      });
  };

  return (
    <React.Fragment>
      <Button variant={props.variant} sx={props.sx} onClick={handleClickOpen}>
        {props.text}
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogTitle>Submit Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="title"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            value={formData.title}
            onChange={handleInputChange}
          />
          <TextField
            required
            margin="dense"
            id="text"
            name="text"
            label="Text"
            type="text"
            fullWidth
            variant="standard"
            value={formData.text}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}