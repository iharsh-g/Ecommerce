import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteOrder, fetchOrders } from '../../redux/services/operations/adminApi';
import Sidebar from '../../components/Admin/Sidebar';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { RiDeleteBin4Fill } from 'react-icons/ri';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import TreeView from '@mui/lab/TreeView/TreeView';
import TreeItem from '@mui/lab/TreeItem/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Loader from '../../components/Loader';

function AdminOrders() {
    
    const navigate = useNavigate();
    const {userDetails} = useSelector((state) => state.user);
    const {token} = useSelector((state) => state.auth);
    const {allOrders, loading} = useSelector((state) => state.admin);
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

        dispatch(fetchOrders());
    }, [userDetails]);

    function updateOrderHandler(id) {
        navigate(`/admin/order/${id}`);
    }

    // When admin click on the delete icon
    function deleteOrderIconHandler(id) {
        setOpen(true);
        setDeleteId(id);
    }

    // When admin click outside the dialog Box or Cancel 
    function handlerClose() {
        setOpen(false);
    }

    // When admin click in the dialog box to delete
    async function deleteOrderHandler() {
        setOpen(false);
        await dispatch(deleteOrder(deleteId, navigate))
        dispatch(fetchOrders());
    }
  
    return (
        <div>
            {
                loading ? <div className='min-h-[calc(100vh-235px)] flex items-center justify-center'><Loader/></div> :
                allOrders && 
                <div className='flex min-h-[73vh] gap-10 min-[1080px]:flex-row flex-col'>
                    <div>
                        <div className='min-[1080px]:block hidden h-full'>
                            <Sidebar/>
                        </div>
                    </div>

                    <div className='w-full'>
                        <div className='flex flex-col items-center justify-center py-5 max-w-[1200px] px-3'>
                            <p className='text-4xl font-bold'>Orders</p>

                            
                            <div className='mt-10 flex flex-col w-full sm:border-none border border-black py-5 border-opacity-50 rounded-xl'>

                                <div className='items-center py-2 justify-between font-bold text-xl bg-amber-400 px-20 sm:flex hidden'>
                                    <div className='flex gap-28'>
                                        <p className='lg:w-[200px]'>Order ID</p>
                                        <p className=''>Status</p>
                                    </div>

                                    <div className='flex gap-5'>
                                        <p>Item Quantity</p>
                                        <p className='sm:w-[60px] '>Amount</p>
                                    </div>
                                </div>

                                {
                                    allOrders.map((order) => (
                                        <div key={order._id}>
                                        
                                            {/* WHen the screen is larger than 640px this div is visible */}
                                            <div className='items-center py-2 justify-between px-5 sm:flex hidden '>
                                                <div className='flex gap-5 items-center'>
                                                    <HiOutlinePencilAlt fontSize={'1.3rem'} onClick={() => updateOrderHandler(order._id)}
                                                    className='cursor-pointer hover:text-red-400 transition-all duration-200 ease-in-out'/>
                                                    
                                                    <p className='lg:w-[200px]'>{order._id}</p>
                                                    
                                                    <p className={`font-semibold lg:w-[300px] ${order?.orderStatus === 'Delivered' ? 'text-green-500' : order?.orderStatus === 'Shipped' ? 'text-blue-500' : 'text-red-500'}`}>{order.orderStatus}</p>
                                                </div>

                                                <div className='flex gap-10 items-center'>
                                                    <p>{order.orderItems.length}</p>
                                                    <p className='sm:w-[60px] text-green-500 font-semibold'>{`₹${order.totalPrice}`}</p>
                                                    <RiDeleteBin4Fill fontSize={'1.3rem'} className='cursor-pointer hover:text-red-400 transition-all duration-200 ease-in-out' onClick={() => deleteOrderIconHandler(order._id)}/>
                                                </div>
                                            </div>

                                            {/* WHen the screen less that 640px this div is visible */}
                                            <div className='sm:hidden w-full flex items-center justify-center mt-2'>
                                                <TreeView aria-label="file system navigator" defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
                                                    <TreeItem nodeId="1" label={ 
                                                        <div className='font-bold text-lg flex min-[420px]:w-[300px] items-center justify-between min-[420px]:gap-10'>
                                                            <div className='min-[380px]:text-base text-sm'>{order._id}</div>
                                                            <div className='flex gap-3'>
                                                                <HiOutlinePencilAlt fontSize={'1.3rem'} onClick={() => updateOrderHandler(order._id)} />
                                                                <RiDeleteBin4Fill fontSize={'1.3rem'} className='cursor-pointer hover:text-red-400 transition-all duration-200 ease-in-out' onClick={() => deleteOrderIconHandler(order._id)}/>
                                                            </div>
                                                        </div>
                                                    }>
                                                        <div className='flex flex-col'>
                                                            <TreeItem nodeId='2' label={<div className='font-bold text-sm'>{`Price - ₹${order.totalPrice}`}</div>}/>
                                                            <TreeItem nodeId='3' label={<p className={`font-semibold sm:w-[300px] text-sm ${order?.orderStatus === 'Delivered' ? 'text-green-500' : order?.orderStatus === 'Shipped' ? 'text-blue-700' : 'text-red-500'}`}>{order.orderStatus}</p>}/>
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
                        <DialogTitle>Delete Order!</DialogTitle>

                        <DialogContent>Do you want to delete this order?</DialogContent>

                        <DialogActions>
                            <Button onClick={handlerClose}>Cancel</Button>
                            <Button onClick={deleteOrderHandler}>Delete</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            }
        </div>
    )
}

export default AdminOrders