import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { HiPencilSquare } from 'react-icons/hi2';
import { RiLockPasswordLine } from 'react-icons/ri';
import {toast} from 'react-hot-toast'
import { updateUserName } from '../../redux/services/operations/authApi';
import Loader from '../../components/Loader'

function Account() {
    const dispatch = useDispatch();
    const {isLoading, userDetails} = useSelector((state) => state.user);
    const {token} = useSelector((state) => state.auth);

    const navigate = useNavigate();

    useEffect(() => {
        if(!token) {
            navigate("/login");
        }
    }, []);

    const [clickedPencil, setClickedPencil] = useState(false);
    const [name, setName] = useState('');

    async function saveNameHandler() {
        if(name === '') {
            toast.error("Provide user name");
            setClickedPencil(false);
            return;
        }

        dispatch(updateUserName(name));
        setClickedPencil(false);
    }

    return (
        <>
        {
            isLoading === true ?
            <div className='min-h-[calc(100vh-235px)] flex items-center justify-center'><Loader/></div> :
            userDetails &&
            <div className='py-10'>
                <div className='lg:max-w-[600px] lg:mx-auto mx-5 border lg:py-10 py-5 flex flex-col items-center bg-neutral-800 rounded-xl'>

                    <p className='sm:text-3xl text-2xl text-neutral-200 font-bold border-b-2 pb-3 border-neutral-700'>Profile Details</p>
                    
                    <div className=' mt-10 flex gap-5 items-center'>
                        <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${userDetails.name}`} className='sm:w-[50px] sm:h-[50px] w-[30px] h-[30px] rounded-full' alt=''></img>

                        <div className='sm:text-2xl text-xl font-semibold flex items-center gap-3'>

                            <p className={`${clickedPencil ? 'hidden' : 'block'} text-white`}>{userDetails.name}</p>

                            <input className={`${clickedPencil ? 'block' : 'hidden'} rounded-xl w-[200px] px-5 py-2 text-sm`} type='text' value={name} onChange={(e) => setName(e.target.value)}/>

                            <HiPencilSquare className={`cursor-pointer text-base text-neutral-300`} onClick={() => setClickedPencil(!clickedPencil)}/>

                            <div className={`bg-red-700 text-white text-sm font-semibold px-2 py-1 rounded-lg cursor-pointer
                            hover:bg-red-500 transition-all duration-200 ease-in ${clickedPencil ? 'block' : 'hidden'}`} onClick={saveNameHandler}>
                                Save
                            </div>
                        </div>
                    </div>

                    <p className='text-center mt-5 text-xl text-neutral-300'>{userDetails.email}</p>

                    <div className='flex flex-col items-center mt-7'>
                        <p className='font-semibold text-xl text-white'>Created At</p>

                        {/* Converting Date in 12 June 2023, 10:23 AM (IST) */}
                        <p className='mt-2 text-lg text-neutral-300'>
                            {new Date(userDetails.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                })
                            },{' '}
                            {new Date(userDetails.createdAt).toLocaleTimeString('en-IN', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                                timeZone: 'Asia/Kolkata',
                            }).replace(/\b(am|pm)\b/gi, match => match.toLocaleUpperCase())}
                            {' (IST)'}
                        </p>
                    </div>

                    <Link to={"/password/change"}>
                        <div className='mt-10 bg-red-700 text-white font-semibold px-7 py-3 rounded-lg cursor-pointer
                        hover:bg-red-500 transition-all duration-200 ease-in hover:scale-105 flex gap-3 items-center'>
                            <RiLockPasswordLine/>
                            Change Password
                        </div>
                    </Link>
                </div>
            </div>
            
        }
        </>
    )
}

export default Account