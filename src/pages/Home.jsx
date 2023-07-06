import React, { useEffect } from 'react'
import Product from '../components/Product'
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/services/operations/productApi';
import Loader from '../components/Loader'

function Home() {
    const dispatch = useDispatch();
    const {allProducts, isLoading} = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts(false, ''));
    }, []);
    
    return (
        <div className='max-w-[1200px] mx-auto h-full relative'>
        {
            allProducts && allProducts?.length > 0 &&
            <Product products = {allProducts}/>
        }

        {
            allProducts && allProducts?.length === 0 &&
            <div className='min-h-[69vh] flex items-center justify-center'><p className='text-2xl'>No Products Found!</p></div>
        }

        {
            isLoading && 
            <div className='min-h-[calc(100vh-235px)] flex items-center justify-center'><Loader/></div> 
        }
        </div>
    )
}

export default Home