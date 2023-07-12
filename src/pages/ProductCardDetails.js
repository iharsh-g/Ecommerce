import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {Rating, ThinStar} from "@smastrom/react-rating"

import { useDispatch, useSelector } from 'react-redux';
import { setCartLoading, updateItem, addItem } from '../redux/slices/cartSlice';
import { toast } from 'react-hot-toast';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Button, TextField } from '@mui/material';
import { addOrUpdateReview, fetchProductById } from '../redux/services/operations/productApi';

import Loader from '../components/Loader'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper'
import "swiper/css";
import "swiper/css/pagination";

const myStyles = {
    itemShapes: ThinStar,
    activeFillColor: '#ffb700',
    inactiveFillColor: '#fbf1a9'
}

function ProductCardDetails() {
    const {productId} = useParams();

    const [itemCount, setItemCount] = useState(1);
    const navigate = useNavigate();

    //For adding review
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('');
    
    const dispatch = useDispatch();
    const {productDetails, isLoading} = useSelector((state) => state.products);
    const {cartDetails} = useSelector((state) => state.cart);
    const {token} = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchProductById(productId, token));
    }, [productId])

    function addToCartHandler() {

        if(token) {
            
            const existingCartItem = cartDetails?.find((p) => p.productId === productId);

            if(existingCartItem?.quantity + itemCount > existingCartItem?.stock) {
                toast.error("Cannot add items");
                return;
            }
            
            const toastId = toast.loading("Loading...");
            setCartLoading(true);

            if (existingCartItem) {
                const updatedCartItem = {
                    ...existingCartItem,
                    quantity: existingCartItem.quantity + itemCount
                };
    
                try {
                    dispatch(updateItem(updatedCartItem));
                    toast.success("Item quantity updated");
                }
                catch (e) {
                    console.log("Updation Problem", e);
                }
            }
            else {
                const cartItem = {
                    productId: productDetails._id,
                    productName: productDetails.name,
                    productPrice: productDetails.price,
                    productImage: productDetails.images[0].url,
                    stock: productDetails.stock,
                    quantity: itemCount
                };
    
                try {
                    dispatch(addItem(cartItem));
                    toast.success("Item Added");
                } catch (e) {
                    console.log("Item Addition Problem", e);
                }
            }

            dispatch(setCartLoading(false));
            toast.dismiss(toastId);
        }
        else {
            toast.error("Please login to continue...");
            navigate("/login");
        }
        
    }

    //RED BUTTON 
    function addReviewButtonHandler() {
        setOpen(true);
    }

    function handlerClose() {
        
        //Reseting the data and closing the Dailog Box
        setReview('');
        setRating(0);

        setOpen(false);
    }

    async function handlerAddReview() {
        await dispatch(addOrUpdateReview(productId, rating, review, token));
        
        dispatch(fetchProductById(productId));
      
        // Reseting the data and closing the Dialog Box
        setReview('');
        setRating(0);
        setOpen(false);
    }

    return (
        <div className='max-w-[1200px] mx-auto text-black'>
        {
            isLoading ? 
            (<div className='min-h-[calc(100vh-235px)] flex items-center justify-center'><Loader/></div>) :
            productDetails ?
            <div>
                <div className='flex lg:flex-row flex-col justify-between sm:px-20 px-5 items-center lg:max-w-full max-w-[800px] mx-auto'>
                    {/* Image */}
                    <div className='lg:w-[35%] w-full'>
                        <Swiper slidesPerView={1} modules={[Pagination, Navigation]} pagination={{dynamicBullets: true }} spaceBetween={35}
                            className='mySwiper sm:min-h-[350px]' navigation={true} loop>
                            {
                                productDetails?.images?.map((image, index) => 
                                    <SwiperSlide key={index}>
                                        <div>
                                            <img src={image?.url} alt={image.id} className='sm:w-[400px] sm:max-h-[450px] mx-auto min-[410px]:max-w-[400px] max-h-[450px] my-10'/>
                                        </div>
                                    </SwiperSlide>
                                )
                            }
                        </Swiper>
                    </div>
                    
                    {/* Product Description */}
                    <div className='lg:w-[50%] sm:w-[500px] mx-auto py-14 sm:px-10 px-3 place-self-start'>
                        <p className='text-3xl font-bold'>{productDetails?.name}</p>
                        <hr className='mt-3 mx-10 border-neutral-400' />

                        <div className='flex gap-3 sm:flex-row flex-col items-center text-lg my-3'>
                            <div className='flex items-center gap-3'>
                                <p className='text-[#ffc020] font-bold text-xl'>{productDetails?.ratings?.toFixed(1)}</p>
                                <Rating style={{maxWidth: 130}} value={productDetails?.ratings} readOnly itemStyles={myStyles}/>
                            </div>

                            <div>
                                <p className='text-neutral-700 font-semibold tracking-wide'>{`(${productDetails?.numOfReviews} Reviews Count)`}</p>
                            </div>
                        </div>

                        <p className='text-[28px] text-[#3ed223] font-bold my-4'>{`₹${productDetails?.price}`}</p>
                        
                        {  productDetails?.stock > 0  &&
                            <div className='flex sm:flex-row flex-col gap-5 items-center mb-5'>
                                <div className='flex gap-3 items-center'>
                                    <button className='bg-red-500 text-white px-4 rounded-lg text-3xl pb-1 hover:bg-red-600 transition-all duration-200' 
                                        onClick={() => (itemCount > 1 ? setItemCount(itemCount - 1) : setItemCount(1))}>-</button>

                                    <p className='text-xl'>{itemCount}</p>

                                    <button className='bg-red-500 text-white px-3 rounded-lg text-3xl pb-1 hover:bg-red-600 transition-all duration-200'
                                        onClick={() => (itemCount >=  productDetails?.stock ? setItemCount(productDetails?.stock) : setItemCount(itemCount + 1))}>+</button>
                                </div>

                                <button className='bg-yellow-600 px-4 py-3 rounded-full font-semibold text-white hover:bg-yellow-500 hover:scale-105 ease-in 
                                    transition-all duration-200' onClick={addToCartHandler}>
                                    Add to Cart
                                </button>
                            </div>
                        }

                        <div className='text-lg mt-5 flex items-center gap-2'>
                            <p className='text-neutral-400'>Status: </p>
                            <p className={`${productDetails?.stock > 0 ? "text-green-700" : "text-red-700"} font-semibold`}>
                                {productDetails?.stock > 0 ? "In Stock" : "Out of Stock"}</p>
                        </div>

                        <div className='mt-4'>
                            <p className='text-lg font-semibold'>Description: </p>
                            <p className='text-sm text-neutral-400'>{productDetails?.description}</p>
                        </div>
                    </div>
                </div>
                
                {
                    token && 
                    <div className='flex items-center justify-center'>
                        <div className='bg-red-700 text-white font-semibold px-7 py-3 rounded-lg cursor-pointer
                        hover:bg-red-500 transition-all duration-200 ease-in hover:scale-105 flex gap-3 items-center' onClick={addReviewButtonHandler}>
                            Add Review
                        </div>

                        <Dialog open={open} onClose={handlerClose}>
                            <DialogTitle textAlign={'center'}>Add Review</DialogTitle>

                            <DialogContent className='flex flex-col items-center'>
                                <Rating style={{maxWidth: 150, marginTop: 5, marginBottom: 20}} itemStyles={myStyles} value={rating} onChange={setRating}/>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="review"
                                    placeholder='Add Review'
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                />
                            </DialogContent>

                            <DialogActions>
                                <Button onClick={handlerClose}>Cancel</Button>
                                <Button onClick={handlerAddReview}>Add</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                }

                {/* Reviews */}
                <div className='mt-[2rem] flex flex-col items-center lg:max-w-full max-w-[800px] mx-auto'>
                    <p className='text-3xl font-bold text-neutral-700'>REVIEWS</p>
                    <div className='h-[2px] w-[200px] bg-red-500 mt-4'></div>

                    {   productDetails && 
                        <div className='py-12 gap-14 w-full sm:px-16 px-3'>
                            {
                                productDetails?.reviews?.length === 0 ?
                                <div className='lg:w-full flex items-center justify-center md:text-2xl text-lg text-neutral-500'>
                                    <p>No Reviews Found</p>
                                </div> :
                                <Swiper slidesPerView={1} spaceBetween={5} modules={[Pagination, Navigation]} pagination={{dynamicBullets: true }} 
                                    className='mySwiper min-h-[350px]' navigation={true} breakpoints={{1170: {slidesPerView: 3}, 850: {slidesPerView: 2}}}>
                                    {
                                        productDetails?.reviews?.map((review) => 
                                            <SwiperSlide key={review?._id}>
                                                <div className='flex flex-col border border-black border-opacity-20 px-5 py-5 mt-10 mx-5 min-w-[350px] rounded-xl h-[250px] overflow-y-auto 
                                                hover:shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] hover:scale-110 hover:z-[10] transition-all duration-300 hover:bg-blue-900 cursor-pointer group'>

                                                    <div className='flex sm:flex-row flex-col items-center justify-between'>
                                                        <div className='flex gap-2 items-center'>
                                                            <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${review.name}`} alt='' className='w-[30px] h-[30px] rounded-full'/>
                                                            <p className='font-semibold text-xl group-hover:text-white'>{review.name}</p>
                                                        </div>

                                                        <Rating style={{maxWidth: 130}} value={review.rating} readOnly itemStyles={myStyles} className='mt-2 sm:mt-0'/>
                                                    </div>

                                                    <p className='mt-4 text-neutral-500 group-hover:text-neutral-400'>{review.comment}</p>
                                                </div>
                                            </SwiperSlide>
                                        )
                                    }
                                </Swiper>
                            }
                        </div>
                    }
                </div>
                
            </div>
            :
            <div className='min-h-[calc(100vh-235px)] flex items-center justify-center text-xl'>No Product Found</div>

        }
        </div>
    )
}

export default ProductCardDetails