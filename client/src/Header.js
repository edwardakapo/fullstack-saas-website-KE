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

    useEffect(() => {
        //const loggedIn = Cookies.get('isLoggedIn'); // get the value from the cookie
        const loggedIn = "false";
        setIsLoggedIn(loggedIn === 'true'); // set the state
    }, []);

    return (
        <header className="flex w-full p-2 justify-between mx-1">
            <img src={Logo} alt="" className="w-20 h-20 m-2" />
            <form action="" className="flex bg-gray-200 my-3 py-4 px-7 space-x-2 h-1/2 w-1/2 border-solid border-4 border-black rounded-full hover:border-hover-blue">
                <SearchIcon fontSize='large' />
                <input type="text" className="bg-gray-200 h-8 text-xl outline-none" placeholder="Search DevHelp" />
            </form>
            {isLoggedIn ? (
                <AccountMenuAvatar src="fill in" sx={{ width: 80, height: 80 }} />
            ) : (
                <LoginButton/>
            )}
        </header>
    )
}
