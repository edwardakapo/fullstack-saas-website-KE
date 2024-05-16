import React from 'react';
import Button from '@mui/material/Button';
import Header from './Header';
import { ToastContainer} from 'react-toastify';
import ProfilePage from './ProfilePage';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homepage from './Homepage';
import NotFoundPage from './NotFoundPage';
//increaase spacing between 
function App() {

  return (
    <Router>
      <div className="flex-col space-y-32 ">
        <Header />
        <ToastContainer />
        <Routes>
          <Route path="/" element={
            <>
              <Homepage />
            </>
          } />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/allposts" element={<ProfilePage />} />
          <Route path="/profile/savedposts" element={<ProfilePage />} />
          {/*
            <Route path="/profile/settings" element={<ProfilePage />} />
          */}
          <Route path="*" element={<NotFoundPage />} /> {/* Catch-all route for 404 Page */}
        </Routes>
      </div>
    </Router>

  );
}

export default App;

