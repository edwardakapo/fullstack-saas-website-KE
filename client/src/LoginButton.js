import React, {useState, useEffect} from 'react'
import FormDialogButton from './FormDialogButton';
import { css } from '@mui/system';

const Styles = css({
    padding : '0.5rem 0.5rem',// equivalent to Tailwind's 'px-8'
    borderRadius : '1rem',
    transition: 'border-radius 0.5s ease',
    '&:hover': {
      borderRadius : '0rem', // Change to your preferred color
    },
    '@media (min-width: 768px)': {
      padding : '1rem 2rem',// equivalent to Tailwind's 'px-8'
      borderRadius : '4rem',
      transition: 'border-radius 0.5s ease',
      '&:hover': {
        borderRadius : '1rem', // Change to your preferred color
      },
    },
})
const buttonSize = window.innerWidth >= 768 ? 'medium' : 'small';

  export default function LoginButton(){
    return(
        <FormDialogButton 
            variant='contained'
            size={buttonSize}
            fontSize='inherit'
            sx={Styles}
            text="Login"
        />
    )
  }