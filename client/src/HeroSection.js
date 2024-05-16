import React  , {useState, useEffect} from 'react';
import DevCoding from './DevCoding.svg'; // import the image
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import FormDialogButton from './FormDialogButton';
import { Avatar, TextField  } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

const Styles1={
  padding : '1rem 6rem',// equivalent to Tailwind's 'px-8'
  //borderRadius : '6rem',
  fontWeight: 'bold', 
};

const Styles2={
    padding : '1rem 4rem',// equivalent to Tailwind's 'px-8'
    //borderRadius : '6rem',
    fontWeight: 'bold', 
  };

const postTextStyle ={

}


export default function HeroSection() {
    const checkLoggedIn = () =>{
        return Cookies.get('isLoggedIn') ? true : false;
   }
   const [isLoggedIn, setIsLoggedIn] = useState(false)
   let userPic = ""

   if (Cookies.get('userInfo')) {
       userPic = JSON.parse(Cookies.get('userInfo')).picture; // parse the user cookie
   }
   useEffect(() => {
       const loggedIn = Cookies.get('isLoggedIn') === 'True'; // check if isLoggedIn cookie exists and is 'true'
       setIsLoggedIn(loggedIn); // set the state
   }, []);

   const alertIfLoggedOut = () => {
        if (!checkLoggedIn()){
            toast.error("You need to login to post a question")
            }
    }
    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({ title: '', text: '' });
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
  
  
    const handleSubmit = () => {
      axios.post('http://localhost:3000/post', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials : true,
      })
        .then(() => {
          console.log('Form submitted successfully');
          handleClose();
          window.location.reload();
        })
        .catch((error) => {
          toast.error('Error Creating Post Failed')
          console.error('Error submitting form:', error);
        });
    };
    return (

    <div>
        {!isLoggedIn ? (
             <section className="h-full w-full flex flex-col items-center justify-center space-y-10 text-left">
                <div className="grid grid-cols-2 w-11/12 h-120 mb-10">
                    <div className='flex-col space-y-20 '>
                        <h1 className="mt-24 text-8xl font-extrabold ">Welcome <br/>to DevHelp</h1>
                        <h2 className="text-4xl font-bold">Where Your Coding Questions Will Find Expert Answers</h2>  
                    </div>
                    <div className='col-start-2 flex justify-end'>
                        <img src={DevCoding} alt="Description of image" />      
                    </div> 
                </div>

                <div className='w-4/5 text-center text-xl'>
                    <h2> To get started you can answer questions from other users below to get Points, or post your own questions and have them be answered by some of the best devs around.</h2>
                </div>

                <div className="flex space-x-5">
                    <FormDialogButton
                                variant='outlined'
                                size='medium'
                                fontSize='inherit'
                                sx={Styles1}
                                text="Post a Question"
                    />
                    <FormDialogButton
                                variant='contained'
                                size='medium'
                                fontSize='inherit'
                                sx={Styles2}
                                text="Sign In"
                    />
                </div>
            </section>
        ) : (
            <div className=' flex flex-col items-center justify-center'>
                <div className="w-1/2 shadow-lg border rounded align-center items-center p-2">
                    <div className=' flex items-center'>
                        <div className='pl-5 w-1/4'>
                            <Avatar src={userPic} sx={{ width: 30, height: 30 }}></Avatar>
                        </div>
                        <div className='pr-5 w-3/4'>
                            <button type="button" onClick={handleClickOpen} className='w-full'>
                                <div className='space-x-3 flex items-center w-full'>
                                    <input placeholder='Create a post' type='text' size="10" readOnly='true' className='border py-1 px-4 w-full'></input>
                                    <AddIcon sx={{ width: 30, height: 30 }}/>
                                </div>
                            </button>
                        </div>
                        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
                            <DialogTitle>Post Anything You Want</DialogTitle>
                            <DialogContent>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="title"
                                name="title"
                                label="Title"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                            <TextField
                                required
                                margin="dense"
                                id="text"
                                name="text"
                                label="Text"
                                type="text"
                                fullWidth
                                multiline
                                rows={10}
                                variant="outlined"
                                value={formData.text}
                                onChange={handleInputChange}
                                sx ={ { marginTop : "50px" ,} } 
                            />
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleSubmit}>Submit</Button>
                            </DialogActions>
                        </Dialog>

                    </div>
                </div>
            </div>

        )}
        </div>
    )
}