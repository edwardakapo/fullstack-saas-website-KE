import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import HeroSection from './HeroSection';
import Header from './Header';
import Posts from './Posts'
import { ToastContainer} from 'react-toastify';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Avatar from '@mui/material/Avatar';

//increaase spacing between 
function App() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className="flex-col space-y-32 ">
      <Header />
      <ToastContainer />
      <div className='flex flex-col space-y-20'>
        <div className='flex'>
          <Avatar src=''sx={{width : 200 , height : 200}}/>
          <h1 className='text-4xl font-bold py-10 px-5'>User Name</h1>
        </div>
        <h2 className='text-4xl font-bold my-10 mx-5'>Score is:</h2>
          <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="All Posts" value="1" />
                <Tab label="Saved Posts" value="2" />
                <Tab label="Settings" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
              All Posts
              <Posts />
            </TabPanel>
            <TabPanel value="2">Saved Posts</TabPanel>
            <TabPanel value="3">Settings</TabPanel>
          </TabContext>
        </Box>
      </div>
      <HeroSection/>
      <Posts styles="flex flex-col space-y-10"/>
    </div>
  );
}

export default App;


/*
function App() {
  return (
    <Router>
      <div className="flex-col space-y-32 ">
        <Header />
        <nav>
          <Link to="/"><Button>Home</Button></Link>
          <Link to="/profile"><Button>Profile</Button></Link>
        </nav>
        <ToastContainer />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <Posts styles="flex flex-col space-y-10" />
            </>
          } />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}
*/