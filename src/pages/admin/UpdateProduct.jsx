import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProductDetails, updateProduct } from '../../redux/services/operations/adminApi'
import { HiPencilSquare } from 'react-icons/hi2';
import { MdCategory, MdDescription } from 'react-icons/md';
import { IoMdPricetags } from 'react-icons/io';
import { AiOutlineStock } from 'react-icons/ai';
import Loader from '../../components/Loader';
import { useForm } from 'react-hook-form';
import Upload from '../../components/Admin/Upload';
import { toast } from 'react-hot-toast';

const categories = ["Laptop", "TV", "Mobile", "Footwear", "Refrigerators"]

function UpdateProduct() {
    const {id} = useParams();

    const navigate = useNavigate();
    const {userDetails} = useSelector((state) => state.user);
    const {token} = useSelector((state) => state.auth);
    const {productDetails, loading} = useSelector((state) => state.admin);
    const dispatch = useDispatch();
    const {register, handleSubmit, formState: {errors}, setValue, getValues} = useForm();

    useEffect(() => {
        setValue("name", productDetails?.name);
        setValue("description", productDetails?.description);
        setValue("price", productDetails?.price);
        setValue("stock", productDetails?.stock);
        setValue("category", productDetails?.category);
        
        //for image Upload components have the data
    }, [productDetails]);

    useEffect(() => {
        if(!token) {
            navigate("/login");
        }

        if(token && userDetails && userDetails?.role !== "Admin") {
            navigate("/account");
        }

        dispatch(fetchProductDetails(id, token));
    }, [userDetails]);

    function isFormUpdated() {
        const currentValues = getValues();
        const thumbnailUrls = productDetails?.images?.map((image) => image.url);

        if( currentValues.name !== productDetails?.name || 
            currentValues.description !== productDetails?.description ||
            currentValues.price !== productDetails?.price ||
            currentValues.stock !== productDetails?.stock ||
            currentValues.category !== productDetails?.category ||
            !thumbnailUrls.includes(currentValues.thumbnail))  {
            return true;
        }
        else {
            return false;
        }
    }

    function updateHandler(data) {
        if(isFormUpdated()) {
            const currentValues = getValues();
            const thumbnailUrls = productDetails?.images?.map((image) => image.url);

            const formData = new FormData();

            if(currentValues.name !== productDetails?.name) {
                formData.append("name", data.name);
            }

            if(currentValues.description !== productDetails?.description) {
                formData.append("description", data.description);
            }

            if(currentValues.price !== productDetails?.price) {
                formData.append("price", data.price);
            }

            if(currentValues.stock !== productDetails?.stock) {
                formData.append("stock", data.stock);
            }

            if(currentValues.category !== productDetails?.category) {
                formData.append("category", data.category);
            }

            for (let i = 0; i < currentValues?.thumbnail?.length; i++) {
                if (!thumbnailUrls.includes(currentValues.thumbnail[i])) {
                    data?.thumbnail?.forEach((image) => {
                        formData.append("images", image);
                    })
                    break;
                }
            }

            dispatch(updateProduct(id, formData, navigate, token));
        }
        else {
            toast.error("No Changes Made to the Product!");
        }
    }

    return (
        <div>
            {
                loading ? <div className='min-h-[calc(100vh-235px)] flex items-center justify-center'><Loader/></div> :
                <div className='py-12'>
                    <div className='lg:max-w-[600px] lg:mx-auto mx-5 border lg:py-10 py-5 bg-neutral-800 rounded-xl'>
                        <p className='sm:text-3xl text-2xl text-neutral-300 font-bold text-center'>Update Product</p>

                        <form className='flex flex-col items-center '  onSubmit={handleSubmit(updateHandler)}>
                            <div className='relative text-neutral-600'>
                                <input type='text' placeholder='Enter Product Name' className='sm:w-[350px] py-2 mt-10 px-4 pl-12 rounded-xl'  {...register("name", {required: true})} required/>
                                <HiPencilSquare fontSize={'1.5rem'} className='absolute top-12 left-4'/>
                            </div>

                            <div className='relative text-neutral-600'>
                                <input type='text' placeholder='Enter Product Description' className='sm:w-[350px] py-2 mt-5 px-4 pl-12 rounded-xl'   {...register("description", {required: true})} required />
                                <MdDescription fontSize={'1.5rem'} className='absolute top-7 left-4'/>
                            </div>

                            <div className='relative text-neutral-600'>
                                <input type='number' placeholder='Enter Product Price in (Rs)' className='sm:w-[350px] py-2 mt-5 px-4 pl-12 rounded-xl'   {...register("price", {required: true})} required />
                                <IoMdPricetags fontSize={'1.5rem'} className='absolute top-7 left-4'/>
                            </div>

                            <div className='relative text-neutral-600'>
                                <select  className='sm:w-[350px] w-[245px] py-2 mt-5 px-4 pl-12 rounded-xl' required {...register("category", {required: true})}>
                                    {
                                        categories.map((cat, index) => (
                                            <option key={index} value={cat} >{cat}</option>
                                        ))
                                    }
                                </select>
                                <MdCategory fontSize={'1.5rem'} className='absolute top-7 left-4'/>
                            </div>

                            <div className='relative text-neutral-600'>
                                <input type='number' placeholder='Enter Product Stock' className='sm:w-[350px] py-2 mt-5 px-4 pl-12 rounded-xl' {...register("stock", {required: true})} required />
                                <AiOutlineStock fontSize={'1.5rem'} className='absolute top-7 left-4'/>
                            </div>

                            <Upload name={"thumbnail"} label={"Product Thumbnail"} register={register} setValue={setValue} errors={errors} editData={productDetails?.images}/>

                            <button type='submit' className='bg-red-700 w-fit px-8 py-3 text-white font-semibold rounded-lg mt-14
                                hover:bg-red-500 cursor-pointer transition-all duration-200 hover:scale-95'>
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            }
        </div>
    )
}

export default UpdateProduct