import axios from 'axios';
import getGoogleOAuthURL from './getGoogleUrl';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const login = (e , handleClose) => {
    e.preventDefault();
    e.preventDefault();
    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    axios.post('http://localhost:3000/login', formJson, {withCredentials : true})
    .then(response => {
      if (response.status === 200) {
        // Store the JWT in localStorage
        console.log(response)
        console.log(response.Token)
        window.location.reload();
      }
      else{

        toast.error("Login Failed!")
      }
    })
    .catch(error => {
      toast.error("Login Failed!")
      console.error('Error during login:', error);
    });
    handleClose();
  }


export const register = (e , handleClose) =>{
    e.preventDefault();
    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    axios.post('http://localhost:3000/register', formJson, {withCredentials : true})
    .then(response => {
      if (response.status === 200) {
        // Store the JWT in localStorage
        console.log(response)
        console.log(response.Token)
        window.location.reload();
      }
      else{

        toast.error("Login Failed!")
      }

    })
    .catch(error => {
      console.error('Error during login:', error);
    });
    handleClose();
    
  }


export const handleGoogleLogin = () => {
    // Redirect to Google login URL
    window.location.href = getGoogleOAuthURL();
  };