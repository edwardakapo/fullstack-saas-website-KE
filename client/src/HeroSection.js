import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import PostFormButton from './PostFormButton';
import DevCoding from './DevCoding.svg'; // import the image
import Cookies from 'js-cookie';


const Styles={
  padding : '2rem 4rem',// equivalent to Tailwind's 'px-8'
  borderRadius : '6rem',
  fontSize : '1.5rem',
  fontWeight: 'bold', 
};


export default function HeroSection() {
    const checkLoggedIn = () =>{
        return Cookies.get('isLoggedIn') ? true : false;
   }
    return (

    <section className="h-full w-full flex flex-col justify-center space-y-10 text-left">
        <div className="flex w-128 h-120 justify-between mb-20">
            <h1 className="mt-24 text-9xl font-extrabold ">Welcome <br/>to DevHelp</h1>
            <img src={DevCoding} alt="Description of image" />
        </div>
        <div className="flex space-x-20">
            <h2 className="text-6xl font-bold w-1/2">Where Coding Questions Find Expert Answers!</h2>
            {/*
                <PostFormButton variant='outlined' text ="Post A Question" fontSize="inherit"sx = {Styles}/>
                */
            }  
            <Button variant='outlined' text ="Post A Question" fontSize="inherit"sx = {Styles} onClick={ () => {
                if (!checkLoggedIn()){
                alert("you need to login");
                return
                }
            }}>
                 Post A Question
            </Button>
        </div>
        <div className='pt-24 text-center text-5xl font-bold'>
            <h2> Or Answer Peoples Questions Below to get Points!</h2>
        </div>
    </section>
    )
}