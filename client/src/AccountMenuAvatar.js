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
import { css } from '@mui/system';

const responsiveIconStyle = css({
  width: 30,
  height: 30,
  '@media (min-width: 768px)': {
    width: 60,
    height: 60,
  },

});

const responsivePopupStyle = css({
  '@media (max-width: 768px)': {
    width: 150,
    height: 350,
    justifyContent: "start",
  },

});


 
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
            <Avatar src={props.src} sx={responsiveIconStyle} />
            </IconButton>
        </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        sx = {responsivePopupStyle}
        componentsProps={{
          paper: {
            square : false,
            elevation: 0,
            sx: {
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
      <div className='md:px-4'>

        <MenuItem onClick={() => {navigate('/profile')}} sx={{padding : 0, margin : 0, width : 0,}}>
          <div className='grid grid-cols-2 gap-10 px-4 md:flex md:gap-0 md:items-center'>
            <div>
                <Avatar src={props.src} sx={{ mr: 4,
              
                width: 30,
                height: 30,
                '@media (min-width: 768px)': {
                  width: 40,
                  height: 40,
                },
              
              }}/> 
            </div>
            <div>
              <p className='pt-1 text-sm md:text-base'>Profile</p>
            </div>
          </div>
        </MenuItem>
        <Divider />
        <MenuItem sx={{padding : 0, margin : 0, width : 0,}} onClick={() => {navigate('/profile/settings')}}>
          <div className='grid grid-cols-2 gap-10 px-4 md:flex md:gap-0 md:items-center'>
            <Settings sx={{ mr: 3, 
                            width: 30,
                            height: 30,
                            '@media (min-width: 768px)': {
                              width: 40,
                              height: 40,
                            },}} fontSize="small" />
            <p className='pt-1 text-sm md:text-base'> Settings</p>
          </div>
        </MenuItem>
        <Divider/>
        <MenuItem onClick={logout} sx={{padding : 0, margin : 0}}>
          <div className='grid grid-cols-2 gap-10 px-4 md:flex md:gap-0 md:items-center'>
            <Logout sx={{ mr: 3.5 , ml: 0.5,
             width: 30,
             height: 30,
             '@media (min-width: 768px)': {
               width: 40,
               height: 40,
             }}} fontSize="small" />
            <p className='pt-1 text-sm md:text-base'> Logout</p>
          </div>
        </MenuItem>
      </div>
      </Menu>
    </React.Fragment>
  );
}