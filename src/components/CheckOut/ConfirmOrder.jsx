import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setStep } from '../../redux/slices/cartSlice';
import CartItemCard from '../Admin/CartItemCard';
import { buyProducts } from '../../redux/services/operations/paymentApi';
import { useNavigate } from 'react-router-dom';

function ConfirmOrder() {
    const {shippingDetails, cartDetails} = useSelector((state) => state.cart);
    const {userDetails} = useSelector((state) => state.user);
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    if(shippingDetails === null) {
        dispatch(setStep(1));
    }

    function paymentHandler() {
        const data = {
            shippingInfo: shippingDetails,
            orderItems: cartDetails,
            itemsPrice: localStorage.getItem("subTotal"),
            taxPrice: 40,
            shippingPrice: localStorage.getItem("gst"),
            totalPrice: localStorage.getItem("grossTotal")
        }

        buyProducts(data, token, userDetails, navigate, dispatch)
    }

    return (
        <div className={`lg:p-5 lg:ml-10 ml-3 flex lg:flex-row flex-col`}>
                
            <div className='lg:w-[70%]'>
                <p className='text-2xl font-bold'>Shipping Information</p>
                <div className='mt-3'>
                    <div className='flex px-5 gap-3 items-center'>
                        <p className='text-neutral-500'>Name: </p>
                        <p className='font-semibold'>{userDetails?.name}</p>
                    </div>

                    <div className='flex px-5 gap-3 items-center my-2'>
                        <p className='text-neutral-500'>Contact Number: </p>
                        <p className='font-semibold'>{shippingDetails?.phoneNumber}</p>
                    </div>

                    <div className='flex px-5 gap-3 items-center my-2'>
                        <p className='text-neutral-500'>Address: </p>
                        <p className='font-semibold'>{`${shippingDetails?.address}, ${shippingDetails?.city}, ${shippingDetails?.state} ${shippingDetails?.country}`}</p>
                    </div>
                </div>

                <p className='text-2xl font-bold mt-5'>Cart Items</p>
                <div className='mt-7 flex flex-col gap-3 px-10'>
                    {
                        cartDetails?.map((item) => (
                            <div key={item._id}>
                                <CartItemCard item={item} confirmation={true}/>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className={`lg:w-[30%] px-2 mx-2 my-5 lg:my-0 lg:place-self-start border border-neutral-500 rounded-lg border-opacity-50 min-h-[500px]`}>
                <p className='text-3xl font-bold text-center mt-10'>Order Summary</p>
                <div className='h-[1px] w-full bg-neutral-700 mt-2'></div>
                <div className=' flex flex-col items-center rounded-xl gap-5 justify-center mt-14'>
                    
                    <div className='w-full'>
                        <div className='flex justify-between'>
                            <p className='font-bold text-lg tracking-wide'>Sub Total</p>
                            <p className='font-semibold'>₹{localStorage.getItem("subTotal")}</p>
                        </div>

                        <div className='flex justify-between text-sm'>
                            <p className='font-bold tracking-wide'>GST</p>
                            <p className='text-neutral-600'>₹{localStorage.getItem("gst")}</p>
                        </div>

                        
                        <div className='h-[1px] w-full bg-neutral-700 mt-7'></div>   
                        
                        <div className='flex justify-between mt-3'>
                            <p className='font-bold text-lg tracking-wide'>Gross Total</p>
                            <p className='font-semibold'>₹{localStorage.getItem("grossTotal")}</p>
                        </div>
                    </div>

                    <button className='bg-red-700 px-8 py-3 text-white font-semibold rounded-lg mt-10
                    hover:bg-red-500 cursor-pointer transition-all duration-200 hover:scale-95' onClick={paymentHandler}>
                        Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmOrder