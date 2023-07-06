import React, { useEffect, useState } from 'react'
import {AiFillEyeInvisible, AiFillEye} from 'react-icons/ai'
import {MdEmail} from 'react-icons/md'
import {RiLockPasswordFill} from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import {toast} from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../../redux/services/operations/authApi'

function Login() {
    
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.auth)

    useEffect(() => {
        if(token)
            navigate("/");  
    }, [token, navigate]);

    async function submitHandler(data) {
        if(!data.email.includes("@") || !data.email.includes(".com")) {
            toast.warning("Enter valid Email ID");
            return;
        }

        dispatch(loginUser(data));
    }

    return (
        <div className='py-12'>
            <div className='lg:max-w-[600px] lg:mx-auto mx-5 border border-white border-opacity-25 lg:py-10 py-5 flex flex-col items-center bg-neutral-800 rounded-xl'>
                <p className='sm:text-3xl text-2xl text-neutral-200 font-bold'>Login Ecommerce</p>

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

                <p className='place-self-end sm:mr-32 mr-10 mt-4 text-red-400 font-semibold cursor-pointer'><Link to={"/password/forgot"}>Forgot Password?</Link></p>

                <div className='bg-red-700 w-fit px-8 py-3 text-white font-semibold rounded-lg mt-14
                    hover:bg-red-500 cursor-pointer transition-all duration-200 hover:scale-95' onClick={handleSubmit(submitHandler)}>
                    Submit
                </div>
                
                <p className='mt-4 text-indigo-400 font-semibold sm:text-lg'>Not Registered? {" "}
                    <Link to={"/signup"} className='text-green-600 hover:text-green-400 transition-all duration-200 cursor-pointer'>Register Here</Link>
                </p>
            </div>
        </div>
    )
}

export default Login