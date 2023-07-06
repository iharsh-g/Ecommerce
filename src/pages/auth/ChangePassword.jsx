import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import {AiFillEyeInvisible, AiFillEye} from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { changePassword } from '../../redux/services/operations/authApi';
import { BsFillKeyFill } from 'react-icons/bs'
import {FaUnlock, FaLock} from 'react-icons/fa'

function ChangePassword() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if(!token) {
            navigate("/login");
        }
    })

    async function changePasswordHandler(data) {
        if(!data.oldPassword || !data.newPassword || !data.confirmPassword) {
            toast.error("All fields are required")
            return;
        }

        if(data.newPassword !== data.confirmPassword) {
            toast.error("New Password and Confirm Password should be matched")
            return;
        }

        dispatch(changePassword(data, navigate));
    }

    return (
        <div className='py-10'>
            <div className='lg:max-w-[600px] lg:mx-auto mx-5 border lg:py-10 py-5 flex flex-col items-center bg-neutral-800 rounded-xl'>
                <p className='sm:text-3xl text-2xl text-neutral-300 font-bold border-b-2 pb-3 border-neutral-700'>Set New Password</p>
                
                <div className='relative text-neutral-600'>
                    <input type={`${oldPasswordVisible ? 'text' : 'password'}`} placeholder='Enter Old Password' className='sm:w-[350px] py-2 px-4 pl-10 rounded-xl mt-10'
                        {...register("oldPassword")}
                    />
                    {   
                        <div className='absolute top-12 right-5 cursor-pointer' onClick={() => setOldPasswordVisible(!oldPasswordVisible)}>
                            {oldPasswordVisible ? <AiFillEyeInvisible fontSize={'1.5rem'}/> : <AiFillEye fontSize={'1.5rem'}/>}
                        </div>
                    }
                    <BsFillKeyFill fontSize={'1.3rem'} className='absolute top-12 left-2'/>
                </div>

                <div className='relative text-neutral-600'>
                    <input type={`${newPasswordVisible ? 'text' : 'password'}`} placeholder='Enter New Password' className='sm:w-[350px] py-2 px-4 pl-10 rounded-xl mt-10'
                        {...register("newPassword")}
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
                        {...register("confirmPassword")}
                    />
                    {   
                        <div className='absolute top-12 right-5 cursor-pointer' onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                            {confirmPasswordVisible ? <AiFillEyeInvisible fontSize={'1.5rem'}/> : <AiFillEye fontSize={'1.5rem'}/>}
                        </div>
                    }
                    <FaLock fontSize={'1.3rem'} className='absolute top-12 left-2'/>
                </div>

                <div className='mt-10 bg-red-700 text-white font-semibold px-7 py-3 rounded-lg cursor-pointer
                hover:bg-red-500 transition-all duration-200 ease-in hover:scale-105' onClick={handleSubmit(changePasswordHandler)}>
                    Change Password
                </div>
            </div>
        </div>
    )
}

export default ChangePassword