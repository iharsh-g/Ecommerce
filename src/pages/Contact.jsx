import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import countryData from '../data/countryData';
import { contact } from '../redux/services/api';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../redux/services/apiConnector';

function Contact() {
    const {register, handleSubmit, formState: {isSubmitSuccessful}, reset} = useForm();

    useEffect(() => {
        if(isSubmitSuccessful) {
            reset({
                email: "",
                name: "",
                message: "",
                phoneNo: "",
            })
        }
    }, [reset, isSubmitSuccessful]);

    async function onSubmit(data) {

        const toastId = toast.loading("Loading...");

        try {
            const response = await apiConnector("POST", contact.CONTACT_US, data);

            if(!response?.data?.success) {
                throw new Error("Cannot Possible!");
            }

            toast.success(response?.data?.message);
        }
        catch(error) {
            console.log("COntact api error-----", error);
            toast.error("Not Possible, Please try after some time.")
        }

        toast.dismiss(toastId);
    }

    return (
        <div className='min-h-[70vh] flex items-center justify-start flex-col py-5 gap-2'>
            <p className='text-4xl font-bold'>Contact Us</p>
            <p className=' text-lg text-neutral-400 font-semibold tracking-wide text-center'>You're welcome to contact us with any inquiry </p>
            <p className='text-neutral-500'>Tel: 123-456-7890    |    info@mysite.com</p>
            
            <div className='sm:w-[600px] sm:mx-auto mx-2 mt-5 p-7 bg-neutral-700 text-white rounded-xl'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    
                    {/* Name */}
                    <div>
                        <label htmlFor='name'>Full Name <sup className='text-red-500'>*</sup></label>
                        <input id='name' name='name' {...register("name")} required className='w-full py-3 rounded-xl bg-neutral-300 text-black px-7 mt-2 placeholder:text-neutral-600' placeholder='Enter Full Name'/>
                    </div>

                    {/* Email */}
                    <div className='mt-4'>
                        <label htmlFor='email'>Email <sup className='text-red-500'>*</sup></label>
                        <input id='email' name='email' {...register("email")} required className='w-full py-3 rounded-xl bg-neutral-300 text-black px-7 mt-2 placeholder:text-neutral-600' placeholder='Enter Email Address'/>
                    </div>

                    {/* Number */}
                    <div className='mt-4'>
                        <label htmlFor='number'>Phone Number <sup className='text-red-500'>*</sup></label>
                        <div className='flex w-full sm:flex-row flex-col gap-4 justify-center items-center mt-2'>
                            <select name='dropdown' id='dropdown' {...register("countrycode")} required className='sm:w-[20%] w-full px-3 py-3 rounded-xl text-black bg-neutral-300'>
                                {
                                    countryData.map((ele, index) => (
                                        <option key={index} value={ele?.code}>{ele?.code}</option>
                                    ))
                                }
                            </select>

                            <input id='phoneNo' name='phoneNo' {...register("phoneNo", {required: true, minLength: "10"})} required className='sm:w-[80%] w-full py-3 rounded-xl bg-neutral-300 text-black px-7 placeholder:text-neutral-600' type='number' placeholder='Enter Phone Number'/>
                        </div>
                    </div>

                    {/* Message */}
                    <div className='mt-4'>
                        <label htmlFor='message'>Message <sup className='text-red-500'>*</sup></label>
                        <textarea id='message' name='message' {...register("message")} required className='w-full min-h-[150px] py-3 rounded-xl bg-neutral-300 text-black px-7 mt-2 placeholder:text-neutral-600' type='number' placeholder='Enter Message'/>
                    </div>

                    <div className='mt-5 flex w-full items-center justify-center'>
                        <button className='bg-red-500 px-5 py-2 rounded-md hover:bg-red-700 transition-all duration-200' type='submit'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Contact