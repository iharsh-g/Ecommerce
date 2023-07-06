import React, { useState } from 'react'
import ProductCard from '../components/ProductCard';
import {BsSearch} from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/services/operations/productApi';
import Loader from '../components/Loader';

function Search() {
    const [keyword, setKeyword] = useState('');

    const dispatch = useDispatch();
    const {allProducts, isLoading} = useSelector((state) => state.products);

    function submitHandler() {
        dispatch(fetchProducts(true, keyword))
    }

    return (
        <div>
            <div className='w-[1200px] mx-auto flex flex-col items-center min-h-[600px]'>
                <div className='flex items-center'>
                    <input className='w-[800px] border px-5 py-3 rounded-l-xl' placeholder='Search a Product...' onChange={(e) => setKeyword(e.target.value)}/>

                    <div className='px-5 py-3 rounded-r-xl bg-red-500 hover:bg-red-700 transition-all duration-300 text-white cursor-pointer' onClick={submitHandler}>
                        <BsSearch fontSize={'1.5rem'}/>
                    </div>
                </div>

                <div className=' grid md:grid-cols-4 grid-cols-2 gap-x-5 gap-y-3 px-3 py-3 items-baseline'>
                    {
                        allProducts &&
                        allProducts.length === 0 ? 
                        <div className='min-h-[calc(100vh-275px)] col-span-full font-bold flex items-center justify-center text-2xl w-full'><p>No Products Found!</p></div>:
                        allProducts?.map((product) => 
                            <ProductCard key={product?._id} product={product}/>
                        )
                    }
                </div>

                {
                    isLoading && 
                    <div className='min-h-[calc(100vh-235px)] flex items-center justify-center'><Loader/></div> 
                }
            </div>
        </div>
    )
}

export default Search