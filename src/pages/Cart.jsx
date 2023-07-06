import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CartItem from '../components/CartItem';
import {Link, useNavigate} from 'react-router-dom'
import { setStep } from '../redux/slices/cartSlice';

function Cart() {
    const {cartDetails} = useSelector((state) => state.cart);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const calculateSubTotal = () => {
        return cartDetails.reduce((acc, item) => acc + item.quantity * item.productPrice, 0);
    };
    
    const calculateGST = () => {
        const subTotal = calculateSubTotal();
        const gstPercentage = 18;
        return (subTotal * gstPercentage) / 100;
    };
    
    const calculateTotal = () => {
        const subTotal = calculateSubTotal();
        const gst = calculateGST();
        return (subTotal + gst).toFixed(2);
    };

    function checkOutHandle() {
        dispatch(setStep(1));
        localStorage.setItem("subTotal", calculateSubTotal());
        localStorage.setItem("gst", calculateGST());
        localStorage.setItem("grossTotal", calculateTotal());
        navigate("/order/shipping");
    }
    

    return (
        <div className='flex items-center justify-center min-h-[549px]'>
            {   cartDetails && cartDetails?.length !== 0 && 
                <div className='mx-auto flex w-[1200px] lg:flex-row flex-col items-center'>
                    <div className='lg:w-[50%] sm:w-[70%] w-full flex flex-col gap-6'>
                        {
                            cartDetails?.map((item) => (
                                <CartItem item={item} key={item.productId}/>
                            ))
                        }
                    </div>
                    
                    <div className='w-[2px] bg-purple-500 text-purple-500'></div>

                    <div className='p-5 lg:place-self-start flex flex-col justify-between lg:w-[50%] sm:w-[70%] w-full'>
                        <div>
                            <p className='sm:text-5xl text-3xl font-bold text-green-500'>Cart Summary</p>
                            <hr className='mt-4 border-neutral-500'/>

                            {/* Cart Details */}
                            <div className='w-full mt-5 sm:p-5 flex flex-col gap-4'>
                            
                                <div className='flex justify-between'>
                                    <p className='sm:text-lg font-semibold'>Product Name</p>

                                    <div className='flex min-[400px]:gap-20 gap-3 sm:text-lg font-semibold'>
                                        <p>Quantity</p>
                                        <p>Sub Total</p>
                                    </div>
                                </div>
                                    {
                                        cartDetails?.map((item) => (
                                            <div key={item.productId} className='flex justify-between'>
                                                <p className='sm:text-lg font-semibold px-2 sm:w-[200px] w-[100px]'>{item.productName}</p>

                                                <div className='flex min-[400px]:gap-[150px] gap-14'>
                                                    <p>{item.quantity}</p>
                                                    <p className='font-semibold w-[70px]'>{`₹${item.productPrice * item.quantity}`}</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    
                            </div>
                        </div>
                        
                        <div className='flex justify-between items-center mt-5'>
                            <p className='text-xl font-semibold tracking-wider'>Sub Total</p>
                            <p className='text-xl font-bold'>
                                {`₹${calculateSubTotal()}`}
                            </p>
                        </div>

                        <div className='flex justify-between items-center'>
                            <p className='font-semibold text-neutral-500'>GST</p>
                            <p className='font-bold text-neutral-500'>
                                {`₹${calculateGST()}`}
                            </p>
                        </div>

                        <div className='flex justify-between items-center my-5'>
                            <p className='text-2xl font-bold tracking-wider'>Gross Total</p>
                            <p className='text-2xl font-bold text-green-500'>
                                {`₹${calculateTotal()}`}
                            </p>
                        </div>

                        <div className='bg-green-700 text-center py-3 text-white font-bold sm:text-2xl text-lg rounded-2xl cursor-pointer
                            hover:bg-green-500 duration-300 transition-all ease-in hover:scale-105' onClick={checkOutHandle}>
                            Check Out
                        </div>
                        
                    </div>
                </div>
            }

            {
                cartDetails?.length === 0 &&
                <div>
                    <div className='flex flex-col gap-3 items-center'>

                        <p className='sm:text-2xl text-xl font-semibold'>No Products in the Cart</p>
                        <Link to={"/products"}>
                            <div className='bg-green-700 px-10 py-3 rounded-lg text-white text-lg font-semibold
                            hover:bg-green-500 duration-300 transition-all ease-in hover:scale-105'>
                                GO TO PRODUCTS
                            </div>
                        </Link>
                    </div>
                </div>
            }
        </div>
    )
}

export default Cart