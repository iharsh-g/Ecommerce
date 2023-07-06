import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { HiPencilSquare } from 'react-icons/hi2';
import { MdCategory, MdDescription } from 'react-icons/md';
import { IoMdPricetags } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AiOutlineStock } from 'react-icons/ai';
import { createProduct } from '../../redux/services/operations/adminApi';
import Loader from '../../components/Loader';
import Sidebar from '../../components/Admin/Sidebar';
import Upload from '../../components/Admin/Upload';

const categories = ["Laptop", "TV", "Mobile", "Footwear", "Refrigerators"]

function CreateProducts() {
    const navigate = useNavigate();
    const {userDetails, isLoading} = useSelector((state) => state.user);
    const {token} = useSelector((state) => state.auth);
    const {register, handleSubmit, formState: {errors}, setValue} = useForm();
    const dispatch = useDispatch();

    useEffect(() =>  {
        if(!token) {
            navigate("/login");
        }

        if(token && userDetails && userDetails?.role !== "Admin") {
            navigate("/account");
        }

    }, [userDetails])

    function submitHandler(data) {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("category", data.category);
        formData.append("stock", data.stock);

        data?.thumbnail?.forEach((image) => {
            formData.append("images", image);
        })

        dispatch(createProduct(formData, navigate, token));
    }

    return (
        <>
            {
                isLoading ? <div className='min-h-[calc(100vh-235px)] flex items-center justify-center'><Loader/></div> :
                <div className='flex min-h-[73vh] gap-10 min-[1080px]:flex-row flex-col'>
                    <div>
                        <div className='min-[1080px]:block hidden h-full'>
                            <Sidebar/>
                        </div>
                    </div>

                    <div className='py-10 w-full px-2'>
                        <div className='max-w-[600px] mx-auto border py-10 bg-neutral-800 rounded-xl'>
                            <p className='sm:text-3xl text-2xl text-neutral-300 font-bold text-center'>Create Product</p>

                            <form className='flex flex-col items-center' onSubmit={handleSubmit(submitHandler)}>
                                <div className='relative text-neutral-600'>
                                    <input type='text' placeholder='Enter Product Name' className='sm:w-[350px] py-2 mt-10 px-4 pl-12 rounded-xl'  {...register("name", {required: true})} required />
                                    <HiPencilSquare fontSize={'1.5rem'} className='absolute top-12 left-4'/>
                                </div>

                                <div className='relative text-neutral-600'>
                                    <input type='text' placeholder='Enter Product Description' className='sm:w-[350px] py-2 mt-5 px-4 pl-12 rounded-xl'  {...register("description", {required: true})} required />
                                    <MdDescription fontSize={'1.5rem'} className='absolute top-7 left-4'/>
                                </div>

                                <div className='relative text-neutral-600'>
                                    <input type='number' placeholder='Enter Product Price in (Rs)' className='sm:w-[350px] py-2 mt-5 px-4 pl-12 rounded-xl'  {...register("price", {required: true})} required />
                                    <IoMdPricetags fontSize={'1.5rem'} className='absolute top-7 left-4'/>
                                </div>

                                <div className='relative text-neutral-600'>
                                    <select  className='sm:w-[350px] py-2 mt-5 px-4 pl-12 rounded-xl w-[245px]' required  {...register("category", {required: true})}>
                                        {
                                            categories.map((cat, index) => (
                                                <option key={index} value={cat}>{cat}</option>
                                            ))
                                        }
                                    </select>
                                    <MdCategory fontSize={'1.5rem'} className='absolute top-7 left-4'/>
                                </div>

                                <div className='relative text-neutral-600'>
                                    <input type='number' placeholder='Enter Product Stock' className='sm:w-[350px] py-2 mt-5 px-4 pl-12 rounded-xl'  {...register("stock", {required: true})} required />
                                    <AiOutlineStock fontSize={'1.5rem'} className='absolute top-7 left-4'/>
                                </div>

                                <Upload name={"thumbnail"} label={"Product Thumbnail"} register={register} setValue={setValue} errors={errors}/>

                                <button type='submit' className='bg-red-700 w-fit px-8 py-3 text-white font-semibold rounded-lg mt-14
                                    hover:bg-red-500 cursor-pointer transition-all duration-200 hover:scale-95'>
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                
            }
        </>
    )
}

export default CreateProducts