import React, { useEffect, useState } from 'react'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import { MdEmail } from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'
import { RxAvatar } from 'react-icons/rx'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { signupUser } from '../../redux/services/operations/authApi'

function SignUp() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.auth);

    useEffect(() => {
        if(token) 
            navigate("/account");
    }, [token, navigate]);

    async function submitHandler(data) {
        
        if(!data.email.includes("@") || !data.email.includes(".com")) {
            toast.warning("Enter valid Email ID");
            return;
        }

        const { name, email, password } = data;
        const avatar = {
            public_id: "Sample",
            url: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`
        };
        
        // console.log("URL", `https://api.dicebear.com/5.x/initials/svg?seed=${name}`);
        const body = {
            name,
            email,
            password,
            avatar,
            role: "User"
        };
        
        dispatch(signupUser(body, navigate));
    }

    return (
        <div className='py-12'>
            <div className='lg:max-w-[600px] lg:mx-auto mx-5 border border-white border-opacity-25 lg:py-10 py-5 flex flex-col items-center bg-neutral-800 rounded-xl'>
                <p className='sm:text-3xl text-2xl text-neutral-300 font-bold'>Signup Ecommerce</p>

                <div className='relative text-neutral-800'>
                    <input type='text' placeholder='Enter Your Name' className='sm:w-[350px] py-2 mt-10 px-4 pl-10 rounded-xl'  {...register("name")} />
                    <RxAvatar fontSize={'1.5rem'} className='absolute top-12 left-2'/>
                </div>

                <div className='relative text-neutral-800'>
                    <input type='email' placeholder='Enter Email Address' className='sm:w-[350px] py-2 mt-10 px-4 pl-10 rounded-xl'  {...register("email")} />
                    <MdEmail fontSize={'1.5rem'} className='absolute top-12 left-2'/>
                </div>
                
                <div className='relative text-neutral-800'>
                    <input type={`${passwordVisible ? 'text' : 'password'}`} placeholder='Enter Password' className='sm:w-[350px] py-2 px-4 pl-10 rounded-xl mt-10'
                        {...register("password")}
                    />
                    {   
                        <div className='absolute top-12 right-5 cursor-pointer' onClick={() => setPasswordVisible(!passwordVisible)}>
                            {passwordVisible ? <AiFillEyeInvisible fontSize={'1.5rem'}/> : <AiFillEye fontSize={'1.5rem'}/>}
                        </div>
                    }
                    <RiLockPasswordFill fontSize={'1.5rem'} className='absolute top-12 left-2'/>
                </div>

                <div className='relative text-neutral-800'>
                    <input type={`${confirmPasswordVisible ? 'text' : 'password'}`} placeholder='Confirm Password' className='sm:w-[350px] py-2 px-4 pl-10 rounded-xl mt-10'
                        {...register("confirmPassword")}
                    />
                    {   
                        <div className='absolute top-12 right-5 cursor-pointer' onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                            {confirmPasswordVisible ? <AiFillEyeInvisible fontSize={'1.5rem'}/> : <AiFillEye fontSize={'1.5rem'}/>}
                        </div>
                    }
                    <RiLockPasswordFill fontSize={'1.5rem'} className='absolute top-12 left-2'/>
                </div>

                <div className='bg-red-500 w-fit px-8 py-3 text-white font-semibold rounded-lg mt-14
                 hover:bg-red-400 cursor-pointer transition-all duration-200 hover:scale-95' onClick={handleSubmit(submitHandler)}>
                    Submit
                </div>
                
                <p className='mt-4 text-indigo-400 font-semibold cursor-pointer sm:text-lg'>Already Registered? {" "}
                    <Link to={"/login"} className='text-green-600 hover:text-green-400 transition-all duration-200'>Login Here</Link>
                </p>
            </div>
        </div>
    )
}

export default SignUp