import React, { useState } from 'react';
import Card from '@mui/material/Card';
import { Button, CardActions, Avatar, TextField  } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Comments from './Comments';
import AddCommentModal from './AddCommentModal';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the delete icon
import axios from 'axios';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import Cookies from 'js-cookie';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { toast } from 'react-toastify';


export default function PostCards(props) {
    // State to track if the icon is filled
    const [isSaved, setIsSaved] = useState(false);
    const [userLikeAction, setUserLikeAction] = useState(null); // 'liked', 'disliked', or null
    const [score, setScore] = useState(props.likes); // Assuming initialScore is passed as a prop
    const [isOpen, setIsOpen] = useState(false);
    const [commentUpdateTrigger, setCommentUpdateTrigger] = useState(false);

    const toggleComments = () => {
      setIsOpen(!isOpen)
    }
    const checkLoggedIn = () =>{
         return Cookies.get('isLoggedIn') ? true : false;
    }
    const doLike = () => {
      if (!checkLoggedIn()){
        alert("you need to login");
        return
      }
      if (userLikeAction !== 'liked') {
            // If previously disliked, increment score by 2 to negate the dislike and add a like
            // Otherwise, just add 1 to the score
            setScore(userLikeAction === 'disliked' ? score + 2 : score + 1);
            setUserLikeAction('liked');
            
        }

    };
    
    const doDislike = () => {
      if (!checkLoggedIn()){
        alert("you need to login");
        return
      }
        if (userLikeAction !== 'disliked') {
            // If previously liked, decrement score by 2 to negate the like and add a dislike
            // Otherwise, just subtract 1 from the score
            setScore(userLikeAction === 'liked' ? score - 2 : score - 1);
            setUserLikeAction('disliked');
        }
    };

    // Function to toggle the state
    const toggleFill = () => {
      if (!checkLoggedIn()){
        alert("you need to login");
        return
      }
      // Decide to save or unsave based on the current state, then toggle
      if (isSaved) {
        unsavePost();
      } else {
        savePost();
      }
      setIsSaved(!isSaved); // Toggle the state after deciding the action
    };
  
    const savePost = () => {
      axios.patch(`http://localhost:3000/post/${props.id}/save`, {} , { withCredentials : true })
        .then((response) => {
          console.log("saving", response);
        })
        .catch((error) => {
          console.error('Error saving post', error);
        });
    };
  
    const unsavePost = () => {
      axios.patch(`http://localhost:3000/post/${props.id}/unsave`, {} , { withCredentials : true })
        .then((response) => {
          console.log("unsaving", response);
        })
        .catch((error) => {
          console.error('Error unsaving post', error);
        });
      };
/*
    const postId = props.id
    const saveToStorage = () =>{
      let postState = {
        isLiked : userLikeAction,
        isSaved : isSaved
      };
      localStorage.setItem(postId, JSON.stringify(postState))
    }

    const loadFromStorage = () => {
      try {
        const savedState = JSON.parse(localStorage.getItem(postId));
        if (!savedState) {
          return null; // Or return {} depending on your needs
        }
        return savedState;
      } catch (error) {
        console.error('Error loading state from localStorage:', error);
        return null; // Or return {} depending on your needs
      }
    }
*/
const [comment, setComment] = useState('');

const handleCommentChange = (event) => {
  setComment(event.target.value);
};

const handleSubmit = (event) => {
  event.preventDefault(); // Prevent the default form submit action
  console.log('Comment submitted:', comment);
  const text = comment
  axios.patch(`http://localhost:3000/post/${props.id}/comment`, { text }, {withCredentials : true})
  .then((response) => {
    console.log(response.data);
    toast.success("Comment Added!")
    setComment('');
    setCommentUpdateTrigger(prev => !prev); // Toggle the trigger to force re-fetch
  })
  .catch((error) => {
    toast.error("Comment Not Added!")
    console.error('Error adding comment:', error);
  });
  // Add additional submit logic here
};
return (
    <Card  className="mx-auto" sx={{ mb :10 , borderRadius: 10, p:2, maxWidth: 900}}>
          <div className=' flex ' >
            <div className=' items-start'>

              {props.isDelete && (
                    <Button size="large" sx={{p:3}} onClick={() => {
                      axios.delete(`http://localhost:3000/post/${props.id}/delete`, {withCredentials : true})
                      .then((response) => {
                        console.log("deleting", response)
                        window.location.reload();
                      })
                      .catch((error) => {
                        console.error('Error deleting posts' , error)
                      })
                      }}>
                      <DeleteIcon sx={{ fontSize: 40 }}  />
                    </Button>
                  )}
                {props.isUnsave && (
                  <Button size="large" sx={{p:3}} onClick={() => {
                      axios.patch(`http://localhost:3000/post/${props.id}/unsave`, {} , {withCredentials : true})
                      .then((response) => {
                        console.log("unsaving", response)
                        window.location.reload();
                      })
                      .catch((error) => {
                        console.error('Error unsaving posts' , error)
                      })
                      }}>
                      <TurnedInIcon sx={{ fontSize: 40 }}  />
                    </Button>
                  )}
                
            </div>
            <div className='grow m-4'>
              <div  className="cursor-pointer hover:bg-gray-100 focus:bg-gray-200" onClick={toggleComments}>
                <div className='flex items-center space-x-2 mb-1'>
                  <Avatar src='put user avater here' sx={{ width: 30, height: 30 }}></Avatar>
                  <p>Posted by u/ {props.userName}</p>
                </div>
                  <h1 className=' text-2xl font-bold mb-5'> {props.title}</h1>
                  <p className='text-base mb-10'> {props.text}</p>
              </div>
                {isOpen && (
                  <form onSubmit={handleSubmit}>
                    <div className='w-2/3 flex flex-col mb-20'>
                          <div className='mb-1'>
                            <TextField
                                autoFocus
                                required
                                multiline
                                fullWidth
                                rows={3}
                                name="comment"
                                placeholder="Add a comment"
                                value={comment}
                                onChange={handleCommentChange}

                            />
                          </div>
                          <div className=' flex justify-end'>
                            <Button type='submit' variant="contained" >Add Comment</Button>
                          </div>
                    </div>
                    
                    <div className='mb-20 overflow-auto max-h-64'>
                      <Comments isUserPost={props.isUserProfile} postId={props.id} trigger={commentUpdateTrigger}/>
                    </div>
                  </form>
                )}

                <div className='flex space-x-1'>
                  <div className='flex items-center'>

                    <Button size="large" color="secondary" onClick={doLike}>
                      <ThumbUpIcon  sx={{ fontSize: 25 }}/> 
                    </Button>
                    <div className='text-md font-semibold'>
                          {score}
                    </div>
                    <Button size="large" color="primary" onClick={doDislike} >
                      <ThumbDownIcon sx={{ fontSize: 25 }} /> 
                    </Button>
                  
                    <Button className='' color='secondary' onClick={toggleComments}>
                      <AddCommentIcon sx={{ fontSize: 25 }} />   
                      <div className='text-md font-semibold ml-2'>
                        {props.numberOfComments}
                      </div>
                    </Button>

                  </div>
                  {
                  //<AddCommentModal postId={props.id} amount={props.numberOfComments} styles={{ fontSize: 25 }} logInCheck={checkLoggedIn}/>
                  }
                  {!props.isUnsave && (
                    <Button onClick={toggleFill}>
                      {isSaved ? (
                        <TurnedInIcon sx={{ fontSize: 25 }} />
                      ) : (
                        <TurnedInNotIcon sx={{ fontSize: 25 }} />
                        )}
                    </Button>
                  )}
                </div>

            </div>
    </div>
        </Card>
  );
}