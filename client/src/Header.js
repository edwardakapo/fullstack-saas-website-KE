import React, {useState, useEffect} from 'react'
import SearchIcon from '@mui/icons-material/Search';
import LoginButton from './LoginButton';
import { styled } from '@mui/system';
import Avatar from '@mui/material/Avatar';
import Logo from './logo.png';
import Cookies from 'js-cookie';
import AccountMenuAvatar from './AccountMenuAvatar';



export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    let userPic = ""

    if (Cookies.get('userInfo')) {
        userPic = JSON.parse(Cookies.get('userInfo')).picture; // parse the user cookie
    }
    useEffect(() => {
        const loggedIn = Cookies.get('isLoggedIn') === 'True'; // check if isLoggedIn cookie exists and is 'true'
        setIsLoggedIn(loggedIn); // set the state
    }, []);

    return (
        <header className="flex w-full p-2 justify-between mx-1">
            <div className='py-5 '>
                <h1 className="text-5xl font-extrabold">DevHelp</h1>
            </div>
            <form action="" className="flex bg-gray-100 my-3 py-4 px-7 space-x-2 h-1/2 w-1/2 border-solid border-4 border-black rounded-full hover:border-hover-blue">
                <SearchIcon fontSize='large' />
                <input type="text" className="bg-gray-100 h-8 text-xl outline-none" placeholder="Search DevHelp" />
            </form>
            {isLoggedIn ? (
                <AccountMenuAvatar src={userPic} sx={{ width: 80, height: 80 }} />
            ) : (
                <LoginButton/>
            )}
        </header>
    )
}
