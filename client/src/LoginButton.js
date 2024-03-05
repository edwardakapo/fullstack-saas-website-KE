import React, {useState, useEffect} from 'react'
import FormDialogButton from './FormDialogButton';

const Styles = {
    padding : '0.5rem 4rem',// equivalent to Tailwind's 'px-8'
    borderRadius : '4rem',
    transition: 'border-radius 0.5s ease',
    '&:hover': {
      borderRadius : '1rem', // Change to your preferred color
    },
}

  export default function LoginButton(){
    return(
        <FormDialogButton 
            variant='contained'
            size='medium'
            fontSize='inherit'
            sx={Styles}
            text="Login"
        />
    )
  }