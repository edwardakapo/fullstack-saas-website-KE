import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Skeleton} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

export default function Comments(props) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [triggerReload, setTriggerReload] = useState(false);
  const [correctPost, setCorrectPost] = useState([]);
  const [starredCommentId, setStarredCommentId] = useState(null);


  /* useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3000/post/${props.postId}/comments`, { withCredentials: true })
      .then((response) => {
        setComments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
        setLoading(false);
      });
  }, [props.postId]);  // Dependency array to refetch when postId changes
*/

useEffect(() => {
  setLoading(true);
  const timer = setTimeout(() => {
    axios.get(`http://localhost:3000/post/${props.postId}/comments`, { withCredentials: true })
      .then((response) => {
        setComments(response.data.comments);
        setCorrectPost(response.data.correctPost)
        if (response.data.correctPost) {  // Check if correctPost exists
          setStarredCommentId(response.data.correctPost._id);
        }
        console.log(correctPost)
        setLoading(false);

      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
        setLoading(false);
      });
  }, 100);  // Delay the request by 5000 milliseconds (5 seconds)

    return () => clearTimeout(timer);
  }, [props.postId, props.trigger, triggerReload]); 

  function starPost(commentId) {
    axios.patch(`http://localhost:3000/post/${props.postId}/comments/${commentId}/setcorrect`, {} , { withCredentials: true })
    .then((response) => {
          console.log(response.data)
          setTriggerReload(prev => !prev);  // Toggle the trigger to force reload
          setStarredCommentId(response.data._id);  // Update the starred comment ID
          })
    .catch((error) => {
            console.error('Error starring comments', error)
          })
    }
  

  if (loading) {
    return <div className="flex flex-col p-1 space-y-5">
              <div className='space-y-1'>
                <Skeleton variant="circular" width={60} height={60} />
                <Skeleton variant="rounded" width={610} height={80} />
              </div>
              <div className='space-y-1'>
                <Skeleton variant="circular" width={60} height={60} />
                <Skeleton variant="rounded" width={610} height={80} />
              </div>
            </div>;
  }

  return (
    <div>
      <div>
        
        {correctPost && (
          <div className='mb-10'> 
              <h1 className=' font-semibold text-lg'> Users Selected Solution </h1>
                  <div className='py-2 bg-yellow-50 rounded'>
                <div className='mb-5 flex w-full items-baseline'>
                <div className='w-5/6'>
                  <div className='flex space-x-2 items-center'>
                    <Avatar src='put user avater here' sx={{ width: 40, height: 40 }}/> 
                    <h1 className='text-md font-semibold'>{correctPost.username || "Deleted-User"}</h1> 
                  </div>
                  <p className='pl-12 text-sm w-4/5'>{correctPost.text || "No comment text available"}</p>
                </div>
              {// only show star if its the users post so they can choose the correct answer
                props.isUserPost && (
                  <button onClick={ (e) => {
                    e.preventDefault();
                    e.stopPropagation(); 
                    starPost(correctPost._id) }}>
                  {!(starredCommentId === correctPost._id) ? (
                    <StarOutlineIcon style={{ color : 'gold' }}/>
                  ) : (
                      <StarIcon  style={{ color : 'gold' }}/>
                  )}
                  </button>
              )}
                {!props.isUserPost && (
                  <StarIcon style={{ color : 'gold' }}/>
                )}
              </div>
          </div>

          </div>
        )
        }
      
      </div>
      {comments.length > 0 ? comments.map((comment, index) => (
        <div key={index} className='mb-5 flex w-full items-baseline'>
          <div className='w-5/6'>
            <div className='flex space-x-2 items-center'>
              <Avatar src='put user avater here' sx={{ width: 40, height: 40 }}/> {/* If you have user data, you can use <Avatar src={comment.userImage} /> */}
              <h1 className='text-md font-semibold'>{comment.username || "Deleted-User"}</h1> {/* Fallback if username is not available */}
            </div>
            <p className='pl-12 text-sm w-4/5'>{comment.text || "No comment text available"}</p>
          </div>
            {// only show star if its the users post so they can choose the correct answer
              props.isUserPost && (
                <button onClick={ (e) => {
                  e.preventDefault();
                  e.stopPropagation(); 
                  starPost(comment._id) }}>
                {!(starredCommentId === comment._id) ? (
                  <StarOutlineIcon  style={{ color : 'gold' }}/>
                ) : (
                    <StarIcon style={{ color : 'gold' }} />
                )}
                </button>
            )}
        </div>
      )) : <p>Be the first to leave a comment!</p>}
    </div>
  );
}