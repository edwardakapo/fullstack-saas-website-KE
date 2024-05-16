import React, { useEffect, useState } from 'react';
import Posts from './Posts';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Avatar from '@mui/material/Avatar';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Skeleton from '@mui/material/Skeleton';

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true); // Start with loading true
  const [value, setValue] = useState(getTabValueFromPath());
  const [posts, setPosts] = useState({ usersPosts: [], usersSavedPosts : [], usersStars: 0 }); // Default structure

    // Update tab value based on URL change
    useEffect(() => {
      setValue(getTabValueFromPath());
    }, [location.pathname]);


    useEffect(() => {
      if (!Cookies.get('isLoggedIn')) {
        alert('You need to login')
      navigate('/');
      return; // Prevent further execution if not logged in
    }
    
    axios.get('http://localhost:3000/profile', { withCredentials: true })
      .then((response) => {
        console.log("fetching", response)
        setPosts(response.data); // Ensure response.data matches expected structure
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      })
      .finally(() => {
        setLoading(false);
      });
      //}, [location.pathname]);
    }, []);
    

  function getTabValueFromPath() {
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    return ['allposts', 'savedposts', 'settings'].includes(lastSegment) ? lastSegment : 'allposts';
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(`/profile/${newValue}`);
  };

  let userInfo = { username: 'Loading...', picture: '' };
  try {
    const storedInfo = Cookies.get('userInfo');
    if (storedInfo) {
      userInfo = JSON.parse(storedInfo);
    }
  } catch (error) {
    console.error('Error parsing userInfo from cookie', error);
  }

  if (loading) {
    return (
      <div>
        <Skeleton variant="text" width={210} height={60} />
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" width={210} height={118} />
      </div>
    );
  }

  return (
    <div className='flex flex-col space-y-20'>
      <div className='flex items-center'>
        <Avatar src={userInfo.picture} sx={{ width: 200, height: 200 }} />
        <h1 className='text-5xl font-bold py-10 px-5'>{userInfo.username}</h1>
      </div>
      <h2 className='text-4xl font-bold my-10 mx-5'>Points: {posts.usersStars}</h2>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="My Posts" value="allposts" />
              <Tab label="Saved Posts" value="savedposts" />
              {/*
                <Tab label="Settings" value="settings" />
              */}
            </TabList>
          </Box>
          <TabPanel value="allposts">
            My Posts
            <Posts posts={posts.usersPosts} addDelete={true} addStar={true}/>
          </TabPanel>
          <TabPanel value="savedposts">
            Saved Posts
            <Posts posts={posts.usersSavedPosts} addUnsave={true}/>
            </TabPanel>
          {/*
          
          <TabPanel value="settings">
            Settings
            <SettingsForm userInfo={userInfo}/> 
          </TabPanel>
          */}
        </TabContext>
      </Box>
    </div>
  );
}