import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import axios from 'axios';
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';

export default function AccountMenuAvatar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const logout = () => {
    // Remove the 'isLoggedIn' cookie
    Cookies.remove('isLoggedIn');

    // Make a request to the server's logout endpoint
    axios.post('http://localhost:3000/logout', {}, {withCredentials : true})
      .then(response => {
        // Handle successful logout
        console.log('Logged out:', response);
        window.location.reload();

      })
      .catch(error => {
        // Handle error during logout
        console.error('Error during logout:', error);
      });

    // Close the menu
    handleClose();
  };


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
      // Override the styles after the menu is opened
  setTimeout(() => {
    document.body.style.overflow = 'unset';
    document.body.style.paddingRight = '0px';
  }, 0);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 , '&:focus': { outline: 'none' }}}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar src={props.src} sx={props.sx}></Avatar>
          </IconButton>
        </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        componentsProps={{
          paper: {
            square : false,
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
      <div className='px-4'>

        <MenuItem onClick={() => {navigate('/profile')}}>
          <div className='flex items-center'>
            <Avatar src={props.src} sx={{ mr: 4 }} /> 
            Profile
          </div>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {navigate('/profile/settings')}}>
          <ListItemIcon>
            <Settings sx={{ mr: 3 }} fontSize="large" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon >
            <Logout sx={{ mr: 3.5 , ml: 0.5}} fontSize="large" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </div>
      </Menu>
    </React.Fragment>
  );
}