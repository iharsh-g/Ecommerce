import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDetails, updateOrder } from '../../redux/services/operations/adminApi';
import { useNavigate, useParams } from 'react-router-dom';
import CartItemCard from '../../components/Admin/CartItemCard';
import { toast } from 'react-hot-toast';
import Loader from '../../components/Loader';

function UpdateOrder() {
    const {id} = useParams();
    
    const navigate = useNavigate();
    const {token} = useSelector((state) => state.auth);
    const {userDetails} = useSelector((state) => state.user);
    const {orderDetails, loading} = useSelector((state) => state.admin);
    const dispatch = useDispatch();

    const [category, setCategory] = useState('Choose Category');

    useEffect(() => {
        if(!token) {
            navigate("/login");
        }

        if(token && userDetails && userDetails?.role !== "Admin") {
            navigate("/account");
        }

        dispatch(fetchOrderDetails(id));
    }, [userDetails]);

    // console.log(orderDetails);
    function updateHandler() {
        if(category === "Choose Category") {
            toast.error("Choose Category");
            return;
        }

        dispatch(updateOrder(id, category, navigate));
    }

  return (
    <div>
        {
            loading ? <div className='min-h-[calc(100vh-235px)] flex items-center justify-center'><Loader/></div>: 
            orderDetails &&
            <div className={`${orderDetails?.orderStatus === "Delivered" ? 'block' : 'flex lg:flex-row flex-col'} min-h-[73vh] pt-1`}>

                <div className={`${orderDetails?.orderStatus === "Delivered" ? 'block lg:mr-10 mr-3' : 'lg:w-[70%]'} lg:p-5 lg:ml-10 ml-3`}>
                
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
                    <div className='mt-3 flex md:flex-row flex-col'>

                        <div className='md:w-[50%]'>
                            <div className='flex px-5 gap-3 items-center'>
                                <p className='text-neutral-500'>Status: </p>
                                <p className={`font-semibold text-lg ${orderDetails?.paymentInfo?.status === "Succeded" ? 'text-green-500' : ''}`}>{orderDetails?.paymentInfo?.status}</p>
                            </div>

                            <div className='flex px-5 gap-3 items-center my-2'>
                                <p className='text-neutral-500'>Payment Id: </p>
                                <p className='font-semibold'>{orderDetails?.paymentInfo?.id}</p>
                            </div>
                        </div>

                        <div className={`md:w-[50%] ${orderDetails?.orderStatus === "Delivered" ? 'md:items-end' : 'md:items-start'} flex flex-col`}>
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

                            <div className='flex px-5 gap-3 items-center'>
                                <p className='text-neutral-500'>Amount: </p>
                                <p className='font-semibold text-lg'>{`₹${orderDetails?.totalPrice}`}</p>
                            </div>
                        </div>
                    </div>

                    <p className='text-2xl font-bold mt-5'>Order Status</p>
                    <p className={`mt-3 ${orderDetails?.orderStatus === 'Delivered' ? 'text-green-500' : orderDetails?.orderStatus === 'Shipped' ? 'text-blue-500' : 'text-red-500'}
                        font-semibold`}>
                        {orderDetails?.orderStatus}
                    </p>

                    <p className='text-2xl font-bold mt-5'>Cart Items</p>
                    <div className='mt-7 flex flex-col gap-3 px-10'>
                        {
                            orderDetails?.orderItems.map((item) => (
                                <div key={item._id}>
                                    <CartItemCard item={item}/>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className={`${orderDetails?.orderStatus === "Delivered" ? 'hidden' : 'lg:w-[30%] lg:mt-0 my-5'} px-2`}>
                    <div className='bg-neutral-800 flex flex-col items-center rounded-xl min-h-[400px] gap-5 justify-center'>
                        <p className='text-3xl font-bold text-neutral-200'>Process Order</p>

                        <select className='sm:w-[350px] py-2 px-4 pl-5 cursor-pointer rounded-xl relative text-black' value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value={"Choose Category"}>Choose Category</option>
                            {
                                orderDetails?.orderStatus === "Processing" ? <option value={"Shipped"}>Shipped</option> :  <option value={"Delivered"}>Delivered</option>
                            }
                        </select>

                        <button className='bg-red-700 px-8 py-3 text-white font-semibold rounded-lg mt-10
                        hover:bg-red-500 cursor-pointer transition-all duration-200 hover:scale-95' onClick={updateHandler}>
                            Update
                        </button>
                    </div>
                </div>

            </div>
        }
    </div>
  )
}

export default UpdateOrder