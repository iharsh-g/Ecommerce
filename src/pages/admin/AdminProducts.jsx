import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Admin/Sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { deleteProduct, fetchProducts } from '../../redux/services/operations/adminApi';
import { HiOutlinePencilAlt } from 'react-icons/hi'
import { RiDeleteBin4Fill } from 'react-icons/ri'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import TreeView from '@mui/lab/TreeView/TreeView';
import TreeItem from '@mui/lab/TreeItem/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Loader from '../../components/Loader';

function Products() {
    const navigate = useNavigate();
    const {userDetails} = useSelector((state) => state.user);
    const {token} = useSelector((state) => state.auth);
    const {allProducts, loading} = useSelector((state) => state.admin);
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

        dispatch(fetchProducts(token));
    }, [userDetails]);

    function updateProductHandler(id) {
        navigate(`/admin/product/${id}`);
    }

    // When admin click on the delete icon
    function deleteProductIconHandler(id) {
        setOpen(true);
        setDeleteId(id);
    }

    // When admin click outside the dialog Box or Cancel 
    function handlerClose() {
        setOpen(false);
    }

    // When admin click in the dialog box to delete
    async function deleteProductHandler() {
        setOpen(false);
        await dispatch(deleteProduct(deleteId, navigate, token))
        dispatch(fetchProducts(token));
    }

    return (
        <div>
            {
                loading ? <div className='min-h-[calc(100vh-235px)] flex items-center justify-center'><Loader/></div> :
                
                <div className='flex min-h-[73vh] gap-10 min-[1080px]:flex-row flex-col'>
                    <div>
                        <div className='min-[1080px]:block hidden h-full'>
                            <Sidebar/>
                        </div>
                    </div>

                    <div className='w-full'>
                        <div className='flex flex-col items-center justify-center py-5 max-w-[1200px] px-3'>
                            <p className='text-4xl font-bold'>Products</p>

                            {
                                loading ? <div className='min-h-[calc(100vh-235px)] flex items-center justify-center'><Loader/></div> :
                                <div className='mt-10 flex flex-col w-full sm:border-none border border-black py-5 border-opacity-50 rounded-xl'>
                                    <div className='items-center py-2 justify-between font-bold text-xl bg-amber-400 px-20 sm:flex hidden'>
                                        <div className='flex gap-28'>
                                            <p className='lg:w-[200px] lg:block hidden'>Product ID</p>
                                            <p className=''>Name</p>
                                        </div>

                                        <div className='flex gap-5'>
                                            <p>Stock</p>
                                            <p className='sm:w-[60px] '>Price</p>
                                        </div>
                                    </div>
                                    {
                                        allProducts && 
                                        allProducts.map((prod) => (
                                            <div key={prod._id}>
                                            
                                                {/* WHen the screen is larger than 640px this div is visible */}
                                                <div className='items-center py-2 justify-between px-5 sm:flex hidden '>
                                                    <div className='flex gap-5 items-center'>
                                                        <HiOutlinePencilAlt fontSize={'1.3rem'} onClick={() => updateProductHandler(prod._id)}
                                                        className='cursor-pointer hover:text-red-400 transition-all duration-200 ease-in-out'/>
                                                        
                                                        <p className='w-[200px]  lg:block hidden'>{prod._id}</p>
                                                        
                                                        <p className='font-semibold sm:w-[300px]'>{prod.name}</p>
                                                    </div>

                                                    <div className='flex gap-10 items-center'>
                                                        <p>{prod.stock}</p>
                                                        <p className='sm:w-[60px] text-green-500 font-semibold'>{`₹${prod.price}`}</p>
                                                        <RiDeleteBin4Fill fontSize={'1.3rem'} className='cursor-pointer hover:text-red-400 transition-all duration-200 ease-in-out' onClick={() => deleteProductIconHandler(prod._id)}/>
                                                    </div>
                                                </div>

                                                {/* WHen the screen less that 640px this div is visible */}
                                                <div className='sm:hidden w-full flex items-center justify-center mt-2'>
                                                    <TreeView aria-label="file system navigator" defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
                                                        <TreeItem nodeId="1" label={ 
                                                            <div className='font-bold text-lg flex min-[420px]:w-[300px] w-full items-center justify-between min-[420px]:gap-10'>
                                                                <div className='min-w-[100px]'>{prod.name}</div>
                                                                <div className='flex gap-3'>
                                                                    <HiOutlinePencilAlt fontSize={'1.3rem'} onClick={() => updateProductHandler(prod._id)} />
                                                                    <RiDeleteBin4Fill fontSize={'1.3rem'} className='cursor-pointer hover:text-red-400 transition-all duration-200 ease-in-out' onClick={() => deleteProductIconHandler(prod._id)}/>
                                                                </div>
                                                            </div>
                                                        }>
                                                            <div className='flex flex-col'>
                                                                <TreeItem nodeId='2' label={<div className='font-bold'>Price - <span className=' text-green-500'>{`₹${prod.price}`}</span></div>}/>
                                                                <TreeItem nodeId='3' label={<div className='font-bold'>Stock - <span>{prod.stock}</span></div>}/>
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
                        <DialogTitle>Delete Product!</DialogTitle>

                        <DialogContent>Do you want to delete this product?</DialogContent>

                        <DialogActions>
                            <Button onClick={handlerClose}>Cancel</Button>
                            <Button onClick={deleteProductHandler}>Delete</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            }
        </div>
    )
}

export default Products