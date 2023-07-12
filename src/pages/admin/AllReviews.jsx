import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteReview, fetchReviews } from '../../redux/services/operations/adminApi';
import Sidebar from '../../components/Admin/Sidebar';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import TreeView from '@mui/lab/TreeView/TreeView';
import TreeItem from '@mui/lab/TreeItem/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { RiDeleteBin4Fill } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import Loader from '../../components/Loader';

function AllReviews() {
    const navigate = useNavigate();
    const {userDetails} = useSelector((state) => state.user);
    const {token} = useSelector((state) => state.auth);
    const {allReviews, loading} = useSelector((state) => state.admin);
    const dispatch = useDispatch();

    const [productId, setProductId] = useState('');
    const [reviewId, setReviewId] = useState('');

    // Dialog
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(!token) {
            navigate("/login");
        }

        if(token && userDetails && userDetails?.role !== "Admin") {
            navigate("/account");
        }
    }, [userDetails]);

    function reviewFindHandler() {
        if(productId.length !== 24) {
            toast.error("Invalid Product Id");
            return;
        }
        
        dispatch(fetchReviews(productId, token));
    }

    // When admin click on the delete icon
    function deleteReviewIconHandler(id) {
        setOpen(true);
        setReviewId(id);
    }

    // When admin click outside the dialog Box or Cancel 
    function handlerClose() {
        setOpen(false);
    }

    // When admin click in the dialog box to delete
    async function deleteReviewHandler() {
        if(productId.length !== 24) {
            toast.error("Invalid Product Id");
            setOpen(false);
            return;
        }

        setOpen(false);
        await dispatch(deleteReview(productId, reviewId, navigate, token))
        dispatch(fetchReviews(productId, token));
    }

    return (
        <div>
            <div className='flex min-h-[73vh] gap-10 min-[1080px]:flex-row flex-col'>
                <div>
                    <div className='min-[1080px]:block hidden h-full'>
                        <Sidebar/>
                    </div>
                </div>

                <div className='w-full'>
                    <div className='max-w-[1200px] flex flex-col items-center justify-center px-3'>
                        <p className='text-4xl font-bold mb-5'>Reviews</p>
                        
                        <div className='flex flex-col items-center sm:w-[350px] w-full py-5 bg-neutral-800 rounded-xl'>
                            <div>
                                <label htmlFor='id' className='text-lg font-semibold text-white'>Product Id: </label>
                                <input id='id' className='sm:w-[200px] w-[150px] px-5 py-2 rounded-md' value={productId} onChange={(e) => setProductId(e.target.value)} placeholder='Enter Product Id' type='text'/>
                            </div>

                            <div className='mt-10 bg-red-600 text-white font-semibold px-7 py-3 rounded-lg cursor-pointer
                            hover:bg-red-500 transition-all duration-200 ease-in hover:scale-105 flex gap-3 items-center' onClick={reviewFindHandler}>
                                Find Review
                            </div>
                        </div>

                        {
                            loading ? <div className='min-h-[200px] flex items-center justify-center'><Loader/></div> :
                            allReviews &&
                            <div className='mt-10 flex flex-col w-full sm:border-none border border-black py-5 border-opacity-50 rounded-xl mb-2'>
                                <div className='items-center py-2 justify-between font-bold text-xl bg-amber-400 pl-10 pr-28 sm:flex hidden'>
                                    <div className='flex gap-10'>
                                        <p className='lg:w-[200px] lg:block hidden'>Review ID</p>
                                        <p className=''>Name</p>
                                    </div>

                                    <div className='flex gap-28'>
                                        <p>Email</p>
                                        <p className='sm:w-[60px] '>Ratings</p>
                                    </div>
                                </div>
                                {
                                    allReviews && 
                                    allReviews.map((review, index) => (
                                        <div key={index}>
                            
                                            {/* WHen the screen is larger than 640px this div is visible */}
                                            <div className='items-center py-2 justify-between px-5 sm:flex hidden '>
                                                <div className='flex gap-5 items-center'>
                                                    
                                                    <p className='w-[200px]  lg:block hidden'>{review?._id}</p>
                                                    
                                                    <p className='font-semibold'>{review?.name}</p>
                                                </div>

                                                <div className='flex gap-10 items-center'>
                                                    <p>{review?.user?.email}</p>
                                                    <p className='sm:w-[60px] text-green-500 font-semibold'>{review?.rating}</p>
                                                    <RiDeleteBin4Fill fontSize={'1.3rem'} className='cursor-pointer hover:text-red-400 transition-all duration-200 ease-in-out' onClick={() => deleteReviewIconHandler(review._id)}/>
                                                </div>
                                            </div>

                                            {/* WHen the screen less that 640px this div is visible */}
                                            <div className='sm:hidden w-full flex items-center justify-center mt-2'>
                                                <TreeView aria-label="file system navigator" defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
                                                    <TreeItem nodeId="1" label={ 
                                                        <div className='font-bold text-lg flex min-[420px]:w-[300px] items-center justify-between min-[420px]:gap-10'>
                                                            <div className='min-w-[150px]'>{review?.name}</div>
                                                            <div className='flex gap-3'>
                                                                <RiDeleteBin4Fill fontSize={'1.3rem'} className='cursor-pointer hover:text-red-400 transition-all duration-200 ease-in-out' onClick={() => deleteReviewIconHandler(review._id)}/>
                                                            </div>
                                                        </div>
                                                    }>
                                                        <div className='flex flex-col'>
                                                            <TreeItem nodeId='2' label={<div className={`${review?.rating >= 4 ? 'text-green-400' : review?.rating >=2 ? 'text-yellow-400' : 'text-red-500'} text-green-500 font-semibold`}>{review?.rating}</div>}/>
                                                            <TreeItem nodeId='3' label={<div className='font-bold'>{review?.user?.email}</div>}/>
                                                        </div>
                                                    </TreeItem>
                                                </TreeView>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    
                    </div>
                </div>

                {/* Dialog Box for Delete */}
                <Dialog open={open} onClose={handlerClose}>
                    <DialogTitle>Delete Review!</DialogTitle>

                    <DialogContent>Do you want to delete this review?</DialogContent>

                    <DialogActions>
                        <Button onClick={handlerClose}>Cancel</Button>
                        <Button onClick={deleteReviewHandler}>Delete</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}

export default AllReviews