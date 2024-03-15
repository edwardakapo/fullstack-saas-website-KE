import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostCards from './PostCards';

export default function Posts(props) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/post', {withCredentials : true})
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  return (
    <div className="background-black">
      {posts.map((post) => (
        <PostCards 
        key={post._id}
        userName={post.author} 
        id={post._id} 
        title={post.title} 
        text ={post.body}
        numberOfComments={post.numberOfComments}
        numberOfLikes={post.numberOfLikes}
        numberOfDislikes={post.numberOfDislikes}
        />
      ))}
    </div>
  );
}