import React, { useEffect, useRef, useState } from 'react'
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineBars, AiOutlineShoppingCart, AiFillDashboard } from 'react-icons/ai'
import { BsSearch } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserDetails, logoutUser } from '../redux/services/operations/authApi'
import { RiAccountCircleFill, RiSettings4Fill } from 'react-icons/ri'
import { VscSignOut } from 'react-icons/vsc';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import MainSidebar from './MainSidebar'
import { BsCartCheckFill } from 'react-icons/bs';

function Header() {
    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.auth);
    const {userDetails} = useSelector((state) => state.user);
    const {cartDetails} = useSelector((state) => state.cart);
    const [sidebar, setSidebar] = useState(false);

    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const profileRef = useRef(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside, false);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside, false);
        };
    }, []);

    const handleClickOutside = event => {
        if (profileRef.current && !profileRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        if(token) {
            dispatch(fetchUserDetails(token));
        }
    }, [token])

    const [open, setDialogOpen] = useState(false);
    function dialogClose() {
        setDialogOpen(!open);
    }

    async function logoutHandler() {
        setShowDropdown(!showDropdown);
        setDialogOpen(!open);
    }

    const location = useLocation();
    function matchRoute(route) {
        return matchPath(route, location.pathname)
    }

    return (
        <div className='w-full h-[70px] min-[1080px]:flex-row flex-row-reverse flex justify-between sm:px-10 px-3 py-2 items-center bg-blue-900 text-blue-50'>
            <div>
                <Link to={"/"}>
                    <p className='text-4xl font-semibold'>Ecommerce</p>
                </Link>
            </div>

            <div className='min-[1080px]:flex gap-7 hidden text-xl tracking-wide font-semibold'>
                <Link to={"/products"}>
                    <p className={`px-3 py-5 ${matchRoute("/products") ? 'text-yellow-400 border-b-4 border-yellow-400' : 'text-white'} pb-[20px] hover:border-b-4 hover:text-yellow-400 hover:border-yellow-400 duration-200 transition-all`}>Products</p>
                </Link>
                <Link to={"/about"}>
                    <p className={`px-3 py-5 ${matchRoute("/about") ? 'text-yellow-400 border-b-4 border-yellow-400' : 'text-white'} pb-[20px] hover:border-b-4 hover:text-yellow-400 hover:border-yellow-400 duration-200 transition-all`}>About</p>
                </Link>
                <Link to={"/contact"}>
                    <p className={`px-3 py-5 ${matchRoute("/contact") ? 'text-yellow-400 border-b-4 border-yellow-400' : 'text-white'} pb-[20px] hover:border-b-4 hover:text-yellow-400 hover:border-yellow-400 duration-200 transition-all`}>Contact</p>
                </Link>
            </div>

            <div className='min-[1080px]:flex gap-2 hidden items-center'>
                <Link to={"/search"}>
                    <BsSearch fontSize={'1.5rem'} className={`mr-4 cursor-pointer  ${matchRoute("/search") ? 'text-yellow-300' : 'text-white'} hover:text-yellow-300 transition-all duration-200`}/>
                </Link> 

                {
                    !token && 
                    (<div className='flex'>
                        <Link to={"/login"}>
                            <p className={`text-lg font-semibold px-3 py-1 ${matchRoute("/login") ? 'text-yellow-300' : 'text-white'} hover:text-yellow-300 duration-200 transition-all ease-in`}>Login</p>
                        </Link>
                        <Link to={"/signup"}>
                            <p className={`text-lg font-semibold px-3 py-1 ${matchRoute("/signup") ? 'text-yellow-300' : 'text-white'} hover:text-yellow-300 duration-200 transition-all ease-in`}>Sign Up</p>
                        </Link>
                    </div>)
                }

                {
                    token && userDetails &&
                    <div className='flex items-center gap-4'>
                        <div className='relative'>
                            <Link to={"/cart"}>
                                <AiOutlineShoppingCart fontSize="1.5rem" className={`text-blue-50 ${matchRoute("/cart") ? 'text-yellow-400' : 'text-white'}`}/>
                                {
                                    cartDetails && cartDetails.length > 0 &&
                                    <span className='absolute -top-1 -right-2 bg-green-400 text-xs w-5 h-5
                                    flex justify-center items-center animate-bounce rounded-full text-white'>{cartDetails.length}</span>
                                }
                            </Link>
                        </div>

                        <div>
                            <img className='w-[42px] h-[42px] rounded-full cursor-pointer px-1 py-1' src={userDetails?.avatar?.url} alt='' onClick={() => setShowDropdown(!showDropdown)}/>
                        </div>
                    </div>
                    
                }

                {
                    showDropdown && 
                    <div className="flex flex-col absolute top-14 right-10 bg-neutral-600 rounded-lg z-10" ref={profileRef}>
                        {
                            userDetails &&
                            <Link to={"/admin/dashboard"} className={`${userDetails.role === "Admin" ? "block" : "hidden"}
                             hover:bg-neutral-400 rounded-t-lg pl-3 pr-5 py-2 flex items-center gap-2`}  onClick={() => setShowDropdown(!showDropdown)}><AiFillDashboard className="text-lg"/> Dashboard</Link>
                        }
                        <Link to={"/account"} className={`${userDetails.role === "Admin" ? "rounded-t-none" : "rounded-t-lg"} hover:bg-neutral-400 pl-3 pr-5 py-2 flex items-center gap-2`} onClick={() => setShowDropdown(!showDropdown)} > <RiAccountCircleFill className='text-lg'/> Account </Link>
                        <Link to={"/orders"} className='hover:bg-neutral-400  pl-3 pr-5  py-2 flex items-center gap-2' onClick={() => setShowDropdown(!showDropdown)} > <BsCartCheckFill className="text-lg"/> Orders</Link>
                        <p onClick={logoutHandler} className='cursor-pointer hover:bg-neutral-400  pl-3 pr-5 rounded-b-lg py-2 flex items-center gap-2'><VscSignOut className="text-lg"/> Logout</p>
                    </div>
                }
                
            </div>

            <div className='block min-[1080px]:hidden'>
                <AiOutlineBars fontSize={'2rem'} onClick={() => setSidebar(!sidebar)}/>

                <div className={`z-[30] fixed top-0 left-0 bottom-0 w-[250px] bg-blue-700 transition-all duration-300 ease-in-out transform ${sidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                    <MainSidebar setSidebar={setSidebar} sidebar = {sidebar} matchRoute={matchRoute} token = {token} userDetails = {userDetails} logoutHandler={logoutHandler}/>
                </div>

                <div className={`${sidebar ? 'visible' : 'hidden'} fixed inset-0 backdrop-blur-sm z-[20]`} onClick={() => setSidebar(!sidebar)}></div>
            </div>

            <Dialog open={open} onClose={dialogClose} className={`${open ? 'backdrop-blur-sm' : 'backdrop-blur-none'}`}>
                <DialogTitle fontWeight={600}>Are you sure?</DialogTitle>

                <DialogContent className='flex flex-col items-center'>
                    <p>You will get logout from your account.</p>
                </DialogContent>

                <DialogActions>
                    <Button onClick={dialogClose}>Cancel</Button>
                    <Button onClick={() => {dispatch(logoutUser(token, navigate)) 
                        setDialogOpen(!open);
                    }}>Logout</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Header