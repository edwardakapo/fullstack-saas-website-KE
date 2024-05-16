import React from 'react';
import PostCards from './PostCards';

export default function Posts(props) {
const postData = props.posts


  return (
    <div className="background-black">
      {postData.map((post) => (
        <PostCards
        maxWidth={200} 
        key={post._id}
        userName={post.author} 
        id={post._id} 
        title={post.title} 
        text ={post.body}
        numberOfComments={post.numberOfComments}
        likes={post.numberOfLikes - post.numberOfDislikes}
        isDelete={props.addDelete || false}
        isUnsave={props.addUnsave || false}
        isSave={props.addSave || false}
        isUserProfile={props.addStar || false}
        />
      ))}
    </div>
  );
}