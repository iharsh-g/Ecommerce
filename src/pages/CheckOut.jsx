import React from 'react'
import { useSelector } from 'react-redux';
import { FaCheck } from 'react-icons/fa';
import ShippingDetailsForm from '../components/CheckOut/ShippingDetailsForm';
import ConfirmOrder from '../components/CheckOut/ConfirmOrder';

function CheckOut() {
    const {step} = useSelector((state) => state.cart);

    const steps = [
        {
            id: 1,
            title: "Shipping Details"
        },
        {
            id: 2,
            title: "Confirm Order"
        },
    ];

    return (
        <div className='min-h-[69vh]'>
            <div className='lg:w-[700px] sm:w-[500px] w-[300px] mx-auto'>
                <div className='flex w-full justify-between px-10 pt-14 mb-3 relative'>
                    {
                        steps.map((item, index) => (
                            <div key={index}>
                                <div>
                                    <div className={`${step === item.id ? 'bg-yellow-300 border-yellow-600 border-2 text-yellow-600 font-bold px-3 py-1' 
                                    : step > item.id ? 'text-yellow-600 bg-yellow-400 border-yellow-600 border-2 p-2'
                                    : 'bg-yellow-50 border-yellow-600 text-black px-3 py-1'} border w-fit rounded-full`}
                                    >
                                        {
                                            step > item.id ? (<FaCheck/>) : (item.id)
                                        }
                                    </div>
                                </div>

                                {/* Add Dashes */}
                                {
                                    step > item.id ? (<div className='border border-dashed lg:min-w-[550px] sm:min-w-[350px] min-w-[150px] absolute bottom-5 ml-[2.1rem] border-yellow-600'></div>) :
                                    item.id <= 1 ?
                                    <div className='border border-dashed lg:min-w-[550px] sm:min-w-[350px] min-w-[150px] absolute bottom-5 ml-[2.2rem] border-black'></div>: <div></div>
                                }
                            </div>
                        ))
                    }
                </div>  

                <div className='flex w-full justify-between text-sm mb-14 px-2'>
                    {
                        steps.map((item, index) => (
                            <div key={index}><p className={`${step === item.id ? 'text-richblack-5' : 'text-richblack-500 tracking-wider'} font-semibold tracking-wide`}>{item.title}</p></div>
                        ))
                    }
                </div> 
            </div>

            {
                step === 1 ? <ShippingDetailsForm/> : 
                <ConfirmOrder/>
            }
        </div>
    )
}

export default CheckOut