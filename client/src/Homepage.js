import React , {useState, useEffect} from 'react';
import HeroSection from './HeroSection';
import Posts from './Posts'
import axios from 'axios';


export default function Homepage() {
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
    <div className=' flex-col space-y-32'>
        <HeroSection />
        <Posts posts={posts}/>
    </div>
    )
}