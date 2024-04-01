import React, { useState } from 'react';
import Card from '@mui/material/Card';
import { Button, CardActions } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentsModal from './CommentsModal';
import AddCommentModal from './AddCommentModal';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the delete icon
import axios from 'axios';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import Cookies from 'js-cookie';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';

export default function PostCards(props) {
    // State to track if the icon is filled
    const [isSaved, setIsSaved] = useState(false);
    const [userLikeAction, setUserLikeAction] = useState(null); // 'liked', 'disliked', or null
    const [score, setScore] = useState(props.likes); // Assuming initialScore is passed as a prop
    
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

  return (
    <Card sx={{ mb :10 , borderRadius: 10, p:2}}>
          <div className='flex items-center' >
            <div>

              {props.isDelete && (
                    <Button size="large" sx={{p:6}} onClick={() => {
                      axios.delete(`http://localhost:3000/post/${props.id}/delete`, {withCredentials : true})
                      .then((response) => {
                        console.log("deleting", response)
                        window.location.reload();
                      })
                      .catch((error) => {
                        console.error('Error deleting posts' , error)
                      })
                      }}>
                      <DeleteIcon sx={{ fontSize: 60 }}  />
                    </Button>
                  )}
                {props.isUnsave && (
                  <Button size="large" sx={{p:6}} onClick={() => {
                      axios.patch(`http://localhost:3000/post/${props.id}/unsave`, {} , {withCredentials : true})
                      .then((response) => {
                        console.log("unsaving", response)
                        window.location.reload();
                      })
                      .catch((error) => {
                        console.error('Error unsaving posts' , error)
                      })
                      }}>
                      <TurnedInIcon sx={{ fontSize: 60 }}  />
                    </Button>
                  )}
                
            </div>
            <div className='grow'>

                <CommentsModal maxWidth={props.maxWidth} postId={props.id} userName={props.userName} title={props.title} text={props.text} />
                <div className='flex space-x-5'>
                  <div className='flex space-x-1 items-center'>

                    <Button size="large" color="secondary" onClick={doLike}>
                      <ThumbUpIcon  sx={{ fontSize: 40 }}/> 
                    </Button>
                    <div className='text-2xl font-bold px-2'>
                          {score}
                    </div>
                    <Button size="large" color="primary" onClick={doDislike} >
                      <ThumbDownIcon sx={{ fontSize: 40 }} /> 
                    </Button>
                  </div>
                  <AddCommentModal postId={props.id} amount={props.numberOfComments} styles={{ fontSize: 40 }} logInCheck={checkLoggedIn}/>
                  {!props.isUnsave && (
                    <Button onClick={toggleFill}>
                      {isSaved ? (
                        <TurnedInIcon sx={{ fontSize: 40 }} />
                      ) : (
                        <TurnedInNotIcon sx={{ fontSize: 40 }} />
                        )}
                    </Button>
                  )}
                </div>
            </div>
    </div>
        </Card>
  );
}