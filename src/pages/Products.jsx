import React, { useEffect, useState } from 'react'
import Product from '../components/Product'
import {AiFillFilter} from 'react-icons/ai';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from 'react-js-pagination';
import { fetchFilterProducts } from '../redux/services/operations/productApi';
import Loader from '../components/Loader';

function valuetext(value) {
    return value
}

const categories = ["All", "Laptop", "TV", "Mobile", "Footwear", "Refrigerators"]

function Products() {
    //Open Filter Div
    const [openFilter, setOpenFilter] = useState(false);

    //Filter Properties
    const [value, setValue] = React.useState([2000, 250000]);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    //Redux
    const dispatch = useDispatch();
    const {filteredProducts, isLoading} = useSelector((state) => state.products);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    function setCurrentPageNo(e) {
        setCurrentPage(e);
    }

    //Rating
    const [rating, setRating] = useState(0);
    function ratingChangeHandler(event, newValue) {
        setRating(newValue);
    }

    //Category
    const [category, setCategory] = useState('All');

    function fetchFilteredProducts() {
        dispatch(fetchFilterProducts(category, currentPage, value, rating))
    }

    //First time calling or currentpage changed
    useEffect(() => {
        fetchFilteredProducts();
    }, [currentPage]);

    function applyFilterHandler() {
        setOpenFilter(!openFilter);
        fetchFilteredProducts();
    }

    return (
        <div className='relative'>
            <div className='lg:w-[1200px] mx-auto relative'>
                {
                    filteredProducts?.data &&
                    filteredProducts.data.length === 0 ?
                    <div className='min-h-[69vh] flex items-center justify-center'><p className='text-2xl'>No Products Found!</p></div> :
                    <div>
                        <Product products = {filteredProducts?.data}/>
                        <div className='flex flex-row justify-center py-10'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={filteredProducts?.resultPerPage}
                                totalItemsCount={filteredProducts?.productCounts}
                                onChange={setCurrentPageNo}
                                nextPageText={'Next'}
                                prevPageText={'Prev'}
                                firstPageText={'1st'}
                                lastPageText={'Last'}
                                itemClass='page-item'
                                linkClass='page-link'
                                activeClass='pageItemActive'
                                activeLinkClass='pageLinkActive'
                            />
                        </div>
                    </div>
                }

                {/* Pagination
                {   
                    allProducts.resultPerPage < allProducts.productCounts &&
                    
                } */}

                {/* Filer Div Name */}
                <div className='absolute lg:top-0 lg:-left-[5rem] top-0 sm:left-[2rem] left-2 z-[15] bg-neutral-200 text-yellow-400 px-5 py-5 rounded-2xl cursor-pointer' onClick={() => setOpenFilter(!openFilter)}>
                    <AiFillFilter fontSize={'2rem'}/>
                    <p className='font-bold'>Filter</p>
                </div>

                {/* Filter DIV */}
                <div className={`${openFilter ? 'min-w-[300px] opacity-100 z-[15]' : 'w-0 opacity-0'} bg-neutral-200 transition-all duration-400 ease-in  min-h-[500px]
                absolute lg:top-0 top-32 sm:left-[2rem] left-2 ${openFilter ? 'transform translate-x-0' : 'transform -translate-x-full'} rounded-2xl`}>

                    <p className='text-xl text-center my-5'>Filters</p>
                    <p className='ml-5 text-lg'>Price</p>
                    <div className='flex items-center justify-center'>
                        <Box sx={{ width: 200 }}>
                            <Slider
                                getAriaLabel={() => 'Temperature range'}
                                value={value}
                                onChange={handleChange}
                                valueLabelDisplay="auto"
                                getAriaValueText={valuetext}
                                min={2000}
                                max={300000}
                            />
                        </Box>
                    </div>

                    <p className='ml-5 text-lg'>Categories</p>
                    <div className='ml-7 text-neutral-600 font-semibold'>
                        {categories.map((c, index) => (
                            <p key={index} className={`hover:text-red-500 cursor-pointer transition-all duration-300
                             ${category === c ? 'text-red-400': 'text-neutral-600'}`} onClick={() => setCategory(c)}>{c}</p>
                        ))}
                    </div>

                    <p className='ml-5 text-lg my-5'>Ratings</p>
                    <div className='w-[200px] mx-auto'>
                        <Slider
                            getAriaLabel={() => 'Temperature range'}
                            getAriaValueText={valuetext}
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={5}
                            onChange={ratingChangeHandler}
                            value={rating}
                        />
                    </div>
                    
                    <div className='flex justify-center items-center my-5'>
                        <div className='bg-yellow-400 px-3 py-3 rounded-lg text-white font-semibold 
                        cursor-pointer text-center w-[100px]' onClick={applyFilterHandler}>Apply</div>
                    </div>
                </div>

            </div>

            {
                isLoading && 
                <div className='min-h-[calc(100vh-235px)] flex items-center justify-center'><Loader/></div> 
            }

            <div className={`${openFilter ? 'min-w-[300px] opacity-100 z-[10]' : 'w-0 opacity-0'} backdrop-blur-md fixed inset-0 z-[5]`} onClick={() => setOpenFilter(!openFilter)}></div>
        </div>
        
    )
}

export default Products