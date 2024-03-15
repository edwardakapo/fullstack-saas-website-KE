import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentsModal from './CommentsModal';
import AddCommentModal from './AddCommentModal';

export default function PostCards(props) {
  return (
    <div  className={props.styles}>
        <Card sx={{ maxWidth : props.maxWidth, maxHeight:props.maxHeight, mb :10 , borderRadius: 10, p:2}}>
        <CommentsModal postId={props.id} userName={props.userName} title={props.title} text={props.text}/>
        <CardActions>
            <Button size="small" color="secondary">
            <ThumbUpIcon /> {props.numberOfLikes}
            </Button>
            <Button size="small" color="primary">
            <ThumbDownIcon /> {props.numberOfDislikes}
            </Button>
            <AddCommentModal postId={props.id} amount={props.numberOfComments}/>
        </CardActions>
        </Card>
    </div>
  );
}