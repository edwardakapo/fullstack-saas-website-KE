import React, {useState, useEffect} from 'react'
import SearchIcon from '@mui/icons-material/Search';
import LoginButton from './LoginButton';
import { styled } from '@mui/system';
import Cookies from 'js-cookie';
import AccountMenuAvatar from './AccountMenuAvatar';
import { useNavigate } from 'react-router-dom';



export default function Header() {
  const navigate = useNavigate();

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
        <header className="flex md:w-full w-full md:p-2 p-1 px-2 md:mx-1 justify-between items-center ">
            <button onClick={() => navigate('/')}>
                <h1 className="md:text-3xl text-lg font-extrabold">DevHelp</h1>
            </button>
            <form action="" className="flex items-center bg-gray-100 md:py-2 py-0.5 md:px-3 md:space-x-2 space-x-1 md:h-1/2 md:w-1/2 w-1/2 border-solid md:border-2 border border-black rounded-full hover:border-hover-blue">
                <SearchIcon fontSize='icon-small' />
                <input type="text" className="bg-gray-100 outline-none text-sm" placeholder="Search DevHelp" />
            </form>
            {isLoggedIn ? (
                <AccountMenuAvatar src={userPic} />
            ) : (
                <LoginButton />
            )}
        </header>
    )
}
