import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {AiFillEyeInvisible, AiFillEye} from 'react-icons/ai'
import {FaUnlock, FaLock} from 'react-icons/fa'
import {useDispatch} from 'react-redux';
import {forgotPasswordToken} from '../../redux/services/operations/authApi'

function ForgotPasswordToken() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();

    function submitHandler() {
        if(!newPassword || !confirmPassword) {
            toast.error("All fields are required.");
            return;
        }

        if(newPassword !== confirmPassword) {
            toast.error("Both Passwords should be matched");
            return;
        }

        dispatch(forgotPasswordToken(newPassword, confirmPassword, token, navigate));
    }
    
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    return (
        <div className='min-h-[549px] flex items-center justify-center'>

            <div className='lg:max-w-[600px] lg:mx-auto mx-5 border lg:py-10 py-5 flex flex-col items-center bg-neutral-800 rounded-xl'>
                <p className='sm:text-3xl text-2xl text-neutral-200 font-bold'>Choose New Password</p>

                <p className=' text-neutral-300 mt-5 px-5'>Almost done. Enter your new password and youre all set.</p>

                <div className='relative text-neutral-600'>
                    <input type={`${newPasswordVisible ? 'text' : 'password'}`} placeholder='Enter New Password' className='sm:w-[350px] py-2 px-4 pl-10 rounded-xl mt-10'
                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {   
                        <div className='absolute top-12 right-5 cursor-pointer' onClick={() => setNewPasswordVisible(!newPasswordVisible)}>
                            {newPasswordVisible ? <AiFillEyeInvisible fontSize={'1.5rem'}/> : <AiFillEye fontSize={'1.5rem'}/>}
                        </div>
                    }
                    <FaUnlock fontSize={'1.3rem'} className='absolute top-12 left-2'/>
                </div>

                <div className='relative text-neutral-600'>
                    <input type={`${confirmPasswordVisible ? 'text' : 'password'}`} placeholder='Enter Confirm Password' className='sm:w-[350px] py-2 px-4 pl-10 rounded-xl mt-10'
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {   
                        <div className='absolute top-12 right-5 cursor-pointer' onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                            {confirmPasswordVisible ? <AiFillEyeInvisible fontSize={'1.5rem'}/> : <AiFillEye fontSize={'1.5rem'}/>}
                        </div>
                    }
                    <FaLock fontSize={'1.3rem'} className='absolute top-12 left-2'/>
                </div>

                <div className='bg-red-700 w-fit px-8 py-3 text-white font-semibold rounded-lg mt-14
                    hover:bg-red-500 cursor-pointer transition-all duration-200 hover:scale-95' onClick={submitHandler}>
                    Submit
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordToken