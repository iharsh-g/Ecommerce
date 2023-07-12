import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUser, updateUser } from '../../redux/services/operations/adminApi';
import Loader from '../../components/Loader';

const roles = ["Admin", "User"];

function UpdateUser() {
    const {id} = useParams();

    const navigate = useNavigate();
    const {userDetails} = useSelector((state) => state.user);
    const {token} = useSelector((state) => state.auth);
    const {userDetail, loading} = useSelector((state) => state.admin);
    const dispatch = useDispatch();

    const [role, setRole] = useState('');

    useEffect(() => {
        if(!token) {
            navigate("/login");
        }

        if(token && userDetails && userDetails?.role !== "Admin") {
            navigate("/account");
        }

        dispatch(fetchUser(id, token));
    }, [userDetails]);

    useEffect(() => {
        setRole(userDetail?.role);
    }, [userDetail])

    function updateHandler(id) {
        dispatch(updateUser(id, role, navigate, token))
    }

    return (
        <div>
            {
                loading ? <div className='min-h-[calc(100vh-235px)] flex items-center justify-center'><Loader/></div> :

                userDetail &&
                <div className='py-14 text-white'>
                    <div className='lg:max-w-[600px] lg:mx-auto mx-5 border lg:py-10 py-5 flex flex-col items-center bg-neutral-800 rounded-xl'>

                        <p className='sm:text-3xl text-2xl text-neutral-300 font-bold border-b-2 pb-3 border-neutral-700'>Update User</p>

                        <div className='mt-10 flex gap-5 items-center justify-center'>
                            <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${userDetail.name}`} className='sm:w-[50px] sm:h-[50px] w-[30px] h-[30px] rounded-full' alt=''></img>

                            <p className='rounded-xl text-2xl font-semibold'>{userDetail.name}</p>
                        </div>
                        
                        <p className='text-center mt-5 text-xl text-neutral-400'>{userDetail.email}</p>
                        <div className='flex flex-col items-center mt-7'>
                            <p className='font-semibold text-xl'>Created At</p>

                            {/* Converting Date in 12 June 2023, 10:23 AM (IST) */}
                            <p className='mt-2 text-lg text-neutral-400'>
                                {new Date(userDetail.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    })
                                },{' '}
                                {new Date(userDetail.createdAt).toLocaleTimeString('en-IN', {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                    timeZone: 'Asia/Kolkata',
                                }).replace(/\b(am|pm)\b/gi, match => match.toLocaleUpperCase())}
                                {' (IST)'}
                            </p>
                        </div>

                        <div className='flex items-center mt-5 gap-3'>
                            <p className='text-xl font-semibold'>Role:</p>
                            <select className='rounded-xl w-[200px] px-5 py-2 cursor-pointer text-black' value={role} onChange={(e) => setRole(e.target.value)}>
                                {roles.map((role, index) => (
                                    <option key={index} className='cursor-pointer' value={role}>{role}</option>
                                ))}
                            </select>
                        </div>

                        <div className='mt-10 bg-red-600 text-white font-semibold px-7 py-3 rounded-lg cursor-pointer
                        hover:bg-red-500 transition-all duration-200 ease-in hover:scale-105 flex gap-3 items-center' onClick={() => updateHandler(userDetail._id)}>
                            Update
                        </div>

                    </div>
                </div>
            }
        </div>
    )
}

export default UpdateUser