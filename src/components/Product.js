import React from 'react'
import ProductCard from './ProductCard.js'

function Product({products}) {
    
    return (
        <div>
            <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-5 gap-y-3 px-3 py-3 items-baseline '>
                { products && products.map((product) => 
                    <ProductCard key={product._id} product={product}/>
                ) }
            </div>
        </div> 
    )
}

export default Product