import React, { useEffect, useState } from 'react'
import { fetchUserOrders } from '../redux/services/operations/orderApi';
import Loader from '../components/Loader'
import {Table, Thead, Tbody, Tr, Th, Td} from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { Link, useNavigate } from 'react-router-dom';

function MyOrders() {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    async function getMyOrders() {
        setLoading(true);

        try {
            const response = await fetchUserOrders();
            setOrders(response);
            // console.log(response);
        }
        catch(error) {
            console.log(error);
        }

        setLoading(false);
    }

    useEffect(() => {
        getMyOrders();
    }, []);

    function orderDetailsHandle(id) {
        navigate(`/order/${id}`);
    }

    return (
        <div className='min-h-[69vh]'>
            <div className='max-w-[1200px] mx-auto min-h-[69vh] px-3'>
                {
                    loading ? <div className='min-h-[60vh] flex items-center justify-center'><Loader/></div> : 
                    <div className='py-10'>
                        {
                            orders && orders?.length > 0 ?
                            <div>
                                <p className='text-center font-bold text-4xl pb-7'>My Orders</p>
                                
                                <Table>
                                    <Thead className="border border-black bg-yellow-500 text-lg">
                                        <Tr>
                                            <Th className="py-2 border border-black px-1">Order ID</Th>
                                            <Th className="py-2 border border-black px-1">Order Date</Th>
                                            <Th className="py-2 border border-black px-1">Price</Th>
                                            <Th className="py-2 border border-black px-1">Status</Th>
                                            <Th className="py-2 border border-black px-1">Payment</Th>
                                            <Th className="py-2 border border-black px-1">Payment ID</Th>
                                            <Th className="py-2 border border-black px-1">Action</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody className="border border-black">
                                        {
                                            orders?.map((order) => (
                                                <Tr key={order?._id} className="text-center">
                                                    <Td className="py-2 border border-black px-1">{order?._id}</Td>
                                                    <Td className="py-2 border border-black px-1">
                                                        {new Date(order?.createdAt).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            })
                                                        },{' '}
                                                        {new Date(order?.createdAt).toLocaleTimeString('en-IN', {
                                                            hour: 'numeric',
                                                            minute: 'numeric',
                                                            hour12: true,
                                                            timeZone: 'Asia/Kolkata',
                                                        }).replace(/\b(am|pm)\b/gi, match => match.toLocaleUpperCase())}
                                                        {' (IST)'}
                                                    </Td>
                                                    <Td className="py-2 border border-black px-1">Rs. {order?.totalPrice}</Td>
                                                    <Td className={`py-2 border border-black px-1 ${order?.orderStatus === 'Delivered' ? 
                                                    'text-green-600' : order?.orderStatus === 'Shipped' ? 'text-blue-500' : 'text-red-500'}`}>{order?.orderStatus}</Td>
                                                    <Td className={`py-2 border border-black px-1 font-semibold ${order?.paymentInfo?.status === 'Succeded' ? 'text-green-600' : 'text-red-500'} `}>{order?.paymentInfo?.status}</Td>
                                                    <Td className="py-2 border border-black px-1">{order?.paymentInfo?.id}</Td>
                                                    <Td className="py-2 border border-black px-1">
                                                        <p className='cursor-pointer hover:text-green-700 transition-all duration-200 hover:scale-110 font-semibold' onClick={() => orderDetailsHandle(order?._id)}>
                                                            See Details
                                                        </p>
                                                    </Td>
                                                </Tr>
                                            ))
                                        }
                                    </Tbody>
                                </Table>
                            </div>
                            : 
                            <div className='flex flex-col items-center justify-center min-h-[60vh]'>
                                <p className='text-2xl font-semibold'>No Orders Found</p>
                                <Link to={'/products'}>
                                    <button className='px-5 py-2 bg-green-600 rounded-md text-white font-semibold mt-4 cursor-pointer'>Go to Products</button>
                                </Link>
                            </div>
                        }
                    </div>
                    
                }
                
            </div>
        </div>
    )
}

export default MyOrders
