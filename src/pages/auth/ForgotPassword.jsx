import React, { useState } from 'react'
import { MdEmail } from 'react-icons/md'
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../redux/services/operations/authApi';

function ForgotPassword() {
    const dispatch = useDispatch();
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState('');

    function submitHandler() {
        if(!email.includes("@") || !email.includes(".com")) {
            toast.error("Enter valid Email ID");
            return;
        }

        dispatch(forgotPassword(email, setEmailSent));
    }

    return (
        <div className='min-h-[549px] flex items-center justify-center'>
            
            <div className='lg:max-w-[600px] lg:mx-auto mx-5 border lg:py-10 py-5 flex flex-col items-center bg-neutral-800 rounded-xl'>
                <p className='sm:text-3xl text-2xl text-neutral-300 font-bold'>
                    {
                        !emailSent ? "Forgot Password" : "Check Email"
                    }
                </p>

                <p className='text-neutral-300 px-10 mt-5'>
                    {
                        !emailSent ?
                        "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery" : 
                        `We have sent the reset email to ${email}`
                    }
                </p>
                
                {
                    !emailSent &&
                    <div className='relative text-neutral-600'>
                        <input type='email' placeholder='Enter Email Address' className='sm:w-[350px] py-2 mt-10 px-4 pl-10 rounded-xl' value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <MdEmail fontSize={'1.5rem'} className='absolute top-12 left-2'/>
                    </div>
                }

                <div className='bg-red-700 w-fit px-8 py-3 text-white font-semibold rounded-lg mt-14
                    hover:bg-red-500 cursor-pointer transition-all duration-200 hover:scale-95' onClick={submitHandler}>
                    {!emailSent ? 'Verify Email' : 'Resend Email'}
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword