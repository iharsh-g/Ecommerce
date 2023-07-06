import React from 'react'
import { useDispatch } from 'react-redux'
import { removeItem, updateItem } from '../redux/slices/cartSlice';
import { toast } from 'react-hot-toast';

function CartItem({item}) {
    const dispatch = useDispatch();

    function deleteItemHandler() {
        dispatch(removeItem(item.productId));
        toast.success("Item Deleted");
    }

    function handlerIncreaseQuantity() {
        if(item.quantity < item.stock) {
        
            const updatedCartItem = {
                ...item,
                quantity: item.quantity + 1
            };

            dispatch(updateItem(updatedCartItem));
        }
        else {
            toast.error(`Connot add item more than ${item.stock}`);
        }
    }

    function handlerDecreaseQuantity() {
        if(item.quantity > 1) {
            const updatedCartItem = {
                ...item,
                quantity: item.quantity - 1
            };

            dispatch(updateItem(updatedCartItem));
        }
        else {
            deleteItemHandler();
        }
    }

    return (
        <div className='flex items-center gap-5 p-5 relative'>
            <div className='sm:w-[40%] w-[50%]'>
                <img src={item.productImage} alt='' className='sm:h-[250px] h-[200px]'/>
            </div>

            <div className='flex sm:w-[60%] w-[50%] flex-col gap-3'>
                <p className='text-2xl font-semibold'>{item.productName}</p>

                <p className='text-green-500 text-xl font-bold'>{`₹${item.productPrice}`}</p>
                
                <div className='flex flex-col gap-1 mt-3'>
                    <hr className='border-neutral-500'/>
                    <p className='text-base font-semibold'>Quantity:</p>

                    <div className='flex gap-3 items-center'>
                        <div className='bg-red-400 px-[14px] py-1 rounded-md text-white font-bold cursor-pointer hover:bg-red-600 duration-200 transition-all' onClick={handlerDecreaseQuantity}>-</div>

                        <p>{item.quantity}</p>

                        <div className='bg-red-400 px-[12px] py-1 rounded-md text-white font-bold cursor-pointer hover:bg-red-600 duration-200 transition-all' onClick={handlerIncreaseQuantity}>+</div>
                    </div>
                    <hr className='mt-3 border-neutral-500'/>
                </div>

                <div className='bg-yellow-500 w-fit text-white py-2 px-5 rounded-xl mt-3 cursor-pointer transition-all 
                    duration-200 hover:bg-yellow-400' onClick={deleteItemHandler}>
                    Delete Item
                </div>
            </div>
        </div>
    )
}

export default CartItem