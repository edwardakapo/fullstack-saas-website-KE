import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios'

export default function FormDialogButton(props) {
    const [open, setOpen] = React.useState(false);
    const [isSignUp, setIsSignUp] = React.useState(true)
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleToggle = () => {
      setIsSignUp(!isSignUp);
    };

    const register = (e) =>{
      e.preventDefault();
      const formData = new FormData(e.target);
      const formJson = Object.fromEntries(formData.entries());
      console.log(formJson);
      axios.post('http://localhost:3000/register', formJson, {withCredentials : true})
      .then(response => {
        if (response.status === 200) {
          // Store the JWT in localStorage
          localStorage.setItem('jwt', response.data.token);
          // Refresh the page
          // Set isLoggedIn to true
          localStorage.setItem('isLoggedIn', 'true');
          window.location.reload();
        }
      })
      .catch(error => {
        console.error('Error during login:', error);
      });
      handleClose();
      
    }

    const login = (e) => {
      e.preventDefault();
    }
  
    return (
      <React.Fragment>
        <Button variant={props.variant} size={props.size} sx={props.sx} fontsize={props.fontsize} onClick={handleClickOpen}>
          {props.text}
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
            onSubmit: isSignUp ? register : login,
          }}
        >
          <DialogTitle>{isSignUp ? 'Sign Up' : 'Sign In'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {isSignUp ? 'To sign up, please enter your details.' : 'To sign in, please enter your credentials.'}
            </DialogContentText>
            {/* Conditionally render form fields */}
            {isSignUp ? (
              // Sign Up form fields
            <>
              <TextField
                autoFocus
                required
                margin="dense"
                id="username"
                name="username"
                label="Username"
                type="text"
                fullWidth
                variant="standard"
              />
              <TextField
                required
                margin="dense"
                id="email"
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
              />
              <TextField
                required
                margin="dense"
                id="password"
                name="password"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
              />
            </>
              // Add other sign up fields (password, confirm password, etc.)
            ) : (
              // Sign In form fields
              <>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="standard"
                />
                <TextField
                  required
                  margin="dense"
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="standard"
                />
              </>
              // Add other sign in fields (password, etc.)
            )}
          <DialogActions>
          {isSignUp ? (
                <Button type="submit">Sign Up</Button>
              ) : (
                <Button type="submit">Sign In</Button>
              )}
          </DialogActions>
            <Button onClick={handleToggle}>
              {isSignUp ? 'Already have an account? Sign In' : 'New user? Sign Up'}
            </Button>
            <div className='flex flex-col'>
              <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                <hr style={{ flex: 1 }} />
                <p style={{ margin: '0 10px' }}>OR</p>
                <hr style={{ flex: 1 }} />
              </div>
              <Button variant="contained" color="primary" style={{ width: '50%', marginLeft : '25%' }}>
                Login with Google
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    );
  }