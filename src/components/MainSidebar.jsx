import React from 'react'
import { AiFillDashboard } from 'react-icons/ai'
import { RiAccountCircleFill } from 'react-icons/ri'
import { BsCartCheckFill } from 'react-icons/bs';
import { TbLogin } from 'react-icons/tb'
import { RxCross2 } from 'react-icons/rx'
import { VscSignIn, VscSignOut } from 'react-icons/vsc'
import { Link } from 'react-router-dom'
import { TreeItem, TreeView } from '@mui/lab'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const SidebarItems = [
    {
        heading: "Products", subHeading1: 'All Products', subHeading1Link: "/admin/products", 
        subHeading2: "Create Product", subHeading2Link: "/admin/product/create",
    },
    {
        heading: "Orders", link: "/admin/orders"
    },
    {
        heading: "Users", link: "/admin/users"
    },
    {
        heading: "Reviews", link: "/admin/reviews"
    },
]

function MainSidebar({setSidebar, sidebar, matchRoute, token, userDetails, logoutHandler}) {
    return (
        <div className='h-full bg-blue-900 '>
            <div>
                <div className='px-3 pb-7 pt-3 w-fit'  onClick={() => setSidebar(!sidebar)}>
                    <RxCross2 fontSize={'2rem'}/>
                </div>

                <div className='flex flex-col'>
                    <Link to={"/products"} onClick={() => setSidebar(!sidebar)}>
                        <p className={`px-4 py-2 ${matchRoute("/products") ? 
                        'bg-yellow-400 text-yellow-800 border-l-4 border-l-yellow-600' : 'text-white'} font-bold tracking-wide`}>Products</p>
                    </Link>
                    <Link to={"/about"} onClick={() => setSidebar(!sidebar)}>
                        <p className={`px-4 py-2 ${matchRoute("/about") ? 
                        'bg-yellow-400 text-yellow-800 border-l-4 border-l-yellow-600' : 'text-white'} font-bold tracking-wide`}>About</p>
                    </Link>
                    <Link to={"/contact"} onClick={() => setSidebar(!sidebar)}>
                        <p className={`px-4 py-2 ${matchRoute("/contact") ? 
                        'bg-yellow-400 text-yellow-800 border-l-4 border-l-yellow-600' : 'text-white'} font-bold  tracking-wide`}>Contact</p>
                    </Link>
                </div>

                <hr className='my-5 border-neutral-400 mx-5'/>

                {   !token && 
                    <div className='flex flex-col font-bold text-lg tracking-wide text-white'>
                        <Link to={"/login"} onClick={() => setSidebar(!sidebar)}>
                            <p className={`px-4 py-2 ${matchRoute("/login") ? 'bg-yellow-400 text-yellow-800 border-l-4 border-l-yellow-600' : ''} flex items-center gap-2`}>
                                <TbLogin/> Login
                            </p>
                        </Link>

                        <Link to={"/signup"} onClick={() => setSidebar(!sidebar)}>
                            <p className={`px-4 py-2 ${matchRoute("/signup") ? 'bg-yellow-400 text-yellow-800 border-l-4 border-l-yellow-600' : ''} flex items-center gap-2`}>
                                <VscSignIn/> Sign Up
                            </p>
                        </Link>
                    </div>
                }

                {
                    token && userDetails &&
                    <div className='flex flex-col text-white font-bold tracking-wide gap-3'>
                        <div className='flex items-center gap-3 px-4'>
                            <img className='w-[42px] h-[42px] rounded-full px-1 py-1' src={userDetails?.avatar?.url} alt={userDetails?.name}/>
                            <p className='text-lg '>{userDetails?.name}</p>
                        </div>
                            
                        <Link to={"/admin/dashboard"} className={`${userDetails?.role === "Admin" ? "block" : "hidden"} px-4 py-2 ${matchRoute("/admin/dashboard") ? 'bg-yellow-400 text-yellow-800 border-l-4 border-l-yellow-600' : ''} flex items-center gap-2`}
                        onClick={() => setSidebar(!sidebar)}>
                            <AiFillDashboard className="text-lg" /> Dashboard
                        </Link>
                        
                        {
                            userDetails?.role === "Admin" && 
                            <div className='mx-3'>
                                <hr className='border-neutral-400'/>
                                {
                                    SidebarItems.map((ele, index) => (
                                        ele.heading === "Products" ? 
                                        <div key={index} className='py-2 px-5 min-[1080px]:px-0 min-[1080px]:place-self-start place-self-center'>
                                            <TreeView aria-label="file system navigator" defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>

                                                <TreeItem nodeId="1" label={<div className='font-bold text-sm'>Products</div>}>
                                                    <div className='flex flex-col '>
                                                        <Link to={ele.subHeading1Link}>
                                                            <TreeItem nodeId="2" label={<div className={`font-bold text-xs ${matchRoute(ele.subHeading1Link) ? 'text-yellow-400' : 'text-white'}`} onClick={() => setSidebar(!sidebar)}>{ele.subHeading1}</div>} />
                                                        </Link>
                                                        <Link to={ele.subHeading2Link}>
                                                            <TreeItem nodeId="3" label={<div className={`font-bold text-xs ${matchRoute(ele.subHeading2Link) ? 'text-yellow-400' : 'text-white'}`} onClick={() => setSidebar(!sidebar)}>{ele.subHeading2}</div>} />
                                                        </Link>
                                                    </div>
                                                </TreeItem>

                                            </TreeView>
                                        </div> :
                                        <div key={index} className={`px-5 py-2 ml-5 text-sm font-bold ${matchRoute(ele.link) ? 'text-yellow-400' : 'text-white'}`}>
                                            <Link to={ele.link} onClick={() => setSidebar(!sidebar)}>{ele.heading}</Link>
                                        </div>
                                    ))
                                }

                                <hr className='border-neutral-400'/>
                            </div>
                        }

                        <Link to={"/account"} className={`flex items-center gap-2 px-4 py-2  ${matchRoute("/account") ? 'bg-yellow-400 text-yellow-800 border-l-4 border-l-yellow-600' : ''}`}
                        onClick={() => setSidebar(!sidebar)}>
                            <RiAccountCircleFill className='text-lg'/> Account 
                        </Link>

                        <Link to={"/orders"} className={`flex items-center gap-2 px-4 py-2  ${matchRoute("/orders") ? 'bg-yellow-400 text-yellow-800 border-l-4 border-l-yellow-600' : ''}`} 
                        onClick={() => setSidebar(!sidebar)}>
                            <BsCartCheckFill className="text-lg"/> Orders
                        </Link>

                        <p className='flex items-center gap-2 px-4 py-2' onClick={() => {logoutHandler(); setSidebar(!sidebar)}}><VscSignOut className="text-lg"/> Logout</p>
                    </div>
                }
            </div>
        </div>
    )
}

export default MainSidebar