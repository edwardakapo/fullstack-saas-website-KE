import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import HeroSection from './HeroSection';
import Header from './Header';


//increaase spacing between 
function App() {
  return (
    <div className="flex-col space-y-32 ">
      <Header />
      <HeroSection />
      <section className="bg-stone-50 shadow-md px-6 py-3">
        <h5>User Avatar here    and  name here</h5>
        <h1 className='text-xl mb-3'>Post Title</h1>
        <p>Posts should go here</p>
      </section>
      <footer>This is the footer</footer>
    </div>
  );
}

export default App;