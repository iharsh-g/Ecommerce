import React from 'react'

function CartItemCard({item, confirmation = false}) {
    return (
        <div className='flex justify-between items-center border-b-2 border-neutral-400 pb-3 sm:flex-row flex-col'>
            <div className='flex items-center gap-3'>
                <img src={confirmation ? item.productImage : item.image} alt='' className='w-[120px] h-[150px]'/>
                <p className='font-semibold'>{confirmation ? item.productName : item.name}</p>
            </div>

            <div className='flex gap-2 min-[420px]:mt-0 mt-5'>
                <div className='flex gap-2'>
                    <p>{item.quantity}</p>
                    <p>{`X ${confirmation ? item.productPrice : item.price} =`}</p>
                </div>

                <p className='font-semibold'>{`₹${item.quantity * (confirmation ? item.productPrice : item.price)}`}</p>
            </div>
        </div>
    )
}

export default CartItemCard