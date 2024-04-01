import React from 'react';
import PostCards from './PostCards';

export default function Posts(props) {
const postData = props.posts
const addDeleteButton = props.addDelete || false
const addUnsaveButton = props.addUnsave || false
const addSaveButton = props.addSave || false

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
        isDelete={addDeleteButton}
        isUnsave={addUnsaveButton}
        isSave={addSaveButton}
        />
      ))}
    </div>
  );
}