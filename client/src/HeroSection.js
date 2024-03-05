import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';

const StyledButton = styled(Button)({
  padding : '3rem 6rem',// equivalent to Tailwind's 'px-8'
  borderRadius : '6rem',
});


export default function HeroSection() {

    return (

    <section className="bg-slate-200 h-full w-full flex flex-col justify-center space-y-4 text-left">
        <h1 className="text-9xl mb-10">Welcome to <br/>DevHelp,</h1>
        <div className="flex w-1/2 justify-center">
            <h2 className="text-6xl"> some copy here to be replaced later</h2>
            <StyledButton variant='outlined'>Post A Question</StyledButton>
        </div>
        <div className='pt-20'>
            <h2> Answer Other Peoples Questions to get Points</h2>
        </div>
    </section>
    )
}