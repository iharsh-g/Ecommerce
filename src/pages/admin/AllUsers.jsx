import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser, fetchUsers } from '../../redux/services/operations/adminApi';
import Sidebar from '../../components/Admin/Sidebar';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import TreeView from '@mui/lab/TreeView/TreeView';
import TreeItem from '@mui/lab/TreeItem/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { RiDeleteBin4Fill } from 'react-icons/ri';
import Loader from '../../components/Loader';

function AllUsers() {
    const navigate = useNavigate();
    const {userDetails} = useSelector((state) => state.user);
    const {token} = useSelector((state) => state.auth);
    const {allUsers, loading} = useSelector((state) => state.admin);
    const dispatch = useDispatch();

    // Dialog
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');

    useEffect(() => {
        if(!token) {
            navigate("/login");
        }

        if(token && userDetails && userDetails?.role !== "Admin") {
            navigate("/account");
        }

        dispatch(fetchUsers(token));
    }, [userDetails]);

    // console.log(allUsers);

    function updateUserHandler(id) {
        navigate(`/admin/user/${id}`);
    }

    // When admin click on the delete icon
    function deleteUserIconHandler(id) {
        setOpen(true);
        setDeleteId(id);
    }

    // When admin click outside the dialog Box or Cancel 
    function handlerClose() {
        setOpen(false);
    }

    // When admin click in the dialog box to delete
    async function deleteUserHandler() {
        setOpen(false);
        await dispatch(deleteUser(deleteId, navigate, token))
        dispatch(fetchUsers(token));
    }

    return (
        <div>
            {
                loading ? <div className='min-h-[calc(100vh-235px)] flex items-center justify-center'><Loader/></div> :
                allUsers?.length === 0 ? <div>No Users</div> : 
                <div className='flex min-h-[73vh] gap-10 min-[1080px]:flex-row flex-col'>
                    <div>
                        <div className='min-[1080px]:block hidden h-full'>
                            <Sidebar/>
                        </div>
                    </div>

                    <div className='w-full'>
                        <div className='flex flex-col items-center justify-center py-5 max-w-[1200px] px-3'>
                            <p className='text-4xl font-bold'>Users</p>

                            <div className='mt-10 flex flex-col w-full sm:border-none border border-black py-5 border-opacity-50 rounded-xl'>
                                
                                <div className='items-center py-2 justify-between font-bold text-xl bg-amber-400 px-16 sm:flex hidden'>
                                    <div className='flex gap-28'>
                                        <p className='w-[200px] lg:block hidden'>User ID</p>
                                        <p className=''>Name</p>
                                    </div>

                                    <div className='flex gap-28'>
                                        <p>Email</p>
                                        <p className='sm:w-[60px]'>Role</p>
                                    </div>
                                </div>

                                {
                                    allUsers && allUsers.map((user) => (
                                        <div key={user._id}>
                                            
                                            {/* WHen the screen is larger than 640px this div is visible */}
                                            <div className='items-center py-2 justify-between font-bold px-5 sm:flex hidden'>
                                                <div className='flex gap-5 items-center'>
                                                    <HiOutlinePencilAlt fontSize={'1.3rem'} onClick={() => updateUserHandler(user._id)}
                                                    className={`cursor-pointer hover:text-red-400 transition-all duration-200 ease-in-out ${userDetails?._id === user?._id ? 'invisible' : 'visible'}`}/>
                                                    
                                                    <p className='w-[200px]  lg:block hidden'>{user._id}</p>
                                                    
                                                    <p className='font-semibold  lg:ml-20'>{user.name}</p>
                                                </div>

                                                <div className='flex gap-10 items-center'>
                                                    <p>{user.email}</p>
                                                    <p className={`${user.role === "Admin" ? 'text-green-700' : 'text-red-500'}`}>{user.role}</p>
                                                    <RiDeleteBin4Fill fontSize={'1.3rem'} className={`cursor-pointer hover:text-red-400 transition-all duration-200 ease-in-out ${userDetails?._id === user?._id ? 'invisible' : 'visible'}`} onClick={() => deleteUserIconHandler(user._id)}/>
                                                </div>
                                            </div>

                                            {/* WHen the screen less that 640px this div is visible */}
                                            <div className='sm:hidden w-full flex items-center justify-center mt-2'>
                                                <TreeView aria-label="file system navigator" defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
                                                    <TreeItem nodeId="1" label={ 
                                                        <div className='font-bold text-lg flex min-[420px]:w-[300px] items-center justify-between min-[420px]:gap-10'>
                                                            <div>{user.name}</div>
                                                            <div className='flex gap-3'>
                                                                <HiOutlinePencilAlt fontSize={'1.3rem'} onClick={() => updateUserHandler(user._id)} className={`cursor-pointer hover:text-red-400 transition-all duration-200 ease-in-out ${userDetails?._id === user?._id ? 'invisible' : 'visible'}`}/>
                                                                <RiDeleteBin4Fill fontSize={'1.3rem'} onClick={() => deleteUserIconHandler(user._id)} className={`cursor-pointer hover:text-red-400 transition-all duration-200 ease-in-out ${userDetails?._id === user?._id ? 'invisible' : 'visible'}`}/>
                                                            </div>
                                                        </div>
                                                    }>
                                                        <div className='flex flex-col'>
                                                            <TreeItem nodeId='2' label={<div className=' font-bold'>{user.email}</div>}/>
                                                            <TreeItem nodeId='3' label={<div className={`${user.role === "Admin" ? 'text-cyan-700' : 'text-red-500'} font-bold`}>{user.role}</div>}/>
                                                        </div>
                                                    </TreeItem>
                                                </TreeView>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    {/* Dialog Box for Delete */}
                    <Dialog open={open} onClose={handlerClose}>
                        <DialogTitle>Delete User!</DialogTitle>

                        <DialogContent>Do you want to delete this user?</DialogContent>

                        <DialogActions>
                            <Button onClick={handlerClose}>Cancel</Button>
                            <Button onClick={deleteUserHandler}>Delete</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            }
        </div>
    )
}

export default AllUsers