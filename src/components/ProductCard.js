import React from 'react'
import {Rating, ThinStar} from "@smastrom/react-rating"
import '@smastrom/react-rating/style.css'
import { useNavigate } from 'react-router-dom'

const myStyles = {
  itemShapes: ThinStar,
  activeFillColor: '#ffb700',
  inactiveFillColor: '#fbf1a9'
}

function ProductCard({product}) {
    const navigator = useNavigate();

    function clickHandler(){ 
        navigator(`/product/${product._id}`);
    }

    return (
        <div className='rounded-md flex flex-col items-center gap-3 py-5 px-2 hover:scale-110 hover:z-[10] transition-all duration-500
            hover:shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] hover:cursor-pointer text-black group hover:bg-blue-950 hover:text-white' onClick={clickHandler}>

            <img src={product.images[0].url} className='w-[200px] h-[200px] object-cover' alt=''></img>
            <p className='font-semibold text-center tracking-wide md:text-lg'>{product.name}</p>

            <div className='flex flex-col justify-between w-full px-3 items-center'>
                <div className='flex gap-3'>
                    <Rating style={{maxWidth: 110}} value={product.ratings} readOnly itemStyles={myStyles}/>
                    <p className='text-sm text-neutral-700 group-hover:text-neutral-400 font-semibold'>{`(${product.numOfReviews} Review Count)`}</p>
                </div>

                <div className='font-bold text-2xl text-green-500 mt-3'>{`₹${product.price}`}</div>
            </div>
        </div>
    )
}

export default ProductCard