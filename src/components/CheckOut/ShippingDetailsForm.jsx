import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiFillHome } from 'react-icons/ai';
import { FaCity } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';
import { IoMdCall } from 'react-icons/io';
import { BsGlobeCentralSouthAsia } from 'react-icons/bs';
import { HiOutlineBuildingLibrary } from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { setShippingDetails, setStep } from '../../redux/slices/cartSlice';
import { getStates } from 'country-state-picker';

const countries = [
    "India", "Australia" , "America", "United Kingdom", "England", "Nagaland", "Bhutan", "Bangladesh"
]

const states = [
    "Delhi", "Kolkata" , "Mumbai", "Uttar Pradesh", "Harayana", "Rajasthan", "Bihar", "Kerala"
]

function ShippingDetailsForm() {
    const {handleSubmit, register, setValue} = useForm();
    const {shippingDetails} = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [states, setStates] = useState([]);

    useEffect(() => {
        if(shippingDetails) {
            setValue("address", shippingDetails.address);
            setValue("city", shippingDetails.city);
            setValue("pincode", shippingDetails.pincode);
            setValue("phoneNumber", shippingDetails.phoneNumber);
            setValue("country", shippingDetails.country);
            setValue("state", shippingDetails.state);
        }

        setStates(getStates('in'));
    }, []);

    function onSubmit(data) {
        dispatch(setShippingDetails(data));
        dispatch(setStep(2));
    }
    
    return (
        <div className='py-5 mx-3'>
            <div className='sm:w-[600px] border border-neutral-700 mx-auto flex flex-col items-center justify-center bg-neutral-700 rounded-lg py-10'>
                <p className='text-center text-3xl font-semibold text-white'>Shipping Details</p>
                
                <form className='flex items-center justify-center flex-col' onSubmit={handleSubmit(onSubmit)}>
                    <div className='relative mt-10'>
                        <AiFillHome className='absolute top-2 left-2 text-2xl text-neutral-800'/>
                        <input id='address' {...register("address")} className='sm:w-[350px] py-2 px-4 pl-10 rounded-xl' placeholder='Address' required/>
                    </div>

                    <div className='relative'>
                        <FaCity className='absolute top-7 left-2 text-2xl text-neutral-800'/>
                        <input id='city' {...register("city")} className='sm:w-[350px] py-2 px-4 pl-10 rounded-xl mt-5' placeholder='City' required/>
                    </div>

                    <div className='relative'>
                        <HiLocationMarker className='absolute top-7 left-2 text-2xl text-neutral-800'/>
                        <input id='pincode' {...register("pincode")} className='sm:w-[350px] py-2 px-4 pl-10 rounded-xl mt-5' placeholder='Pin Code' type='number' required/>
                    </div>

                    <div className='relative'>
                        <IoMdCall className='absolute top-7 left-2 text-2xl text-neutral-800'/>
                        <input id='phoneNumber' {...register("phoneNumber")} className='sm:w-[350px] py-2 px-4 pl-10 rounded-xl mt-5' placeholder='Phone Number' type='number' required minLength={10}/>
                    </div>
                    
                    <div className='relative'>
                        <BsGlobeCentralSouthAsia className='absolute top-7 left-2 text-2xl text-neutral-800'/>
                        <select id='country' {...register("country")} className='sm:w-[350px] w-[235px] py-2 px-4 pl-10 rounded-xl mt-5' required defaultValue={''}>
                            <option disabled value={''}>Select Country</option>
                            <option value='India'>India</option>
                        </select>
                    </div>

                    <div className='relative'>
                        <HiOutlineBuildingLibrary className='absolute top-7 left-2 text-2xl text-neutral-800'/>
                        <select id='state' {...register("state")} className='sm:w-[350px] w-[235px] py-2 px-4 pl-10 rounded-xl mt-5' required defaultValue={''}>
                            <option disabled value={''}>Select State</option>
                            {   
                                states.map((state, index) => (
                                    <option value={state} key={index}>{state}</option>
                                ))
                            }
                        </select>
                    </div>

                    <button type='submit' className='mt-10 bg-red-700 text-white font-semibold px-7 py-3 rounded-lg cursor-pointer
                    hover:bg-red-500 transition-all duration-200 ease-in hover:scale-105'>
                        Save
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ShippingDetailsForm