import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom'
import { fetchSingleOrder } from '../redux/services/operations/orderApi';
import Loader from './Loader';
import CartItemCard from './Admin/CartItemCard';
import { useSelector } from 'react-redux';

function Order() {
    const {orderId} = useParams();
    const [orderDetails, setOrderDetails] = useState('');
    const [loading, setLoading] = useState(false);

    const {token} = useSelector((state) => state.auth);

    async function getOrderDetails() {
        const toastId = toast.loading("Loading...");
        setLoading(true);

        try {
            const response = await fetchSingleOrder(orderId, token);
            setOrderDetails(response);
            // console.log(response);
        }
        catch(error) {
            toast.error("Can't fetch order!")
        }
        
        toast.dismiss(toastId);
        setLoading(false);
    }

    useEffect(() => {
        if(orderId) {
            getOrderDetails();
        }
    }, [orderId])
    
    return (
        <div className='min-h-[69vh]'>
            <div className='max-w-[1200px] mx-auto py-5'>
                {
                    loading ? <div className='min-h-[60vh] flex items-center justify-center'><Loader/></div> : 
                    <div>
                        <div className='flex flex-col px-3'>
                
                            <p className='text-2xl font-bold'>Shipping Information</p>
                            <div className='mt-3'>
                                <div className='flex px-5 gap-3 items-center'>
                                    <p className='text-neutral-500'>Name: </p>
                                    <p className='font-semibold'>{orderDetails?.user?.name}</p>
                                </div>

                                <div className='flex px-5 gap-3 items-center my-2'>
                                    <p className='text-neutral-500'>Email: </p>
                                    <p className='font-semibold'>{orderDetails?.user?.email}</p>
                                </div>

                                <div className='flex px-5 gap-3 items-center my-2'>
                                    <p className='text-neutral-500'>Address: </p>
                                    <p className='font-semibold'>{`${orderDetails?.shippingInfo?.address}, ${orderDetails?.shippingInfo?.city}, ${orderDetails?.shippingInfo?.state}, ${orderDetails?.shippingInfo?.country}`}</p>
                                </div>

                                <div className='flex px-5 gap-3 items-center my-2'>
                                    <p className='text-neutral-500'>Contact Number: </p>
                                    <p className='font-semibold'>{orderDetails?.shippingInfo?.contactNumber}</p>
                                </div>
                            </div>

                            <p className='text-2xl font-bold mt-5'>Payment Information</p>
                            <div className='mt-3 flex sm:flex-row flex-col'>

                                <div className='sm:w-[50%]'>
                                    <div className='flex px-5 gap-3 items-center'>
                                        <p className='text-neutral-500'>Status: </p>
                                        <p className={`font-semibold text-lg ${orderDetails?.paymentInfo?.status === "Succeded" ? 'text-green-500' : ''}`}>{orderDetails?.paymentInfo?.status}</p>
                                    </div>

                                    <div className='flex px-5 gap-3 items-center my-2'>
                                        <p className='text-neutral-500'>Payment Id: </p>
                                        <p className='font-semibold'>{orderDetails?.paymentInfo?.id}</p>
                                    </div>

                                    
                                    <div className='flex px-5 gap-3 items-center my-2'>

                                        <p className='text-neutral-500'>Paid At: </p>
                                        {/* Converting Date in 12 June 2023, 10:23 AM (IST) */}
                                        <p className='font-semibold'>
                                            {new Date(orderDetails?.paidAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                })
                                            },{' '}
                                            {new Date(orderDetails?.paidAt).toLocaleTimeString('en-IN', {
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true,
                                                timeZone: 'Asia/Kolkata',
                                            }).replace(/\b(am|pm)\b/gi, match => match.toLocaleUpperCase())}
                                            {' (IST)'}
                                        </p>
                                    </div>
                                </div>

                                <div className={`sm:w-[50%] flex flex-col`}>

                                    <div className='flex px-5 gap-3 items-center sm:place-self-end'>
                                        <p className='text-neutral-500'>Item Amounts: </p>
                                        <p className='font-semibold text-lg'>{`₹${orderDetails?.itemsPrice}`}</p>
                                    </div>

                                    <div className='flex px-5 gap-3 items-center sm:place-self-end'>
                                        <p className='text-neutral-500'>Taxes (Shipping $ GST): </p>
                                        <p className='font-semibold text-lg'>{`₹${orderDetails?.shippingPrice + orderDetails?.taxPrice}`}</p>
                                    </div>

                                    <div className='flex px-5 gap-3 items-center sm:place-self-end'>
                                        <p className='text-neutral-500'>Total Amount: </p>
                                        <p className='font-semibold text-lg'>{`₹${orderDetails?.totalPrice}`}</p>
                                    </div>
                                </div>
                            </div>

                            <p className='text-2xl font-bold mt-5'>Order Information</p>
                            <div className='flex justify-between sm:items-center sm:flex-row flex-col'>
                                <p className={`mt-3 ${orderDetails?.orderStatus === 'Delivered' ? 'text-green-500' : orderDetails?.orderStatus === 'Shipped' ? 'text-blue-500' : 'text-red-500'}
                                    font-semibold`}><span className='text-neutral-500 font-normal'>Status: </span>
                                    {orderDetails?.orderStatus}
                                </p>
                                <p className='font-semibold'>
                                    <span className='text-neutral-500 font-normal'>Order Id: </span>
                                    {orderDetails?._id}
                                </p>
                            </div>

                            <p className='text-2xl font-bold mt-5'>Cart Items</p>
                            <div className='mt-7 flex flex-col gap-3 px-10'>
                                {
                                    orderDetails?.orderItems?.map((item) => (
                                        <div key={item._id}>
                                            <CartItemCard item={item}/>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Order